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

import Select from '../common/Select/Select';
import { classifications } from '../../config/fields';
import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';

export default function ClassificationSelect() {
  const [currentClassification, setCurrentClassification] = useState(
    classifications[0]
  );
  const context = useContext(FormContext);

  useEffect(() => {
    const classification =
      context.queryData.classification || classifications[0];
    setCurrentClassification(classification);
    context.updateFieldsAvailability(classification);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.queryData.classification]);

  /**
   * Handles changing the current classification.
   *
   * @param {Event} e select change event
   */
  const handleSelectChange = e => {
    const value = e.target.value;
    setCurrentClassification(value);
    context.updateFieldsAvailability(value);
    context.updateQueryData('classification', value);
  };

  return (
    <div className={formStyles.formGroup}>
      <p className={formStyles.formLabel}>Classification</p>
      <Select
        id="classification-select"
        className={formStyles.formWideControl}
        value={currentClassification}
        onChange={handleSelectChange}
        items={classifications}
      />
    </div>
  );
}
