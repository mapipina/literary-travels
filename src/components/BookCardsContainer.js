import React from "react";
import BookCardsComponent from "./BookCardsComponent";

const _ = require("lodash");

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
  // Updating bookList in state when props changes
  componentDidUpdate(prevProps) {
    const { bookList } = this.props;
    if (!_.isEqual(bookList, prevProps.bookList)) {
      this.setState({ bookList });
    }
    console.log(this.props.bookReviews);
  }

  render() {
    const { bookList } = this.state;
    return (
      <div className="cardContainer">
        <div className="cardContainer__wrapper">
          {bookList.map(book => {
            const {
              title,
              description,
              canonicalVolumeLink,
              imageLinks
            } = book.volumeInfo;
            const bookID = book.id;
            return (
              <BookCardsComponent
                key={bookID}
                title={title}
                description={description}
                link={canonicalVolumeLink}
                image={imageLinks}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default BookCardsContainer;
