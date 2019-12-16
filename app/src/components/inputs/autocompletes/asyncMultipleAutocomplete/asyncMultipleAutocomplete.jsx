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
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { AutocompleteOption } from './../common/autocompleteOption';
import { AsyncAutocompleteOptions } from './../common/asyncAutocompleteOptions';
import { AutocompleteMenu } from './../common/autocompleteMenu';
import { AutocompletePrompt } from './../common/autocompletePrompt';
import { SelectedItems } from './selectedItems';
import { MultipleDownshift } from './multipleDownshift';
import styles from './asyncMultipleAutocomplete.scss';

const cx = classNames.bind(styles);

const escapeRegexCharacters = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class AsyncMultipleAutocomplete extends Component {
  static propTypes = {
    uri: PropTypes.string,
    value: PropTypes.PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    placeholder: PropTypes.string,
    error: PropTypes.string,
    touched: PropTypes.bool,
    creatable: PropTypes.bool,
    makeOptions: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    isValidNewOption: PropTypes.func,
    disabled: PropTypes.bool,
    mobileDisabled: PropTypes.bool,
    inputProps: PropTypes.object,
    filterOption: PropTypes.func,
    parseValueToString: PropTypes.func,
    minLength: PropTypes.number,
  };

  static defaultProps = {
    uri: '',
    value: [],
    placeholder: '',
    focusPlaceholder: 'Type...',
    nothingFound: 'Nothing found',
    error: '',
    touched: false,
    creatable: false,
    makeOptions: (values) => values,
    onChange: () => {},
    isValidNewOption: ({ label }) => label,
    onFocus: () => {},
    onBlur: () => {},
    disabled: false,
    mobileDisabled: false,
    inputProps: {},
    filterOption: () => true,
    parseValueToString: (value) => (value ? value.label : ''),
    minLength: 1,
  };

  state = {
    focused: false,
  };

  renderItem = (getItemProps, highlightedIndex, selectedItems) => (item, index) => (
    <AutocompleteOption
      key={item.value}
      {...getItemProps({
        item,
        index,
        isActive: item.isNew || highlightedIndex === index,
        isSelected: selectedItems.some((selectedItem) => selectedItem.value === item.value),
      })}
      isNew={item.isNew}
    >
      {this.props.parseValueToString(item)}
    </AutocompleteOption>
  );

  getMinLenghtPropmt = (inputValue) => {
    const escapedValue = escapeRegexCharacters(inputValue.trim());
    const diff = this.props.minLength - escapedValue.length;
    if (this.props.minLength && diff > 0) {
      return (
        <AutocompletePrompt>
          <FormattedMessage
            id={'InputTagsSearch.dynamicSearchPromptText'}
            defaultMessage={'Please enter {length} or more characters'}
            values={{ length: diff }}
          />
        </AutocompletePrompt>
      );
    }
    return '';
  };

  render() {
    const {
      onChange,
      onBlur,
      onFocus,
      parseValueToString,
      placeholder,
      disabled,
      error,
      touched,
      mobileDisabled,
      value,
      uri,
      makeOptions,
      inputProps,
      filterOption,
      creatable,
    } = this.props;
    const { focused } = this.state;
    return (
      <MultipleDownshift
        onChange={onChange}
        itemToString={parseValueToString}
        selectedItems={value}
      >
        {({
          getInputProps,
          getMenuProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
          removeItem,
          openMenu,
        }) => (
          <div className={cx('autocomplete-container')}>
            <div
              className={cx('autocomplete', {
                'mobile-disabled': mobileDisabled,
                error,
                touched,
                focused,
                disabled,
              })}
            >
              <SelectedItems items={value} onRemoveItem={removeItem} disabled={disabled} />
              <input
                {...getInputProps({
                  placeholder,
                  onFocus: () => {
                    this.setState({
                      focused: true,
                    });
                    openMenu();
                    onFocus();
                  },
                  onKeyDown(event) {
                    if (event.key === 'Backspace' && !inputValue && value.length) {
                      removeItem(value[value.length - 1]);
                    }
                  },
                  onBlur: () => {
                    this.setState({
                      focused: false,
                    });
                    onBlur();
                  },
                  disabled,
                  ...inputProps,
                })}
                className={cx('input', { disabled })}
              />
            </div>
            <div>
              <AutocompleteMenu
                promptMessage={this.getMinLenghtPropmt(inputValue)}
                {...getMenuProps({ isOpen })}
              >
                <AsyncAutocompleteOptions
                  uri={uri}
                  makeOptions={makeOptions}
                  inputValue={escapeRegexCharacters(inputValue.trim())}
                  filterOption={filterOption}
                  creatable={creatable}
                  renderItem={this.renderItem(getItemProps, highlightedIndex, value)}
                />
              </AutocompleteMenu>
            </div>
          </div>
        )}
      </MultipleDownshift>
    );
  }
}
