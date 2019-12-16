// This is a more complete example of an autocomplete component
// with custom styling, filtering of objects, and more.
// Much of the irrelevant bits are in the ../shared file.
// which you may also want to become familiar with as many
// examples will use those as well.
import React, { Component } from 'react';
import Downshift from 'downshift';
import Parser from 'html-react-parser';
import { ScrollWrapper } from 'components/main/scrollWrapper';
import ArrowIcon from 'common/img/arrow-down-inline.svg';
import CrossIcon from 'common/img/cross-icon-inline.svg';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './inputSingleAutocomplete.scss';

const cx = classNames.bind(styles);

const defaultParseValueToString = (value) => (value ? value.label : '');

const escapeRegexCharacters = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Item = ({ isActive, isSelected, children, ...props }) => (
  <li className={cx('item', { active: isActive, selected: isSelected })} {...props}>
    {children}
  </li>
);

Item.propTypes = {
  isActive: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
};

Item.defaultProps = {
  isActive: false,
  isSelected: false,
  children: null,
};

const Menu = React.forwardRef(({ isOpen, children }, ref) => (
  <ul ref={ref} className={cx('menu', { opened: isOpen })}>
    <ScrollWrapper autoHeight autoHeightMax={300}>
      {children}
    </ScrollWrapper>
  </ul>
));

Menu.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
};

Menu.defaultProps = {
  isOpen: false,
  children: null,
};

export class InputSingleAutocomplete extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    focusPlaceholder: PropTypes.string,
    nothingFound: PropTypes.string,
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
    filterOption: PropTypes.func,
    parseValueToString: PropTypes.func,
  };
  static defaultProps = {
    options: [],
    value: null,
    placeholder: '',
    focusPlaceholder: 'Type...',
    nothingFound: 'Nothing found',
    error: '',
    touched: false,
    creatable: false,
    onChange: () => {},
    isValidNewOption: ({ label }) => label,
    onFocus: () => {},
    onBlur: () => {},
    dynamicSearchPromptText: false,
    disabled: false,
    mobileDisabled: false,
    inputProps: {},
    filterOption: () => true,
    parseValueToString: defaultParseValueToString,
  };

  getItems = (inputValue) => {
    const { options, parseValueToString, creatable } = this.props;

    const regex = new RegExp(`^${inputValue}`, 'i');
    const suggestions = options.filter((option) => regex.test(parseValueToString(option)));

    if (suggestions.length === 0 && creatable) {
      return [{ isNew: true, value: inputValue, label: inputValue }];
    }

    return suggestions;
  };

  renderItems = (inputValue, getItemProps, highlightedIndex, selectedItem) => {
    const escapedValue = escapeRegexCharacters(inputValue.trim());

    if (escapedValue === '') {
      return this.renderPlaceholder(this.props.focusPlaceholder);
    }

    const items = this.getItems(escapedValue);

    if (!items.length) {
      return this.renderPlaceholder(this.props.nothingFound);
    }

    return items.map((item, index) => (
      <Item
        key={item.value || index}
        {...getItemProps({
          item,
          index,
          isActive: highlightedIndex === index,
          isSelected: selectedItem === item,
        })}
      >
        {this.props.parseValueToString(item)}
      </Item>
    ));
  };

  renderPlaceholder = (placeholder) => <div className={cx('placeholder')}>{placeholder}</div>;

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
    } = this.props;
    return (
      <Downshift onChange={onChange} itemToString={parseValueToString} selectedItem={value}>
        {({
          getInputProps,
          getToggleButtonProps,
          getMenuProps,
          getItemProps,
          isOpen,
          clearSelection,
          selectedItem,
          inputValue,
          highlightedIndex,
          openMenu,
        }) => (
          <div className={cx('autocomplete-container')}>
            <div className={cx('autocomplete')}>
              <input
                {...getInputProps({
                  placeholder,
                  onFocus: () => {
                    openMenu();
                    onFocus();
                  },
                  onBlur,
                  disabled,
                })}
                className={cx('input', { 'mobile-disabled': mobileDisabled, error, touched })}
              />
              {selectedItem ? (
                !(disabled || mobileDisabled) && (
                  <button className={cx('input-control-btn')} onClick={clearSelection}>
                    <i className={cx('icon', 'cross-icon')}>{Parser(CrossIcon)}</i>
                  </button>
                )
              ) : (
                <button {...getToggleButtonProps()} className={cx('input-control-btn')}>
                  <i className={cx('icon', 'arrow-icon', { opened: isOpen })}>
                    {Parser(ArrowIcon)}
                  </i>
                </button>
              )}
            </div>
            <div>
              <Menu {...getMenuProps({ isOpen })}>
                {isOpen
                  ? this.renderItems(inputValue, getItemProps, highlightedIndex, selectedItem)
                  : null}
              </Menu>
            </div>
          </div>
        )}
      </Downshift>
    );
  }
}
