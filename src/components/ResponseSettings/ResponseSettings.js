/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState, useEffect, useContext } from 'react';

import ReturnFields from '../ReturnFields/ReturnFields';
import Select from '../common/Select/Select';
import Input from '../common/Input/Input';
import { FormContext } from '../Form/Form';
import { excludedSorters } from '../../config/fields';
import formStyles from '../Form/Form.module.scss';
import respStyles from './ResponseSettings.module.scss';

export default function ResponseSettings({ fields }) {
  const [currentRowsNumber, setCurrentRowsNumber] = useState('');
  const [currentStartRow, setCurrentStartRow] = useState('');
  const [currentSortByField, setCurrentSortByField] = useState('');
  const [currentSortOrder, setCurrentSortOrder] = useState('');
  const [rowsError, setRowsError] = useState(false);
  const [startRowError, setStartRowError] = useState(false);

  const context = useContext(FormContext);
  const { rowsNumber, startRow, sortByField, sortOrder } = context.queryData;

  /**
   * Checks if the string may be cast to an integer in the given range.
   *
   * @param {string} number
   * @param {number} min=0
   * @param {number} max=Number.MAX_SAFE_INTEGER
   * @returns {boolean}
   */
  const isValidInteger = (number, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const int = Number(number);

    if (Number.isNaN(int)) {
      return false;
    }

    return Number.isInteger(int) && int >= min && int <= max ? true : false;
  };

  useEffect(() => {
    setRowsError(
      !rowsNumber || isValidInteger(rowsNumber, 1, 1000) ? false : true
    );
    setCurrentRowsNumber(rowsNumber || '');
  }, [rowsNumber]);

  useEffect(() => {
    setStartRowError(!startRow || isValidInteger(startRow) ? false : true);
    setCurrentStartRow(startRow || '');
  }, [startRow]);

  useEffect(() => setCurrentSortByField(sortByField || 'None'), [sortByField]);
  useEffect(() => setCurrentSortOrder(sortOrder || ''), [sortOrder]);

  /**
   * Set the search return rows number.
   *
   * @param {Event} e
   */
  const handleRowsInput = e => {
    const value = e.target.value;
    context.updateQueryData('rowsNumber', value);
    setCurrentRowsNumber(value);
  };

  /**
   * Set the search start row offset.
   *
   * @param {Event} e
   */
  const handleStartRow = e => {
    const value = e.target.value;
    context.updateQueryData('startRow', value);
    setCurrentStartRow(value);
  };

  /**
   * Set the search sorting field.
   *
   * @param {Event} e
   */
  const handleSortFieldChange = e => {
    const value = e.target.value;
    context.updateQueryData('sortByField', value);
    setCurrentSortByField(value);
  };

  /**
   * Set the search sorting order.
   *
   * @param {Event} e
   */
  const handleSortOrderChange = e => {
    const value = e.target.value;
    context.updateQueryData('sortOrder', value);
    setCurrentSortOrder(value);
  };

  /**
   * Limits the set of fields the search can be sort by.
   *
   */
  const filterSortFields = () => {
    return fields.filter(field => !excludedSorters.includes(field));
  };

  return (
    <>
      <ReturnFields fields={fields} />
      <div className={formStyles.formGroup}>
        <p className={formStyles.formLabel}>Return N rows</p>
        <div
          className={`${formStyles.formWideControl} ${respStyles.inputGroup}`}
        >
          <Input
            id="rows-number"
            className={formStyles.formNarrowControl}
            placeholder="10"
            error={rowsError}
            value={currentRowsNumber}
            onInput={handleRowsInput}
          />
          {rowsError && (
            <p className={respStyles.error}>
              An integer between 1 and 1000 is only allowed
            </p>
          )}
        </div>
      </div>
      <div className={formStyles.formGroup}>
        <p className={formStyles.formLabel}>Start from row number</p>
        <div
          className={`${formStyles.formWideControl} ${respStyles.inputGroup}`}
        >
          <Input
            id="start-row"
            className={formStyles.formNarrowControl}
            placeholder="0"
            error={startRowError}
            value={currentStartRow}
            onInput={handleStartRow}
          />
          {startRowError && (
            <p className={respStyles.error}>
              An integer greater than or equal 0 is only allowed
            </p>
          )}
        </div>
      </div>
      <div className={formStyles.formGroup}>
        <p className={formStyles.formLabel}>Sort by</p>
        <div
          className={`${formStyles.formWideControl} ${respStyles.sortGroup}`}
        >
          <Select
            id="sort-field-select"
            className={formStyles.formNarrowControl}
            value={currentSortByField || 'None'}
            items={filterSortFields()}
            showNone={true}
            onChange={handleSortFieldChange}
            placeholderText="Select field name"
          />
          <p className={formStyles.formInBetweenLabel}>in</p>
          <Select
            id="sort-order-select"
            className={formStyles.formNarrowControl}
            value={currentSortOrder || 'Ascending'}
            items={['Ascending', 'Descending']}
            onChange={handleSortOrderChange}
            placeholderText="Select sort order"
          />
        </div>
      </div>
    </>
  );
}
