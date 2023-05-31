import React, { useEffect, useState } from 'react';

const BOOK_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const BOOK_API_KEY = 'AIzaSyCiacpoq_ch0kRr3MiZGoVifVPrAbQjBCQ';

const RelatedBook = ({ movie }) => {
  const [relatedBook, setRelatedBook] = useState(null);

  useEffect(() => {
    // Funktionen för att hämta den relaterade boken från Google Books API
    const fetchRelatedBook = async () => {
      try {
        const response = await fetch(
          `${BOOK_API_URL}?key=${BOOK_API_KEY}&q=${encodeURIComponent(movie.title)}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          // Hitta boken med samma titel som filmen
          const book = data.items.find(
            (item) => item.volumeInfo.title.toLowerCase() === movie.title.toLowerCase()
          );
          if (book) {
            setRelatedBook(book); // Sätt den relaterade boken
          } else {
            setRelatedBook(null); // Om ingen matchande bok hittades, sätt till null
          }
        } else {
          setRelatedBook(null); // Om ingen bok hittades alls, sätt till null
        }
      } catch (error) {
        console.error('Fel vid hämtning av relaterad bok:', error);
        setRelatedBook(null); // Hantera eventuella fel och sätt till null
      }
    };

    fetchRelatedBook(); // Anropa funktionen för att hämta den relaterade boken
  }, [movie]);

  if (!relatedBook) {
    return <p>Ingen relaterad bok hittades.</p>; // Om ingen relaterad bok finns, visa meddelande
  }

  return (
    <div className="related-books-container">
      <h3>Relaterad bok:</h3>
      <div className="row">
        <div className="col-xs-12 col-md-4">
          {relatedBook.volumeInfo.imageLinks && (
            <img
              className="related-book-image"
              style={{ width: '15rem' }}
              src={relatedBook.volumeInfo.imageLinks.thumbnail}
              alt={relatedBook.volumeInfo.title}
            />
          )}
        </div>
        <div className="col-xs-12 col-md-8">
          <div>
            <p>Titel: {relatedBook.volumeInfo.title}</p>
            <p>Författare: {relatedBook.volumeInfo.authors?.join(', ')}</p>
            <p>Förlag: {relatedBook.volumeInfo.publisher}</p>
            <p>Publiceringsdatum: {relatedBook.volumeInfo.publishedDate}</p>
            <p>Beskrivning: {relatedBook.volumeInfo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedBook;
