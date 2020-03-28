// @flow
import React from "react";
import SearchComponent from "./SearchComponent";
import "../styles/Search.css";

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  state = {
    genre: "",
    location: "",
    format: ""
  };

  handleDropdownChange(event, type) {
    const selection = event.target.value;
    this.setState({ [`${type}`]: selection });
  }

  handleInputChange(event) {
    const { value } = event.target;
    this.setState({ location: value });
  }

  onSubmit() {
    const { genre, location, format } = this.state;
    const { fetchBooksData } = this.props;
    const bookSearch = `${genre} ${format} ${location}`;
    fetchBooksData(bookSearch);
  }

  // Generalizing the dropdown since there are a couple in the app
  genDropdown(type, options) {
    const optionArray = options.map((typeOption, i) => {
      return (
        <option key={`${typeOption}-${i}`} value={typeOption}>
          {typeOption}
        </option>
      );
    });
    return (
      <select
        name={`${type}-${options}`}
        id={type}
        key={type}
        onChange={e => {
          this.handleDropdownChange(e, type);
        }}
        className="search__dropdown"
      >
        <option value="" style={{ textAlign: "center" }}>
          Select Option
        </option>
        {optionArray}
      </select>
    );
  }

  genTopicInput() {
    return (
      <input
        type="text"
        id="book-topic"
        name="Book Topic"
        required
        size="15"
        onChange={this.handleInputChange}
        className="input__text"
      />
    );
  }

  render() {
    const bookQuery = this.state;
    return (
      <div className="search">
        <SearchComponent
          genDropdown={this.genDropdown.bind(this)}
          genTopicInput={this.genTopicInput.bind(this)}
          onSubmit={this.onSubmit.bind(this)}
          bookQuery={bookQuery}
        />
      </div>
    );
  }
}

export default SearchContainer;
