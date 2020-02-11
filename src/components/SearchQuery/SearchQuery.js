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
import Link from '@material-ui/core/Link';

import { FormContext } from '../Form/Form';
import formStyles from '../Form/Form.module.scss';
import queryLinkStyles from './SearchQuery.module.scss';
import { buildLink } from './utils';

export default function SearchQuery() {
  const [queryData, setQueryData] = useState({});
  const context = useContext(FormContext);
  useEffect(() => setQueryData(context.queryData), [context.queryData]);
  const link = buildLink(queryData, context);

  return (
    <div className={formStyles.formGroup}>
      <p className={formStyles.formLabel}>Search Query</p>
      <div className={queryLinkStyles.queryLink}>
        <Link href={link} target="_blank" rel="noopener noreferrer">
          {link || ''}
        </Link>
      </div>
    </div>
  );
}
