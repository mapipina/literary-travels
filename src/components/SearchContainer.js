// @flow
import React from "react";
import BookOptions from "../constants";

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
      const {genre, location, format} = this.state;
      const {fetchBooksData} = this.props;
      const bookSearch = `${genre} ${format} ${location}`;
      fetchBooksData(bookSearch);
  }

  genDropdown(type, options) {
    const optionArray = options.map((typeOption, i) => {
      return <option key={`${typeOption}-${i}`} value={typeOption}>{typeOption}</option>;
    });
    return (
      <select
        name={`${type}-${options}`}
        id={type}
        key={type}
        onChange={e => {
          this.handleDropdownChange(e, type);
        }}
      >
        <option value="">--Please choose an option--</option>
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
      ></input>
    );
  }

  render() {
    return (
      <div>
        I want {this.genDropdown("genre", BookOptions.genres)} books about
        {this.genTopicInput()}
        in this format {this.genDropdown("format", BookOptions.formats)}
        <button onClick={() => this.onSubmit()}>
          Click me to get books
        </button>
      </div>
    );
  }
}

export default SearchContainer;
