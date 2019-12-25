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
import Downshift from 'downshift';

export class MultipleDownshift extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    children: PropTypes.func.isRequired,
    selectedItems: PropTypes.array,
  };

  static defaultProps = {
    onChange: () => {},
    selectedItems: [],
  };

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: '',
        };
      default:
        return changes;
    }
  };

  handleChange = (selectedItems, downshift) =>
    this.props.onChange(selectedItems, this.getStateAndHelpers(downshift));

  addSelectedItem = (newItem, downshift) =>
    this.handleChange([...this.props.selectedItems, newItem], downshift);

  removeItem = (removedItem, downshift) => {
    this.handleChange(
      this.props.selectedItems.filter((item) => item.value !== removedItem.value),
      downshift,
    );
  };

  handleSelection = (selectedItem, downshift) => {
    if (this.props.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, downshift);
    } else {
      this.addSelectedItem(selectedItem, downshift);
    }
  };

  getStateAndHelpers(downshift) {
    const { getRemoveButtonProps, removeItem } = this;
    return {
      getRemoveButtonProps,
      removeItem,
      ...downshift,
    };
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {(downshift) => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}
