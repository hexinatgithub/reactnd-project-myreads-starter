import React from "react";
import Book from "./Book";

function BookShelf(props) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{props.title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {props.books.map(book => (
            <li key={book.id}>
              <Book
                book={book}
                onUpdateBook={props.onUpdateBook}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default BookShelf;
