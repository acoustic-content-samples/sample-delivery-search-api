/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
const createAssetLocationExample = text => {
  return {
    classification: 'asset',
    searchFields: [
      {
        field: 'location',
        option: {},
        value: { text },
      },
    ],
    returnFields: [],
  };
};

const createAssetTypeExample = text => {
  return {
    classification: 'asset',
    searchFields: [
      {
        field: 'location',
        option: {},
        value: { text: 'Managed Assets' },
      },
      {
        field: 'assetType',
        option: { condition: '', operator: '' },
        value: { text },
      },
    ],
    returnFields: [],
  };
};

const createContentTypeExample = (condition, text) => {
  return {
    classification: 'content',
    searchFields: [
      {
        field: 'contentType',
        value: { text: 'Product' },
      },
      {
        field: 'string1',
        option: { condition, operator: 'Single value' },
        value: { text },
      },
    ],
    returnFields: [],
  };
};

export const examples = {
  'All content types': {
    classification: 'content-type',
    searchFields: [],
    returnFields: [],
  },
  'All categories': {
    classification: 'category',
    searchFields: [],
    returnFields: [],
  },
  'All "ready" content': {
    classification: 'content',
    searchFields: [
      {
        field: 'status',
        value: { text: 'Ready' },
      },
    ],
    returnFields: [],
  },
  'Content item by ID': {
    classification: 'content',
    searchFields: [
      {
        field: 'id',
        option: { condition: 'Equals', operator: 'Single value' },
        value: { text: 'dummy-content-id' },
      },
    ],
    returnFields: [],
  },
  'All content items (defaults to 10)': {
    classification: 'content',
    searchFields: [],
    returnFields: [],
  },
  'All content items, 5 rows': {
    classification: 'content',
    searchFields: [],
    returnFields: [],
    rowsNumber: '5',
  },
  'All content items, 5 rows starting at row 5': {
    classification: 'content',
    searchFields: [],
    returnFields: [],
    rowsNumber: '5',
    startRow: '5',
  },
  'All content items, sorted by name': {
    classification: 'content',
    searchFields: [],
    returnFields: [],

    sortByField: 'name',
    sortOrder: 'Ascending',
  },
  'All content items, sorted by lastModified': {
    classification: 'content',
    searchFields: [],
    returnFields: [],

    sortByField: 'lastModified',
    sortOrder: 'Ascending',
  },
  'All content items, only name, id, and status fields': {
    classification: 'content',
    searchFields: [],
    returnFields: ['name', 'id', 'status'],
  },
  'All content items, only name and document fields, with document (parsed as JSON)': {
    classification: 'content',
    searchFields: [],
    returnFields: ['name', 'document'],
  },
  'Content items search for "city" in the name field': {
    classification: 'content',
    searchFields: [
      {
        field: 'name',
        option: { condition: 'Contains', operator: 'Single value' },
        value: { text: 'city' },
      },
    ],
    returnFields: [],
  },
  'Content items with "Article" content type': {
    classification: 'content',
    searchFields: [
      {
        field: 'contentType',
        value: { text: 'Article' },
      },
    ],
    returnFields: [],
  },
  'Content items with category leaf value "travel"': {
    classification: 'content',
    searchFields: [
      {
        field: 'categoryLeaves',
        option: { condition: 'Equals', operator: 'Single value' },
        value: { text: 'travel' },
      },
    ],
    returnFields: [],
  },
  'Content items search for "ian" in text': {
    classification: 'content',
    searchFields: [
      {
        field: 'contentText',
        option: { condition: 'Contains', operator: 'Single value' },
        value: { text: 'ian' },
      },
    ],
    returnFields: [],
  },
  'All assets': createAssetLocationExample('All'),
  'All managed assets': createAssetLocationExample('Managed Assets'),
  'All web application assets': createAssetLocationExample('Web Assets'),
  'All managed image assets': createAssetTypeExample('Image'),
  'All managed video assets': createAssetTypeExample('Video'),
  'Assets with tag "beach" or "summer"': {
    classification: 'asset',
    searchFields: [
      {
        field: 'tags',
        option: { condition: 'Equals', operator: 'Multiple value (or)' },
        value: { text: 'beach, summer' },
      },
    ],
    returnFields: [],
  },
  'Content items of type "Product" where the ProductId element (search key \'string1\') has value "1234"': createContentTypeExample('Equals', '1234'),
  'Content items of type "Product" where the ProductId element (search key \'string1\') contains the value "12"': createContentTypeExample('Contains', '12'),
  'Content items of type "Event" where the EventDate element (search key \'sortableDate1\') is in the future, ordered ascending': {
    classification: 'content',
    searchFields: [
      {
        field: 'contentType',
        value: { text: 'Event' },
      },
      {
        field: 'sortableDate1',
        option: { dateRange: 'In the future' },
        value: { startDate: null, endDate: null },
      },
    ],
    sortByField: 'sortableDate1',
    sortOrder: 'Ascending',
    returnFields: [],
  },
};
