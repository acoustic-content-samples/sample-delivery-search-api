/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*//**
 * Holds the accordances between the locally used and API field names.
 *
 * @constant
 * @type {Object}
 */
export const fieldApiNames = {
  contentText: 'text',
  contentType: 'type',
};

/**
 * Checks the status of the returned Promise and re-returns it if the status is
 * ok, otherwise throws an error.
 *
 * @param {Promise} response
 * @returns {Promise}
 * @throws {Error}
 */
const checkStatus = response => {
  if (response.ok) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

/**
 * Parses the response as JSON.
 *
 * @param {Promise} response
 * @returns {Promise}
 */
const parseJSON = response => response.json();

/**
 * Checks if the current tenant's url is valid.
 *
 * @param {string} tenant url
 * @returns {Promise}
 * @memberof tenantAPI
 */

const checkTenantUrl = url =>
  fetch(`${url}/registry/v1/currenttenant`)
    .then(checkStatus)
    .then(parseJSON);

/**
 * Request via tenant delivery url
 */
const get = (tenantUrl, requestUrl) =>
  fetch(`${tenantUrl}/delivery/v1/${requestUrl}`)
    .then(checkStatus)
    .then(parseJSON);

/**
 * Collects all the values the given field may have.
 *
 * @param {string} tenant url
 * @param {string} field name
 * @returns {Promise} Promise holding all possible values for the given field
 * @memberof tenantAPI
 */
const getUniqueFieldValues = (url, field) => {
  const fieldApiName = fieldApiNames[field] || field;
  return get(
    url,
    `search?q=classification:content&rows=1000&fl=${fieldApiName}`
  );
};

/**
 * Tenant API.
 * @namespace tenantAPI
 */
export const tenantApi = {
  checkTenantUrl,
  get,
  getUniqueFieldValues,
};
