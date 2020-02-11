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
import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import IconButton from '../common/IconButton/IconButton';
import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';
import indexedFieldsStyles from '../IndexedFields/IndexedFields.module.scss';

export default function TextControlGroup({
  value,
  option,
  conditions,
  operators,
  field,
  fieldIndex,
}) {
  const [valueText, setValueText] = useState(value.text || '');
  const [condition, setCondition] = useState(option.condition || conditions[0]);
  const [operator, setOperator] = useState(option.operator || operators[0]);

  const context = useContext(FormContext);

  useEffect(() => setValueText(value.text || ''), [value]);
  useEffect(() => setCondition(option.condition || ''), [option.condition]);
  useEffect(() => setOperator(option.operator || ''), [option.operator]);

  /**
   * Changes the text field search condition: namely, if the search field should
   * exactly be equal to the given value or to include it.
   *
   * @param {Event} e
   */
  const handleConditionSelectChange = e => {
    const selectValue = e.target.value;
    context.updateQueryData(
      `searchFields[${fieldIndex}].option.condition`,
      selectValue
    );
    setCondition(selectValue);
  };

  /**
   * Changes the way the value passed to the search field is treated: a single
   * value, comma separated multiple values with 'or' or 'and' operator.
   *
   * @param {Event} e
   */
  const handleOperatorSelectChange = e => {
    const selectValue = e.target.value;
    context.updateQueryData(
      `searchFields[${fieldIndex}].option.operator`,
      selectValue
    );
    setOperator(selectValue);
  };

  /**
   * Sets the value to search for the field.
   *
   * @param {Event} e
   */
  const handleInputChange = e => {
    const inputValue = e.target.value;
    context.updateQueryData(
      `searchFields[${fieldIndex}].value.text`,
      inputValue
    );
    setValueText(inputValue);
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
        id={`${field}-condition-select`}
        className={indexedFieldsStyles.indexedFieldControl}
        value={condition}
        onChange={handleConditionSelectChange}
        items={conditions}
      />
      <Select
        id={`${field}-operator-select`}
        className={indexedFieldsStyles.indexedFieldControl}
        value={operator}
        onChange={handleOperatorSelectChange}
        items={operators}
      />
      <Input
        id={`${field}-value-text`}
        className={indexedFieldsStyles.indexedFieldControl}
        value={valueText}
        onInput={handleInputChange}
      />
      <div className={indexedFieldsStyles.indexedFieldClearButton}>
        <IconButton onClick={handleDeleteClick} icon="clear" />
      </div>
    </div>
  );
}
