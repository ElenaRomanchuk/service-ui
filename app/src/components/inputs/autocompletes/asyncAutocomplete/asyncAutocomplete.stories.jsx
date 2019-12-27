/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { host } from 'storybook-host';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AsyncAutocomplete } from './asyncAutocomplete';
import README from './README.md';

const mockData = [
  'best_of_the_best_test_project',
  'best_test_project',
  'super_tester_project',
  'test',
  'test_project',
  'test_project_1',
  'test_project_2',
  'test_project_3',
  'test_project_4',
];

const projectSearchUrl = '/api/v1/project/names/search?term=';

const mock = new MockAdapter(axios);
const API_REQUEST = `${projectSearchUrl}test`;
mock.onGet(API_REQUEST).reply(200, mockData);

storiesOf('Components/Inputs/AsyncAutocomplete', module)
  .addDecorator(
    host({
      title: 'Async Autocomplete',
      align: 'center middle',
      background: 'white',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      height: 400,
      width: 400,
    }),
  )
  .addParameters({
    readme: {
      sidebar: README,
    },
  })
  .add('default state', () => <AsyncAutocomplete />)
  .add('with mocked options', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
    />
  ))
  .add('creatable', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
      creatable
    />
  ))
  .add('with value', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
      value="super_tester_project"
    />
  ))
  .add('With min length (3)', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
      minLength={3}
    />
  ))
  .add('disabled', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
      minLength={3}
      disabled
    />
  ))
  .add('disabled with value', () => (
    <AsyncAutocomplete
      uri={projectSearchUrl}
      placeholder="Type 'test'"
      onChange={action('Select project')}
      minLength={3}
      disabled
      value="super_tester_project"
    />
  ));
