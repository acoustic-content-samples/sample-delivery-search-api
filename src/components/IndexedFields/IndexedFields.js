/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState, useContext, useEffect } from 'react';

import { fieldsConfig } from '../../config/fields';
import Input from '../common/Input/Input';
import { FormContext } from '../Form/Form';
import { renderFieldGroup } from './utils';
import formStyles from '../Form/Form.module.scss';
import indexedFieldsStyles from './IndexedFields.module.scss';

export default function IndexedFields({ isFieldBeingAdded }) {
  const context = useContext(FormContext);

  const [fieldName, setFieldName] = useState('');
  const [indexedFields, setIndexedFields] = useState(
    context.queryData.searchFields
  );
  const [manualFieldInput, setManualFieldInput] = useState(null);

  useEffect(() => {
    const {
      queryData: { searchFields },
    } = context;
    setIndexedFields(searchFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.queryData.searchFields]);

  useEffect(() => {
    if (manualFieldInput) {
      manualFieldInput.focus();
    }
  }, [manualFieldInput]);

  /**
   * Adds a new value to the set of the manual fields.
   *
   */
  const addManualField = () => {
    if (fieldName) {
      context.addManualField(fieldName);
      setFieldName('');
    }
    context.updateIsFieldBeingAdded(false);
  };

  /**
   * Handles adding the input value as a new custom field on loosing focus.
   *
   */
  const handleBlur = () => addManualField();

  /**
   * Handles adding the input value as a new custom field on pressing 'Enter'.
   *
   */
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      addManualField();
    }
  };

  return (
    <>
      {indexedFields.map((searchField, fieldIndex) => {
        const { field, option, value } = searchField;
        const configValue = fieldsConfig[field]
          ? fieldsConfig[field]
          : Object.values(fieldsConfig).find(
              el => el.controlType === 'textInput'
            );
        return renderFieldGroup(configValue.controlType)({
          field,
          fieldIndex,
          value,
          option,
          options: configValue.options,
          conditions: configValue.conditions,
          operators: configValue.operators,
          api: configValue.api,
        });
      })}
      {isFieldBeingAdded && (
        <div className={formStyles.indexedField}>
          <div className={formStyles.formLabel}>&nbsp;</div>
          <div className={indexedFieldsStyles.indexedFieldLabel}>
            <Input
              id="manual-field"
              inputRef={el => setManualFieldInput(el)}
              onInput={e => setFieldName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </>
  );
}
