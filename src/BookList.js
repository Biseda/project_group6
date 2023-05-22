import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Navbar } from 'react-bootstrap';
import './App.css';

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = async () => {
    try {
      // API-nycklar
      const bookApiKey = 'AIzaSyCiacpoq_ch0kRr3MiZGoVifVPrAbQjBCQ';
      const movieApiKey = '0d79d730fff942862b97a7f954332e81';
      const query = searchTerm;

      // Sök efter böcker
      const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${bookApiKey}`);
      const bookData = bookResponse.data;

      // Skapa en lista med böcker
      const bookList = bookData.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
        description: item.volumeInfo.description,
        image: item.volumeInfo.imageLinks?.thumbnail || '',
        year: item.volumeInfo.publishedDate || 'Unknown Year',
        type: 'Book',
        movie: null,
      }));

      // Sök efter filmer
      const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${query}`);
      const movieData = movieResponse.data;

      // Skapa en lista med filmer
      const movieList = movieData.results.map((item) => ({
        id: item.id,
        title: item.title,
        director: item.director,
        description: item.overview,
        image: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '',
        year: item.release_date ? item.release_date.slice(0, 4) : 'Unknown Year',
        type: 'Movie',
      }));

      // Matcha böcker och filmer baserat på titel
      bookList.forEach((book) => {
        const matchingMovie = movieList.find((movie) => movie.title === book.title);
        if (matchingMovie) {
          book.movie = matchingMovie;
        }
      });

      setSearchResults(bookList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedBook(null);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageClick = (book) => {
    if (selectedBook && selectedBook.id === book.id) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book);
    }
  };

  const handleTitleClick = () => {
    setSelectedBook(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Hämta slumpmässiga böcker vid komponentens montering
    const fetchRandomBooks = async () => {
      try {
        const bookResponse = await axios.get('https://www.googleapis.com/books/v1/volumes?q=random');
        const bookData = bookResponse.data;

        const bookList = bookData.items.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
          description: item.volumeInfo.description,
          image: item.volumeInfo.imageLinks?.thumbnail || '',
          year: item.volumeInfo.publishedDate || 'Unknown Year',
          type: 'Book',
          movie: null,
        }));

        setSearchResults(bookList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomBooks();
  }, []);

  return (
    <Container>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand>Books</Navbar.Brand>
      </Navbar>
  
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Search books and movies"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Button className="mr-2" variant="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h3 className="mt-4">Movies</h3>
          <ul>
            {searchResults.map((item) => (
              <li key={item.id}>
                {item.movie && (
                  <Card className="mb-3">
                    <Card.Img variant="top" src={item.movie.image} alt={item.movie.title} />
                    <Card.Body>
                      <Card.Title>{item.movie.title}</Card.Title>
                      <Card.Text>Director: {item.movie.director}</Card.Text>
                      <Card.Text>Year: {item.movie.year}</Card.Text>
                      <Card.Text>Description: {item.movie.description}</Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </li>
            ))}
          </ul>
        </Col>
        <Col md={6}>
          <h3 className="mt-4">Books</h3>
          <ul>
            {searchResults.map((item) => (
              <li key={item.id}>
                <div>
                  <img src={item.image} alt={item.title} onClick={() => handleImageClick(item)} className="book-image" />
                  <h4>{item.title}</h4>
                </div>
                {selectedBook && selectedBook.id === item.id && (
                  <div>
                    <h4 onClick={handleTitleClick}>{item.title}</h4>
                    {item.type === 'Book' ? (
                      <div>
                        <p>Author: {item.author}</p>
                        <p>Year: {item.year}</p>
                        <p>Description: {item.description}</p>
                      </div>
                    ) : (
                      <div>
                        <p>Director: {item.director}</p>
                        <p>Year: {item.year}</p>
                        <p>Description: {item.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );  
};

export default BookList;