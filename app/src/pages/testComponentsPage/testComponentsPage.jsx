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

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { reduxForm } from 'redux-form';
import { FieldProvider } from 'components/fields/fieldProvider';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { URLS } from 'common/urls';
import { AsyncAutocomplete } from 'components/inputs/autocompletes/asyncAutocomplete';
import { AsyncMultipleAutocomplete } from 'components/inputs/autocompletes/asyncMultipleAutocomplete';
import styles from './testComponentsPage.scss';

const cx = classNames.bind(styles);

@reduxForm({
  form: 'testComponentForm',
  initialValues: {
    project: 'default_personal',
    projectDisabled: 'default_personal',
    projects: ['default_personal', 'superadmin_personal'],
    projectsDisabled: ['default_personal', 'superadmin_personal'],
  },
  // validate: ({ planet }) => ({
  //   project: commonValidators.requiredField(planet),
  // }),
  enableReinitialize: true,
})
export class TestComponentsPage extends Component {
  state = {
    creatablePlanet: null,
  };

  projectSearchUrl = URLS.projectNameSearch();

  onChange = (value) => this.setState({ creatablePlanet: value });

  formatValue = (value) => (value ? { value, label: value } : null);

  makeOptions = (values) => values.map((value) => ({ value, label: value }));

  parseValue = (value) => {
    if (value === null) return null;
    if (value && value.value) return value.value;
    return undefined;
  };

  formatMultiOptions = (options) =>
    options && options.map((option) => ({ value: option, label: option }));
  parseMultiOptions = (options) =>
    (Array.isArray(options) && options.map((option) => option.value)) || undefined;

  render() {
    return (
      <PageLayout>
        <PageHeader />
        <PageSection>
          <div className={cx('content-page')}>
            <div className={cx('autocomplete')}>
              <p>Simple:</p>
              <FieldProvider name="project" format={this.formatValue} parse={this.parseValue}>
                <FieldErrorHint hintType="top">
                  <AsyncAutocomplete
                    minLength={1}
                    uri={this.projectSearchUrl}
                    makeOptions={this.makeOptions}
                  />
                </FieldErrorHint>
              </FieldProvider>
            </div>
            <div className={cx('autocomplete')}>
              <p>Simple disabled:</p>
              <FieldProvider
                name="projectDisabled"
                format={this.formatValue}
                parse={this.parseValue}
              >
                <FieldErrorHint hintType="top">
                  <AsyncAutocomplete
                    minLength={1}
                    uri={this.projectSearchUrl}
                    makeOptions={this.makeOptions}
                    disabled
                  />
                </FieldErrorHint>
              </FieldProvider>
            </div>
            <div className={cx('autocomplete')}>
              <p>Creatable:</p>
              <FieldProvider
                name="projectCreatable"
                format={this.formatValue}
                parse={this.parseValue}
              >
                <FieldErrorHint hintType="top">
                  <AsyncAutocomplete
                    minLength={1}
                    uri={this.projectSearchUrl}
                    makeOptions={this.makeOptions}
                    creatable
                  />
                </FieldErrorHint>
              </FieldProvider>
            </div>
            <div className={cx('autocomplete')}>
              <p>Multi:</p>
              <FieldProvider
                name="projects"
                format={this.formatMultiOptions}
                parse={this.parseMultiOptions}
              >
                <AsyncMultipleAutocomplete
                  minLength={1}
                  uri={this.projectSearchUrl}
                  makeOptions={this.makeOptions}
                />
              </FieldProvider>
            </div>
            <div className={cx('autocomplete')}>
              <p>Multi creatable:</p>
              <FieldProvider
                name="projectsCreatable"
                format={this.formatMultiOptions}
                parse={this.parseMultiOptions}
              >
                <AsyncMultipleAutocomplete
                  minLength={1}
                  uri={this.projectSearchUrl}
                  makeOptions={this.makeOptions}
                  creatable
                />
              </FieldProvider>
            </div>
            <div className={cx('autocomplete')}>
              <p>Multi disabled:</p>
              <FieldProvider
                name="projectsDisabled"
                format={this.formatMultiOptions}
                parse={this.parseMultiOptions}
              >
                <AsyncMultipleAutocomplete
                  minLength={1}
                  uri={this.projectSearchUrl}
                  makeOptions={this.makeOptions}
                  disabled
                />
              </FieldProvider>
            </div>
          </div>
        </PageSection>
      </PageLayout>
    );
  }
}
