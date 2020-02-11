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

import SearchFieldLabel from '../common/SearchFieldLabel/SearchFieldLabel';
import Select from '../common/Select/Select';
import DatePicker from '../common/DatePicker/DatePicker';
import IconButton from '../common/IconButton/IconButton';
import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';
import indexedFieldsStyles from '../IndexedFields/IndexedFields.module.scss';

export default function DateControlGroup({
  option,
  value,
  fieldIndex,
  field,
  options,
}) {
  const [currentOption, setCurrentOption] = useState(option.dateRange || '');
  const [startDate, setStartDate] = useState(value.startDate || null);
  const [startDateError, setStartDateError] = useState(false);
  const [endDate, setEndDate] = useState(value.endDate || null);
  const [endDateError, setEndDateError] = useState(false);

  const context = useContext(FormContext);

  useEffect(() => setCurrentOption(option.dateRange || ''), [option.dateRange]);

  /**
   * Checks if the passed date is a valid Date object.
   *
   * @param {Date} date
   * @returns {boolean}
   */
  const isValidDate = date => date instanceof Date && !isNaN(date);

  /**
   * Handles changing the current date range.
   *
   * @param {Event} e - select change event
   */
  const handleSelectChange = e => {
    const selectValue = e.target.value;
    context.updateQueryData(
      `searchFields[${fieldIndex}].option.dateRange`,
      selectValue
    );
    setCurrentOption(selectValue);
  };

  /**
   * Sets the start date of the current date range.
   *
   * @param {Date} value - date range start date
   */
  const handleStartDateChange = date => {
    const queryDataPath = `searchFields[${fieldIndex}].value.startDate`;
    setStartDate(date);

    if (date && !isValidDate(date)) {
      setStartDateError(true);
      context.updateQueryData(queryDataPath, null);
    } else {
      setStartDateError(false);
      context.updateQueryData(queryDataPath, date);
    }
  };

  /**
   * Sets the end date of the current date range.
   *
   * @param {Date} value - date range end date
   */
  const handleEndDateChange = date => {
    const queryDataPath = `searchFields[${fieldIndex}].value.endDate`;
    setEndDate(date);

    if (date && !isValidDate(date)) {
      setEndDateError(true);
      context.updateQueryData(queryDataPath, null);
    } else {
      setEndDateError(false);
      context.updateQueryData(queryDataPath, date);
    }
  };

  /**
   * Excludes the current field from the search.
   *
   */
  const handleDeleteClick = () => {
    context.excludeFieldFromSearch(field);
  };

  return (
    <div className={formStyles.indexedField}>
      <div className={formStyles.formLabel}>&nbsp;</div>
      <SearchFieldLabel value={field} />
      <Select
        id={`${field}-date-options-select`}
        className={indexedFieldsStyles.indexedFieldControl}
        value={currentOption}
        onChange={handleSelectChange}
        items={options}
      />
      <div className={indexedFieldsStyles.indexedFieldControl}>
        <DatePicker
          id={`${field}-start-date-picker`}
          error={startDateError}
          disabled={currentOption !== 'Within the dates'}
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div className={indexedFieldsStyles.indexedFieldControl}>
        <DatePicker
          id={`${field}-end-date-picker`}
          error={endDateError}
          disabled={currentOption !== 'Within the dates'}
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      <div className={indexedFieldsStyles.indexedFieldClearButton}>
        <IconButton onClick={handleDeleteClick} icon="clear" />
      </div>
    </div>
  );
}
