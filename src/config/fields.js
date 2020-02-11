/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
/**
 * Contains the options for the text fields.
 *
 * @constant
 * @type {Object}
 */
const textOptions = {
  conditions: ['Contains', 'Equals'],
  operators: ['Multiple value (and)', 'Multiple value (or)', 'Single value'],
};

/**
 * Contains the options for the date fields.
 *
 * @constant
 * @type {Object}
 */
const dateOptions = ['In the future', 'In the past', 'Within the dates'];

/**
 * Contains the available classifications.
 *
 * @constant
 * @type {string[]}
 */
export const classifications = [
  'content',
  'asset',
  'content-type',
  'image-profile',
  'category',
  'taxonomy',
  'layout',
  'layout-mapping',
  'page',
];

/**
 * Contains the fields that should not be used for sorting.
 *
 * @constant
 * @type {string[]}
 */
export const excludedSorters = [
  'string',
  'kind',
  'contentText',
  'categoryLeaves',
  'categories',
  'tags',
];

/**
 * Contains the field configuration objects.
 *
 * @constant
 * @type {Object}
 */
export const fieldsConfig = {
  id: { controlType: 'textInput', ...textOptions },
  name: { controlType: 'textInput', ...textOptions },
  categories: {
    controlType: 'textInput',
    ...textOptions,
    visibleIn: ['content', 'asset', 'content-type'],
  },
  tags: {
    controlType: 'textInput',
    ...textOptions,
    visibleIn: ['content', 'asset', 'content-type', 'image-profile'],
  },
  status: {
    controlType: 'dropdown',
    options: ['Ready', 'Retired'],
    visibleIn: ['content', 'asset'],
  },
  categoryLeaves: {
    controlType: 'textInput',
    ...textOptions,
    visibleIn: ['content', 'asset', 'content-type'],
  },
  libraryId: {
    controlType: 'dropdown',
    visibleIn: ['content', 'asset'],
    api: {
      requestUrl: 'search?q=classification:library&rows=1000&fl=id,name',
      responseHandler: response => [
        { id: 'default', name: 'Default' },
        ...response,
      ],
    },
  },
  lastModified: { controlType: 'datePicker', options: dateOptions },
  lastModifierId: { controlType: 'textInput', ...textOptions },
  contentType: { controlType: 'dropdown', visibleIn: ['content'] },
  contentText: {
    controlType: 'textInput',
    ...textOptions,
    visibleIn: ['content'],
  },
  locale: { controlType: 'textInput', ...textOptions, visibleIn: ['content'] },
  mediaType: { controlType: 'textInput', ...textOptions, visibleIn: ['asset'] },
  kind: { controlType: 'textInput', ...textOptions, visibleIn: ['content'] },
  created: { controlType: 'datePicker', options: dateOptions },
  creatorId: { controlType: 'textInput', ...textOptions },
  path: { controlType: 'textInput', ...textOptions, visibleIn: ['asset'] },
  location: {
    controlType: 'dropdown',
    options: ['All', 'Web Assets', 'Managed Assets'],
    visibleIn: ['asset'],
  },
  assetType: {
    controlType: 'dropdown',
    options: ['File', 'Image', 'Video'],
    visibleIn: ['asset'],
  },
  sortableDate1: { controlType: 'datePicker', options: dateOptions, visibleIn: ['content']  },
  sortableDate2: { controlType: 'datePicker', options: dateOptions, visibleIn: ['content']  },
  sortableDate3: { controlType: 'datePicker', options: dateOptions, visibleIn: ['content']  },
  sortableDate4: { controlType: 'datePicker', options: dateOptions, visibleIn: ['content']  },
};
