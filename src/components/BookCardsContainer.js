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
  // full look book.volumeInfo.canonicalVolumeLink
  // image preview: volumeInfo.imageLinks.thumbnail

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
      <div className="cardContainer">
        <div className="cardContainer__wrapper">
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
      </div>
    );
  }
}

export default BookCardsContainer;
