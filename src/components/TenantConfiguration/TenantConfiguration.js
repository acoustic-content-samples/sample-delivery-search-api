/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState, useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Input from '../common/Input/Input';
import { FormContext } from '../Form/Form';
import { tenantApi } from '../../api/tenantApi';
import formStyles from '../Form/Form.module.scss';
import tenantConfigStyles from './TenantConfiguration.module.scss';

export default function TenantConfiguration() {
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);

  const context = useContext(FormContext);

  /**
   * Sets the current input value as the tenant url and checks its validity. If
   * not valid shows the error message.
   *
   * @param {Event} e
   */
  const onInputBlur = e => {
    const url = e.target.value;
    setLoading(true);

    if (url) {
      tenantApi
        .checkTenantUrl(url)
        .then(() => setUrlError(false))
        .catch(() => setUrlError(true))
        .finally(() => setLoading(false));
    } else {
      setUrlError(false);
      setLoading(false);
    }

    context.updateQueryData('tenantUrl', url);
  };

  return (
    <div className={formStyles.formGroup}>
      <p className={formStyles.formLabel}>Tenant API URL*</p>
      <div className={tenantConfigStyles.tenantUrlInput}>
        <Input
          id="tenant-url"
          error={urlError}
          fullWidth={true}
          placeholder="https://content-xx-x.content-cms.com/api/00000000-0000-0000-0000-00000000fcb"
          onBlur={onInputBlur}
        />
      </div>
      {loading && <CircularProgress size={24} className="" />}
      {urlError && (
        <div className={tenantConfigStyles.error}>
          <p>Connection to the specified tenant could not be established.</p>
          <p>Please review the URL for correctness.</p>
        </div>
      )}
    </div>
  );
}
