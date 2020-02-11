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
import TextField from '@material-ui/core/TextField';

import './Input.scss';

export default function Input({
  id,
  className,
  error,
  fullWidth,
  type,
  inputProps,
  value,
  placeholder,
  inputRef,
  onInput,
  onBlur,
  onKeyDown,
}) {
  return (
    <div className={className}>
      <TextField
        id={id}
        error={error}
        variant="outlined"
        fullWidth={fullWidth}
        type={type}
        inputProps={inputProps}
        value={value}
        placeholder={placeholder}
        inputRef={inputRef}
        onInput={onInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
