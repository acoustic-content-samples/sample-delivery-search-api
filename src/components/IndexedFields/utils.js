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

import TextControlGroup from '../TextControlGroup/TextControlGroup';
import SelectControlGroup from '../SelectControlGroup/SelectControlGroup';
import DateControlGroup from '../DateControlGroup/DateControlGroup';

export const renderFieldGroup = fieldType => {
  const table = {
    textInput: props => <TextControlGroup key={props.field} {...props} />,
    datePicker: props => <DateControlGroup key={props.field} {...props} />,
    dropdown: props => <SelectControlGroup key={props.field} {...props} />,
  };

  return table[fieldType];
};
