import React from "react";
import "../styles/Books.css";
// eslint-disable-next-line no-unused-expressions
("use strict");

class BookCardsComponent extends React.Component {

  truncateText(text) {
    const newText = text.length > 250 ? `${text.substring(0, 250)}...` : text;
    return newText;
  }

  renderCardContent(title, description) {
    const shortDesc = description ? this.truncateText(description) : ''
    return (
      <>
      <div className='card__title'>{title}</div>
      <p className='card__desc'>{shortDesc}</p>
      </>
    )
  }

  render() {
    const { title, description } = this.props;
    return (
      <div className="card">
        {this.renderCardContent(title, description)}
      </div>
    );
  }
}

export default BookCardsComponent;
