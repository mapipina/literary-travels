// @flow
import React from "react";
import SearchContainer from "./SearchContainer";
import BookCardsContainer from "./BookCardsContainer";

// eslint-disable-next-line no-unused-expressions
("use strict");

class AppContainer extends React.Component {
  state = {
    data: [],
  };

  fetchBooksData(bookSearch) {
    fetch(
      `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_BOOKS_API_KEY}&q=${bookSearch}`
    )
      .then(res => {
        return res.json();
      })
      .then(rawData => {
        const data = rawData.items;
        this.setState({ data });
      })
      .catch(err => console.log(`An error occurred: ${err}`));
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <SearchContainer fetchBooksData={this.fetchBooksData.bind(this)}/>
        <BookCardsContainer bookList={data} />
      </div>
    );
  }
}

export default AppContainer;
