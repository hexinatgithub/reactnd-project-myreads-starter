import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Book from "./Book";
import * as BooksAPI from './BooksAPI';

class SearchPage extends Component {

  static propTypes = {
    shelfBooks: PropTypes.array,
    onUpdateBook: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
  }

  queryBooks = query => {
    if (query) {
      BooksAPI.search(query)
        .then(data => {
          if (data.error) {
            throw data;
          }

          // if book exist in the shelf, get shelf property
          // book state should syn between app and search page
          return data.map(book => {
            const i = this.props.shelfBooks.findIndex(shelfBook => shelfBook.id === book.id);
            book.shelf = i !== -1 ? this.props.shelfBooks[i].shelf : "none";
            return book;
          });
        })
        // update the searchResults
        .then(books => this.setState({ searchResults: books }))
        // reset searchResults to empty array if error throw
        .catch(() => this.setState({ searchResults: [] }));
    } else {
      this.setState({ searchResults: [] })
    }
  }

  render() {
    return (
      <div className="search-books" >
        <div className="search-books-bar">
          <Link className="close-search" to="/" />
          <div className="search-books-input-wrapper">
            {/*
                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                You can find these search terms here:
                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
  
                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                you don't find a specific author or title. Every search is limited by search terms.
              */}
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={e => this.queryBooks(e.target.value)}
            />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.searchResults.map(book => (
              <li key={book.id}>
                <Book
                  book={book}
                  onUpdateBook={this.props.onUpdateBook}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

}

export default SearchPage;