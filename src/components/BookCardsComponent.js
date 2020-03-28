import React from "react";
import "../styles/Books.css";

class BookCardsComponent extends React.Component {
  truncateText(text) {
    const newText = text.length > 150 ? `${text.substring(0, 149)}...` : text;
    return newText;
  }

  renderCardContent(title, description, image) {
    const shortDesc = description ? this.truncateText(description) : "";
    const imageSrc = image.thumbnail;
    return (
      <>
        <div className="card__title">{title}</div>
        <div className="card__img">
          <img src={imageSrc} alt={`Bookcover of ${title}`} />
        </div>
        <p className="card__desc">{shortDesc}</p>
      </>
    );
  }

  render() {
    const { title, description, link, image } = this.props;
    return (
      <div className="card">
        {this.renderCardContent(title, description, image)}
        <div className="card__footer">
          <div className="card__link">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default BookCardsComponent;
