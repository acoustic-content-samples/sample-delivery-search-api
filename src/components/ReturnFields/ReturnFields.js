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
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';
import respStyles from '../ResponseSettings/ResponseSettings.module.scss';
import './ReturnFields.scss';

export default function ReturnFields({ fields }) {
  const context = useContext(FormContext);
  const [returnFields, setReturnFields] = useState(
    context.queryData.returnFields
  );

  useEffect(() => setReturnFields(context.queryData.returnFields), [
    context.queryData.returnFields,
  ]);

  /**
   * Checks if the given field is included into the return fields' set.
   *
   * @param {string} returnField
   * @returns {boolean}
   */
  const isReturnFieldChecked = returnField =>
    returnFields.includes(returnField);

  /**
   * Toggles including the passed field to the return fields' set.
   *
   * @param {Event} e
   */
  const handleSelectChange = e => {
    context.toggleReturnField(e.target.value[0]);
  };

  /**
   * Exclude the given field from the return fields when its chip's delete
   * button is clicked.
   *
   * @param {string} value
   */
  const handleChipDelete = (e, value) =>
    context.excludeFieldFromResponse(value);

  /**
   * Renders the select's placeholder text.
   *
   *
   */
  const renderPlaceHolder = () => (
    <span style={{ color: '#a1a1a1' }}>Select fields to return</span>
  );

  return (
    <>
      <div className={formStyles.formGroup}>
        <div className={formStyles.formLabel}></div>
        <p className={formStyles.formWideControl}>
          <b>Response Settings</b>
        </p>
      </div>
      <div className={formStyles.formGroup}>
        <p className={formStyles.formLabel}>&nbsp;</p>
        <div className={formStyles.formWideControl}>
          <FormControl variant="outlined">
            <InputLabel id="return-fields-select-label" />
            <MaterialSelect
              id="return-fields-select"
              multiple
              value={[]}
              onChange={handleSelectChange}
              displayEmpty
              renderValue={renderPlaceHolder}
            >
              <MenuItem key="All" value="All">
                <Checkbox
                  checked={isReturnFieldChecked('All')}
                  color="primary"
                />
                <ListItemText primary="All" />
              </MenuItem>
              <MenuItem key="document" value="document">
                <Checkbox
                  checked={isReturnFieldChecked('document')}
                  color="primary"
                />
                <ListItemText primary="document" />
              </MenuItem>
              {fields.map(field => (
                <MenuItem key={field} value={field}>
                  <Checkbox
                    checked={isReturnFieldChecked(field)}
                    color="primary"
                  />
                  <ListItemText primary={field} />
                </MenuItem>
              ))}
            </MaterialSelect>
          </FormControl>
        </div>
      </div>
      {!!context.queryData.returnFields.length && (
        <div className={formStyles.formGroup}>
          <div className={formStyles.formLabel}></div>
          <div
            className={`${formStyles.formWideControl} ${respStyles.chipsGroup}`}
          >
            {context.queryData.returnFields.map(field => {
              return (
                <Chip
                  key={field}
                  label={field}
                  onDelete={e => handleChipDelete(e, field)}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
