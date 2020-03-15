// @flow
import React from "react";
import SearchContainer from './SearchContainer';
import BookCardsContainer from './BookCardsContainer';

const defaultBookSearch = "fiction books ireland";
// eslint-disable-next-line no-unused-expressions
'use strict';

class AppContainer extends React.Component {
  state = {
    data: []
  };

  fetchBooksData() {
    fetch(
      `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_BOOKS_API_KEY}&q=${defaultBookSearch}`
    )
      .then(res => {
        return res.json();
      })
      .then(rawData => {
        const data = rawData.items;
        this.setState({ data }, () => {
          console.log(data);
        });
      })
      .catch(err => console.log(`An error occurred: ${err}`));
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <button onClick={() => this.fetchBooksData()}>
          Click me to get books
        </button>
        <SearchContainer/>
        <BookCardsContainer bookList={data} />
      </div>
    );
  }
}

export default AppContainer;
