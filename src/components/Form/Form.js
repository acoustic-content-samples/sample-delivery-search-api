/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState, createContext } from 'react';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';

import TenantConfiguration from '../TenantConfiguration/TenantConfiguration';
import FieldSelect from '../FieldSelect/FieldSelect';
import ClassificationSelect from '../ClassificationSelect/ClassificationSelect';
import IndexedFields from '../IndexedFields/IndexedFields';
import ResponseSettings from '../ResponseSettings/ResponseSettings';
import SearchQueryExamples from '../SearchQueryExamples/SearchQueryExamples';
import SearchQuery from '../SearchQuery/SearchQuery';
import CopyButton from '../CopyButton/CopyButton';
import { classifications } from '../../config/fields';
import { getFieldsByClassification } from './utils';
import formStyles from './Form.module.scss';

export const FormContext = createContext('');

export default function Form() {
  const [manualFields, setManualFields] = useState([]);
  const [availableFields, setAvailableFields] = useState(
    getFieldsByClassification(classifications[0])
  );
  const [queryData, setQueryData] = useState({
    classification: classifications[0],
    searchFields: [],
    returnFields: ['All'],
  });
  const [isFieldBeingAdded, setIsFieldBeingAdded] = useState(false);
  const [link, setLink] = useState('');

  /**
   * Updates fields' availability based on the current chosen classification.
   * Different classifications may have different sets of available fields as
   * it is set in config/fields.js. This also filters the current search fields'
   * set and return fields's since after applying another classification they
   * may include the fields that do not belong to it. The same applies to the
   * current sorting field.
   *
   * @param {string} value - classification
   */
  const updateFieldsAvailability = value => {
    const searchFieldsClone = getFieldsByClassification(
      value,
      queryData.searchFields
    );
    const returnFieldsClone = getFieldsByClassification(
      value,
      queryData.returnFields
    );
    const availableFieldsClone = getFieldsByClassification(value);
    setAvailableFields(availableFieldsClone);
    const queryDataToSet = {
      ...queryData,
      searchFields: searchFieldsClone,
      returnFields: returnFieldsClone,
    };
    const { sortByField } = queryData;
    if (sortByField) {
      queryDataToSet.sortByField = sortByField;
    }
    setQueryData(queryDataToSet);
  };

  /**
   * Returns an array of field names which are currently available for adding
   * to the search. The array comprises the pre-defined fields, the manually
   * added fields with the exception for the ones that have already been used
   * for searching.
   *
   * @returns {string[]} field - names available to incude into the search
   */
  const getAvailableSearchFields = () => {
    const takenSearchFields = queryData.searchFields.map(searchField => {
      return searchField.field;
    });
    return [...availableFields, ...manualFields].filter(
      field => !takenSearchFields.includes(field)
    );
  };

  /**
   * Adds the given field to the search.
   *
   * @param {string} field - field to add to the search
   */
  const includeFieldToSearch = field => {
    const searchFieldsClone = [...queryData.searchFields];
    searchFieldsClone.push({ field, option: {}, value: {} });
    setQueryData({ ...queryData, searchFields: searchFieldsClone });
  };

  /**
   * Excludes the given field from the search. This also ensures it is removed
   * from the manual fields set if it was a manual one and also from the set of
   * the selected return fields if it was there.
   *
   * @param {string} field - field to exclude from the search
   */
  const excludeFieldFromSearch = field => {
    const searchFieldsClone = queryData.searchFields.filter(searchField => {
      return searchField.field !== field;
    });
    const manualFieldsClone = manualFields.filter(manualField => {
      return manualField !== field;
    });
    const returnFieldsClone = queryData.returnFields.filter(returnField => {
      return (
        ['All', 'document'].includes(returnField) ||
        availableFields.includes(returnField) ||
        manualFieldsClone.includes(returnField)
      );
    });
    setQueryData({
      ...queryData,
      searchFields: searchFieldsClone,
      returnFields: returnFieldsClone,
    });
    setManualFields(manualFieldsClone);
  };

  /**
   * Adds the given field name to the set of manual fields if the set has not
   * got that field name already. At the same time icludes the field into the
   * search.
   *
   * @param {string} field - manual field to include to the search
   */
  const addManualField = field => {
    if (!manualFields.includes(field)) {
      const manualFieldsClone = [...manualFields];
      manualFieldsClone.push(field);
      setManualFields(manualFieldsClone);
      includeFieldToSearch(field);
    }
  };

  /**
   * Sets the manual field input's visibility.
   *
   * @param {boolean} value
   */
  const updateIsFieldBeingAdded = value => setIsFieldBeingAdded(value);

  const updateQueryData = (keysPath, value) => {
    const queryDataClone = { ...queryData };
    set(queryDataClone, keysPath, value);
    setQueryData(queryDataClone);
  };

  /**
   * Includes the given field to the set of the return fields.
   *
   * @param {string} field - field to include to the return fields' set
   */
  const includeFieldToResponse = field => {
    const returnFieldsWithoutAll = queryData.returnFields.filter(
      returnField => returnField !== 'All'
    );
    returnFieldsWithoutAll.push(field);
    setQueryData({ ...queryData, returnFields: returnFieldsWithoutAll });
  };

  /**
   * Excludes the given field from the array of the return fields.
   *
   * @param {string} field - field to exclude from the return fields' set
   */
  const excludeFieldFromResponse = field => {
    const returnFieldsClone = queryData.returnFields.filter(returnField => {
      return returnField !== field;
    });
    setQueryData({ ...queryData, returnFields: returnFieldsClone });
  };

  /**
   * Toggles inclusion of the given field to the return fields' set. 'All' has a
   * special meaning which allows either to exclude all of the fields from the
   * response or to include the all possible into.
   *
   * @param {string} field - field to toggle its inclusion in the return fields
   */
  const toggleReturnField = field => {
    if (field === 'All') {
      queryData.returnFields.includes('All')
        ? setQueryData({ ...queryData, returnFields: [] })
        : setQueryData({ ...queryData, returnFields: ['All'] });
    } else {
      queryData.returnFields.includes(field)
        ? excludeFieldFromResponse(field)
        : includeFieldToResponse(field);
    }
  };

  /**
   * Clears the return fields' set.
   *
   */
  const clearReturnFields = () => {
    setQueryData({ ...queryData, returnFields: [] });
  };

  /**
   * Loads the given pre-defined search data.
   *
   * @param {Object} exampleData - example data to fill in the current search
   */
  const loadExample = exampleData => {
    setQueryData({
      tenantUrl: queryData.tenantUrl,
      ...cloneDeep(exampleData),
    });
  };

  return (
    <FormContext.Provider
      value={{
        queryData,
        updateQueryData,
        updateFieldsAvailability,
        includeFieldToSearch,
        excludeFieldFromSearch,
        addManualField,
        updateIsFieldBeingAdded,
        excludeFieldFromResponse,
        toggleReturnField,
        clearReturnFields,
        loadExample,
        setLink,
      }}
    >
      <div className={formStyles.formContainer}>
        <h3>Acoustic Content Delivery Search Sample</h3>
        <TenantConfiguration />
        <ClassificationSelect />
        <FieldSelect fields={getAvailableSearchFields()} />
        <IndexedFields isFieldBeingAdded={isFieldBeingAdded} />
        <ResponseSettings fields={[...availableFields, ...manualFields]} />
        <SearchQueryExamples />
        <SearchQuery />
        <CopyButton link={link} />
      </div>
    </FormContext.Provider>
  );
}
