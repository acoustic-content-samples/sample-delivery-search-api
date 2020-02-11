/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker({ id, error, disabled, value, onChange }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        id={id}
        error={error}
        disableToolbar
        disabled={disabled}
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy"
        invalidDateMessage="Invalid date format"
        maxDateMessage=""
        minDateMessage=""
        value={value}
        onChange={onChange}
      />
    </MuiPickersUtilsProvider>
  );
}
