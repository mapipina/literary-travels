import React from "react";
import BookCardsComponent from './BookCardsComponent';

class BookCardsContainer extends React.Component {
    state = {
        bookList: [],
    }

    renderBookCards() {
        const {bookList} = this.state;
        bookList.map(book => {
            // use BookCardsComponent to render title, desc, price links
        })
    }

    render() {
        // return series of book cards based on data array
        return
    }
}

export default BookCardsContainer;