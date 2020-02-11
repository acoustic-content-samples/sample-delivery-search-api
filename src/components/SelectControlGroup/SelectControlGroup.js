/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState, useContext, useEffect } from 'react';
import isObject from 'lodash.isobject';

import SearchFieldLabel from '../common/SearchFieldLabel/SearchFieldLabel';
import Select from '../common/Select/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '../common/IconButton/IconButton';
import { FormContext } from '../Form/Form';
import { tenantApi, fieldApiNames } from '../../api/tenantApi';
import formStyles from '../Form/Form.module.scss';
import indexedFieldsStyles from '../IndexedFields/IndexedFields.module.scss';

export default function SelectControlGroup({
  options,
  value,
  field,
  fieldIndex,
  api,
}) {
  const [currentOptions, setCurrentOptions] = useState(options || ['']);
  const [currentOption, setCurrentOption] = useState(
    value.text || (options ? options[0] : '')
  );
  const [loading, setLoading] = useState(false);
  const context = useContext(FormContext);

  const setOptionFromApi = (retrievedOptions, option) => {
    setCurrentOptions(retrievedOptions);
    if (!currentOption) {
      setCurrentOption(option);
      context.updateQueryData(`searchFields[${fieldIndex}].value.text`, option);
    }
  };

  const getOptionsFromApiDefault = url => {
    tenantApi
      .getUniqueFieldValues(url, field)
      .then(({ documents }) => {
        if (documents && documents.length) {
          const fieldApiName = fieldApiNames[field] || field;
          const uniqueOptions = [
            ...new Set(documents.map(document => document[fieldApiName])),
          ];
          const retrievedOptions = uniqueOptions
            .filter(option => option)
            .sort((prv, nxt) => prv.localeCompare(nxt));
          setOptionFromApi(retrievedOptions, retrievedOptions[0]);
        }
      })
      .finally(() => setLoading(false));
  };

  const getOptionsFromApiConfig = url => {
    tenantApi
      .get(url, api.requestUrl)
      .then(({ documents = [] }) => {
        const retrievedOptions = api.responseHandler(documents);
        if (retrievedOptions) {
          setOptionFromApi(retrievedOptions, retrievedOptions[0].id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (options) {
      context.updateQueryData(
        `searchFields[${fieldIndex}].value.text`,
        currentOption
      );
      return;
    }
    const url = context.queryData.tenantUrl;
    if (url) {
      setLoading(true);
      if (!api) {
        getOptionsFromApiDefault(url);
        return;
      }
      getOptionsFromApiConfig(url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setCurrentOption(value.text || ''), [value.text]);

  /**
   * Changes the search field value to the one currently chosen.
   *
   * @param {Event} e
   */
  const handleOptionSelectChange = e => {
    const selectValue = e.target.value;
    setCurrentOption(selectValue);
    context.updateQueryData(
      `searchFields[${fieldIndex}].value.text`,
      selectValue
    );
  };

  /**
   * Excludes the current field from the search.
   *
   */
  const handleDeleteClick = () => {
    context.excludeFieldFromSearch(field);
  };

  return (
    <div className={formStyles.indexedField}>
      <div className={formStyles.formLabel}>&nbsp;</div>
      <SearchFieldLabel value={field} />
      <Select
        id={`${field}-value-select`}
        className={indexedFieldsStyles.indexedFieldControl}
        value={currentOption}
        onChange={handleOptionSelectChange}
        items={currentOptions}
        isCollection={isObject(currentOptions[0])}
      />
      {loading && (
        <div className={indexedFieldsStyles.indexedFieldSpinner}>
          <CircularProgress size={24} />
        </div>
      )}
      {!loading && (
        <div className={indexedFieldsStyles.indexedFieldClearButton}>
          <IconButton onClick={handleDeleteClick} icon="clear" />
        </div>
      )}
    </div>
  );
}
