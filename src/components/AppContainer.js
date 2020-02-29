// @flow
import React from "react";

const defaultBookSearch = "fiction books ireland";

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
        <div>
          {data.map(bookItem => {
            return (
              <div key={bookItem.id}>
                <h2>{bookItem.volumeInfo.title}</h2>
                <p>{bookItem.volumeInfo.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default AppContainer;
