import React from "react";
import BookCardsComponent from "./BookCardsComponent";

const _ = require("lodash");

// eslint-disable-next-line no-unused-expressions
("use strict");

class BookCardsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: []
    };
  }

  componentDidMount() {
    const { bookList } = this.props;
    if (bookList && bookList.length > 0) {
      this.setState({ bookList });
    }
  }

  componentDidUpdate(prevProps) {
    const { bookList } = this.props;
    if (!_.isEqual(bookList, prevProps.bookList)) {
      this.setState({ bookList });
    }
  }

  render() {
    const { bookList } = this.state;
    return (
      <div>
        {bookList.map(book => {
          const { title, description } = book.volumeInfo;
          const bookID = book.id;
          return (
            <BookCardsComponent
              key={bookID}
              title={title}
              description={description}
            />
          );
        })}
      </div>
    );
  }
}

export default BookCardsContainer;
