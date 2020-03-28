// @flow
import React from "react";
import BookOptions from "../constants";

const _ = require("lodash");

class SearchComponent extends React.Component {
  state = {
    isDisabled: true
  };
  // Ensuring that all values are set. If not, button is disabled
  componentDidUpdate(prevProps) {
    const { bookQuery } = this.props;
    let isBtnDisabled = true;
    if (!_.isEqual(prevProps.bookQuery, bookQuery)) {
      const bookQueryValues = Object.values(bookQuery).filter(
        bookQueryVal => bookQueryVal.length > 0
      );
      isBtnDisabled = bookQueryValues.length < 3 ? true : false;
      this.setState({ isDisabled: isBtnDisabled });
    }
  }

  render() {
    const { genDropdown, genTopicInput, onSubmit } = this.props;
    const { isDisabled } = this.state;
    return (
      <div className="search__component">
        I want {genDropdown("genre", BookOptions.genres)} books about
        {genTopicInput()}
        in this format {genDropdown("format", BookOptions.formats)}
        <div className="search__submit">
          <button disabled={isDisabled} onClick={onSubmit}>
            Books, yay!
          </button>
        </div>
      </div>
    );
  }
}

export default SearchComponent;
