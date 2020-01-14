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

import { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AutocompletePrompt } from './autocompletePrompt';

export class AutocompleteOptions extends Component {
  static propTypes = {
    children: PropTypes.func,
    options: PropTypes.array,
    loading: PropTypes.bool,
    inputValue: PropTypes.string,
    minLength: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    createNewOption: PropTypes.func,
    creatable: PropTypes.bool,
    parseValueToString: PropTypes.func,
    isValidNewOption: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    options: [],
    loading: false,
    inputValue: '',
    minLength: 1,
    creatable: false,
    createNewOption: (inputValue) => inputValue,
    parseValueToString: (value) => value || '',
    isValidNewOption: () => true,
  };

  getOptions = () => {
    const { options, inputValue } = this.props;
    return options.filter((option) => option.indexOf((inputValue || '').trim()) > -1);
  };

  getPrompt = (options) => {
    const { loading, minLength, inputValue } = this.props;
    if (loading) {
      return (
        <AutocompletePrompt>
          <FormattedMessage id={'AsyncAutocomplete.loading'} defaultMessage={'Loading ...'} />
        </AutocompletePrompt>
      );
    }

    const diff = minLength - inputValue.trim().length;
    if (minLength && diff > 0) {
      return (
        <AutocompletePrompt>
          <FormattedMessage
            id={'AsyncAutocomplete.dynamicSearchPromptText'}
            defaultMessage={'Please enter {length} or more characters'}
            values={{ length: diff }}
          />
        </AutocompletePrompt>
      );
    }

    if (!options.length && !this.canCreateNewItem(options)) {
      return (
        <AutocompletePrompt>
          <FormattedMessage id={'AsyncAutocomplete.notFound'} defaultMessage={'Nothing found'} />
        </AutocompletePrompt>
      );
    }

    return '';
  };

  canCreateNewItem = (options) => {
    const { creatable, inputValue, parseValueToString, isValidNewOption } = this.props;
    return (
      creatable &&
      (!options.length || !options.some((option) => parseValueToString(option) === inputValue)) &&
      isValidNewOption(inputValue)
    );
  };

  renderItems = (options) => {
    const { inputValue, renderItem, createNewOption } = this.props;
    let newItem = null;

    if (this.canCreateNewItem(options)) {
      newItem = createNewOption(inputValue);
      return [newItem, ...options].map((item, index) =>
        renderItem(item, index, newItem && index === 0),
      );
    }

    return options.map((item, index) => renderItem(item, index));
  };

  render() {
    const options = this.getOptions();
    const prompt = this.getPrompt(options);
    if (prompt) return prompt;

    return this.renderItems(options);
  }
}
