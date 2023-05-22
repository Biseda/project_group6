import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookDetails = ({ searchTerm }) => {
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        if (!searchTerm) {
          setBookData(null);
          return;
        }

        const apiKey = 'AIzaSyCiacpoq_ch0kRr3MiZGoVifVPrAbQjBCQ'; // Ersätt med din giltiga API-nyckel

        const query = encodeURIComponent(searchTerm);

        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
        const data = response.data;

        if (data.items && data.items.length > 0) {
          const book = data.items[0].volumeInfo;
          const bookTitle = book.title;
          const bookAuthor = book.authors ? book.authors[0] : 'Unknown';
          const bookDescription = book.description || 'No description available';
          const bookImage = book.imageLinks?.thumbnail || '';

          setBookData({ title: bookTitle, author: bookAuthor, description: bookDescription, image: bookImage });
        } else {
          setBookData(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookData();
  }, [searchTerm]);

  return (
    <div>
      {bookData && (
        <div>
          <h2>Book Details</h2>
          <h3>{bookData.title}</h3>
          <p>Author: {bookData.author}</p>
          {bookData.image && <img src={bookData.image} alt={bookData.title} />}
          <p>Description: {bookData.description}</p>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
