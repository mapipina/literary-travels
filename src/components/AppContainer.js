import React from "react";
import SearchContainer from "./SearchContainer";
import BookCardsContainer from "./BookCardsContainer";

class AppContainer extends React.Component {
  state = {
    data: [],
    bookReviews: {},
    errorMsg: ""
  };

  // Will generalize API calls as utils fn
  fetchBooksData(bookSearch) {
    fetch(
      `https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_BOOKS_API_KEY}&q=${bookSearch}`
    )
      .then(res => {
        return res.json();
      })
      .then(rawData => {
        const data = rawData.items;
        this.setState({ data }, () => this.genISBNArray());
      })
      .catch(err => console.log(`An error occurred: ${err}`));
  }

  genISBNArray() {
    const { data } = this.state;
    const isbnArray = [];
    data.map(book => {
      const isbn = book.volumeInfo.industryIdentifiers[0].identifier;
      return isbnArray.push(isbn);
    });
    this.fetchBookReviews(isbnArray);
  }

  fetchBookReviews(isbnArray) {
    const isbnStr = isbnArray.join();
    fetch(
      `https://www.goodreads.com/book/review_counts.json?key=${process.env.REACT_APP_GOODREADS_API_KEY}&isbns=${isbnStr}`,
      { mode: "no-cors" }
    )
      .then(res => {
        return res.json();
      })
      .then(bookReviews => {
        console.log(bookReviews);
        this.setState({ bookReviews });
      })
      .catch(err => this.setState({ errorMsg: err }));
  }

  render() {
    const { data, bookReviews } = this.state;
    return (
      <div>
        <SearchContainer fetchBooksData={this.fetchBooksData.bind(this)} />
        <BookCardsContainer bookList={data} bookReviews={bookReviews} />
      </div>
    );
  }
}

export default AppContainer;
