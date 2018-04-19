import React from 'react';
import { Route, Link } from "react-router-dom";
import BookShelf from "./BookShelf";
import SearchPage from "./SearchPage";
import * as BooksAPI from './BooksAPI';
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then(books => this.setState({ books }));
  }

  getShelfBooks = shelf => (
    this.state.books.filter(book => book.shelf === shelf)
  )

  updateBookExist = (book, shelf) => {
    this.setState(prevState => {
      const books = prevState.books
        .map(prevBook => {
          if (prevBook.id === book.id) {
            prevBook.shelf = shelf;
          }
          return prevBook;
        })
        .filter(book => book !== 'none');
      return { books };
    });
  }

  updateBookNotExist = (book, shelf) => {
    book.shelf = shelf;
    this.setState(prevState => (
      { books: prevState.books.concat([book]) }
    ));
  }

  updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
      .then(() => {
        const bookNotExist = this.state.books.findIndex(tempBook => tempBook.id === book.id) === -1;
        if (bookNotExist)
          this.updateBookNotExist(book, shelf);
        else
          this.updateBookExist(book, shelf);
      });
  }

  render() {
    const currentlyReading = this.getShelfBooks('currentlyReading');
    const wantToRead = this.getShelfBooks('wantToRead');
    const read = this.getShelfBooks('read');

    return (
      <div className="app" >
        <Route path="/search" render={() => (
          <SearchPage
            shelfBooks={this.state.books}
            onUpdateBook={this.updateBook}
          />
        )} />
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  books={currentlyReading}
                  title="Currently Reading"
                  onUpdateBook={this.updateBook}
                />
                <BookShelf
                  books={wantToRead}
                  title="Want to Read"
                  onUpdateBook={this.updateBook}
                />
                <BookShelf
                  books={read}
                  title="Read"
                  onUpdateBook={this.updateBook}
                />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div >
        )} />
      </div>
    )
  }
}

export default BooksApp;
