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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import { AutocompleteOptions } from './../common/autocompleteOptions';
import { AutocompleteMenu } from './../common/autocompleteMenu';
import { SelectedItems } from './selectedItems';
import { MultipleDownshift } from './multipleDownshift';
import styles from './multipleAutocomplete.scss';

const cx = classNames.bind(styles);

export class MultipleAutocomplete extends Component {
  static propTypes = {
    options: PropTypes.array,
    loading: PropTypes.bool,
    onStateChange: PropTypes.func,
    value: PropTypes.array,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    touched: PropTypes.bool,
    creatable: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    isValidNewOption: PropTypes.func,
    disabled: PropTypes.bool,
    mobileDisabled: PropTypes.bool,
    inputProps: PropTypes.object,
    parseValueToString: PropTypes.func,
    renderOption: PropTypes.func,
    createNewOption: PropTypes.func,
    minLength: PropTypes.number,
    async: PropTypes.bool,
  };

  static defaultProps = {
    options: [],
    loading: false,
    onStateChange: () => {},
    value: [],
    placeholder: '',
    error: '',
    touched: false,
    creatable: false,
    onChange: () => {},
    isValidNewOption: () => true,
    onFocus: () => {},
    onBlur: () => {},
    disabled: false,
    mobileDisabled: false,
    inputProps: {},
    parseValueToString: (value) => value || '',
    renderOption: null,
    createNewOption: (inputValue) => inputValue,
    minLength: 1,
    async: false,
  };

  state = {
    focused: false,
  };

  getOptionProps = (getItemProps, highlightedIndex, selectedItems) => ({ item, index, ...rest }) =>
    getItemProps({
      item,
      index,
      isActive: highlightedIndex === index,
      isSelected: selectedItems.indexOf(item) > -1,
      ...rest,
    });

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
      value = [],
      inputProps,
      onStateChange,
      ...props
    } = this.props;
    const { focused } = this.state;
    const isClearable = !!(value && value.length && !disabled);
    return (
      <MultipleDownshift
        onChange={onChange}
        itemToString={parseValueToString}
        selectedItems={value}
        onStateChange={onStateChange}
      >
        {({
          getInputProps,
          getMenuProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
          removeItem,
          removeAllItems,
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
              <div
                className={cx('autocomplete-input', {
                  clearable: isClearable,
                  'mobile-disabled': mobileDisabled,
                })}
              >
                <SelectedItems
                  items={value}
                  onRemoveItem={removeItem}
                  disabled={disabled}
                  parseValueToString={parseValueToString}
                />
                <input
                  {...getInputProps({
                    placeholder: !disabled ? placeholder : '',
                    onFocus: () => {
                      this.setState({
                        focused: true,
                      });
                      openMenu();
                      onFocus();
                    },
                    onKeyDown: (event) => {
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
              {isClearable && (
                <button
                  className={cx('input-control-btn', { 'mobile-disabled': mobileDisabled })}
                  onClick={removeAllItems}
                >
                  <i className={cx('cross-icon')}>{Parser(CrossIcon)}</i>
                </button>
              )}
            </div>
            <AutocompleteMenu {...getMenuProps({ isOpen })}>
              <AutocompleteOptions
                inputValue={(inputValue || '').trim()}
                getItemProps={this.getOptionProps(getItemProps, highlightedIndex, value)}
                parseValueToString={parseValueToString}
                {...props}
              />
            </AutocompleteMenu>
          </div>
        )}
      </MultipleDownshift>
    );
  }
}
