/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useContext } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';

import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';
import fieldSelectStyles from './FieldSelect.module.scss';

export default function FieldSelect({ fields }) {
  const context = useContext(FormContext);

  /**
   * Renders the placeholder text when the selected value is falsey.
   *
   * @param {string} value selected option value
   */
  const renderPlaceHolder = value => {
    return value ? (
      value
    ) : (
      <span style={{ color: '#a1a1a1' }}>Select field name</span>
    );
  };

  /**
   * Adds the given field to the search fields or enables the input for typing
   * in a manual field.
   *
   * @param {Event} e select change event
   */
  const handleSelectChange = e => {
    const value = e.target.value;
    value === 'addManualField'
      ? context.updateIsFieldBeingAdded(true)
      : context.includeFieldToSearch(value);
  };

  return (
    <div className={formStyles.formGroup}>
      <p className={formStyles.formLabel}>Indexed Fields</p>
      <div className={formStyles.formWideControl}>
        <FormControl variant="outlined">
          <Select
            id="indexed-field-select"
            value=""
            onChange={handleSelectChange}
            displayEmpty
            renderValue={renderPlaceHolder}
          >
            <MenuItem value="addManualField">
              <Icon className={fieldSelectStyles.addIcon} color="primary">
                add
              </Icon>
              <span>Enter field name manually</span>
            </MenuItem>
            {fields.map(field => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
