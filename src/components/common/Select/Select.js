/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import './Select.scss';

export default function Select({
  id,
  placeholderText,
  className,
  items,
  value,
  showNone,
  onChange,
  isCollection,
}) {
  const renderSelectedValue = value =>
    isCollection ? items.find(item => item.id === value).name : value;

  /**
   * Renders display value for selected option or placeholder
   *
   * @param {string} value selected option value
   */
  const renderDisplayValue = selectValue =>
    selectValue ? (
      renderSelectedValue(selectValue)
    ) : (
      <span style={{ color: '#a1a1a1' }}>{placeholderText}</span>
    );

  return (
    <div className={className}>
      <FormControl variant="outlined">
        <InputLabel id={`${id}-label`} />
        <MaterialSelect
          labelId={`${id}-label`}
          id={id}
          disabled={!items.length}
          value={value}
          onChange={onChange}
          displayEmpty
          renderValue={renderDisplayValue}
        >
          {showNone && (
            <MenuItem key="none" value="None">
              None
            </MenuItem>
          )}
          {items.map(item => {
            const value = isCollection ? item.id : item;
            const label = isCollection ? item.name : item;
            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </MaterialSelect>
      </FormControl>
    </div>
  );
}
