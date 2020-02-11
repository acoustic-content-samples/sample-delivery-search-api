/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useContext, useState, useEffect } from 'react';
import omit from 'lodash.omit';
import isEqual from 'lodash.isequal';

import Select from '../common/Select/Select';
import { FormContext } from '../Form/Form';
import { examples } from '../../config/examples';
import formStyles from '../Form/Form.module.scss';
import searchQueryStyles from './SearchQueryExamples.module.scss';

export default function SearchQueryExamples() {
  const context = useContext(FormContext);
  const examplesKeys = Object.keys(examples);
  const [example, setExample] = useState('');
  const [exampleData, setExampleData] = useState(null);

  const checkExampleDataChanged = () => {
    if (context.queryData && exampleData) {
      const subset = omit(context.queryData, 'tenantUrl');
      return !isEqual(subset, exampleData);
    }
  };

  useEffect(() => {
    if (checkExampleDataChanged()) {
      setExample('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.queryData]);

  /**
   * Loads the given example data to the search.
   *
   * @param {Event} e
   */
  const handleSelectChange = e => {
    const value = e.target.value;
    setExample(value);
    const data = examples[value];
    if (data) {
      setExampleData(data);
      context.loadExample(examples[value]);
    }
  };

  return (
    <div className={formStyles.formGroup}>
      <p className={formStyles.formLabel}>Search Query Examples</p>
      <Select
        id="search-query-examples-select"
        className={searchQueryStyles.examplesSelect}
        value={example}
        onChange={handleSelectChange}
        items={examplesKeys}
        placeholderText="Custom"
      />
    </div>
  );
}
