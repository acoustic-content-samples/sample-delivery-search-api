/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import { fieldsConfig } from '../../config/fields';
import { fieldApiNames } from '../../api/tenantApi';

/**
 * Returns a function that prints the field value depending on the condition
 * and operator.
 *
 * @param {Object} field
 * @returns {Function}
 */
const printText = field => {
  const {
    option: { condition = 'Equals', operator = 'Single value' } = {},
  } = field;

  /**
   * Removes white space in the beginning and at the end, escapes in between and
   * returns the result formatted depending on the condition.
   *
   * @param {string} text
   * @returns {string}
   */
  const printWithCondition = text => {
    text = text.trim().replace(/\s+/, '\\ ');
    return condition === 'Contains' ? `*${text}*` : text;
  };

  /**
   * Splits the given field's multi value, formats the result according to the
   * condition and returns the result joined with the given operator.
   *
   * @param {Object} field
   * @param {string} operator
   * @returns {string}
   */
  const printMultiValue = (fieldData, fieldOperator) => {
    return fieldData.value.text
      .split(',')
      .map(text => printWithCondition(text))
      .join(fieldOperator);
  };

  /**
   * Lookup table for value printers based on the field's operator.
   *
   * @constant
   * @type {Object}
   */
  const table = {
    'Multiple value (and)': fieldData =>
      `:(${printMultiValue(fieldData, ' AND ')})`,
    'Multiple value (or)': fieldData =>
      `:(${printMultiValue(fieldData, ' OR ')})`,
    'Single value': fieldData => `:${printWithCondition(fieldData.value.text)}`,
  };

  return table[operator](field);
};

/**
 * Returns a new UTC date base on the passed date's day, month, year. For start
 * dates the time is set to 00:00:000, for end dates - 23:59:59:999.
 *
 * @param {Date} date
 * @param {boolean} isEnd=false
 * @returns {Date}
 */
const dateWithoutOffset = (date, isEnd = false) => {
  let dateArgs = [date.getFullYear(), date.getMonth(), date.getDate()];
  if (isEnd) {
    dateArgs = [...dateArgs, ...[23, 59, 59, 999]];
  }
  return new Date(Date.UTC(...dateArgs));
};

/**
 * Returns a function to get a string representation of the passed date range.
 *
 * @param {Object} field
 * @returns {Function}
 */
const printDate = field => {
  const table = {
    'In the future': () => ':[NOW TO *]',
    'In the past': () => ':[* TO NOW]',
    'Within the dates': searchField =>
      `:[${dateWithoutOffset(searchField.value.startDate).toJSON()} TO ` +
      `${dateWithoutOffset(searchField.value.endDate, true).toJSON()}]`,
  };

  return table[field.option.dateRange](field);
};

/**
 * Returns a formatted string for the passed value option.
 *
 * @param {Object} field
 * @returns {string}
 */
const printDropDownValue = field => {
  let text = field.value.text;
  const mappers = {
    'Web Assets': 'NOT %5C/dxdam/*',
    'Managed Assets': '%5C/dxdam/*',
  };
  text = mappers[text] || text.toLowerCase();

  return ':' + (/\s/.test(text) ? `(${text})` : text);
};

/**
 * Lookup table for getting a field value printer depending on the field type.
 *
 * @constant
 * @type {Object}
 */
const fieldPrinters = {
  textInput: searchField => printText(searchField),
  datePicker: searchField => printDate(searchField),
  dropdown: searchField => printDropDownValue(searchField),
};

/**
 * Gets the current field configuration object. Returns a text field
 * configuration if not found.
 *
 * @param {Object} field
 * @returns {Object}
 */
const getFieldConfigValue = field => {
  return fieldsConfig[field]
    ? fieldsConfig[field]
    : Object.values(fieldsConfig).find(el => el.controlType === 'textInput');
};

/**
 * Checks if the passed field object should be included into the resulting
 * search query string. For text input fields it is checked that its value is
 * not falsey. For date fields it is verified that both start and end dates are
 * set if an arbitrary date range is chosen. For pre-defined values it is
 * checked if the value should be excluded from the search intentionally.
 *
 * @param {Object} searchField
 * @returns {boolean}
 */
const searchFieldsFilter = searchField => {
  const fieldConfigValue = getFieldConfigValue(searchField.field);
  const table = {
    textInput: fieldData => !!fieldData.value.text,
    datePicker: fieldData => {
      const {
        option: { dateRange } = {},
        value: { startDate, endDate } = {},
      } = fieldData;

      const isNotCustomDate =
        dateRange === 'In the future' || dateRange === 'In the past';
      const areCustomDatesSet =
        dateRange === 'Within the dates' && startDate && endDate;
      return isNotCustomDate || areCustomDatesSet;
    },
    dropdown: fieldData => {
      const { field } = fieldData;
      const text = fieldData.value.text;
      const exclusions = [{ fieldName: 'location', value: 'All' }];
      if (
        exclusions.some(
          ({ fieldName, value }) => fieldName === field && value === text
        )
      ) {
        return false;
      }

      return !!text;
    },
  };

  return table[fieldConfigValue.controlType](searchField);
};

/**
 * Returns a concatenated query string for the passed search fields' array.
 *
 * @param {Object[]} searchFields
 * @returns {string}
 */
const collectSearchFields = searchFields => {
  return searchFields
    .filter(searchField => searchFieldsFilter(searchField))
    .map(searchField => {
      const { field } = searchField;
      const fieldConfigValue = getFieldConfigValue(field);
      return (
        `fq=${fieldApiNames[field] || field}` +
        fieldPrinters[fieldConfigValue.controlType](searchField)
      );
    })
    .join('&');
};

/**
 * Returns a concatenated query string for the passed return fields' array.
 *
 * @param {string[]} returnFields
 * @returns {string}
 */
const collectReturnFields = returnFields => {
  if (returnFields.includes('All')) {
    return '*,document:[json]';
  }

  const mapper = {
    document: 'document:[json]',
  };

  return returnFields
    .filter(returnField => returnField)
    .map(returnField => {
      const fieldApiName = fieldApiNames[returnField] || returnField;
      return mapper[fieldApiName] || fieldApiName;
    })
    .join(',');
};

/**
 * Returns the resulting url encoded query string for the given query data.
 *
 * @param {Object} queryData
 * @param {Object} context
 * @returns {string}
 */
export const buildLink = (queryData, context) => {
  if (!Object.keys(queryData).length) {
    return;
  }

  let result = queryData.tenantUrl || 'https://myXX.digitalexperience.ibm.com/api/00000000-0000-0000-0000-00000000fcb';
  result += '/delivery/v1/search?q=*:*&fq=classification:';
  result += queryData.classification.toLowerCase();
  const { searchFields = [], returnFields = [] } = queryData;
  const searchFieldsResult = collectSearchFields(searchFields);
  result += searchFieldsResult ? '&' + searchFieldsResult : '';
  const returnFieldsResult = collectReturnFields(returnFields);
  result += returnFieldsResult ? `&fl=${returnFieldsResult}` : '';
  result += queryData.rowsNumber ? `&rows=${queryData.rowsNumber}` : '';
  result += queryData.startRow ? `&start=${queryData.startRow}` : '';
  if (queryData.sortByField && queryData.sortByField !== 'None') {
    const { sortOrder = 'Ascending' } = queryData;
    const sortOrders = { Ascending: ' asc', Descending: ' desc' };
    result += `&sort=${fieldApiNames[queryData.sortByField] ||
      queryData.sortByField}${sortOrders[sortOrder]}`;
  }
  result = result.replace(/\s/g, '%20');
  context.setLink(result);
  return result;
};
