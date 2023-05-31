import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieDetails from './MovieDetails';
import Home from './Home';
import NavbarComponent from './NavbarComponent';

const API_KEY = '0d79d730fff942862b97a7f954332e81';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Funktion som hämtar filmer från API:et när komponenten renderas för första gången
    const fetchMovies = async () => {
      try {
        const randomSearchTerm = generateRandomSearchTerm();
        const timestamp = new Date().getTime(); // Generera en unik tidpunkt för varje anrop
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${randomSearchTerm}&maxResults=24&_=${timestamp}`);
        const movieData = response.data.results;
  
        // Transformera filmdata till lämplig form och uppdatera state med den nya listan av filmer
        const movieList = movieData.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '',
          releaseYear: movie.release_date ? movie.release_date.substring(0, 4) : 'Okänt år',
          voteAverage: movie.vote_average ? movie.vote_average : 'N/A',
        }));
  
        setMovies(movieList);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMovies();
  }, []); // Tomt beroende-array indikerar att effekten bara ska köras vid montering och avmontering av komponenten

  // Funktion som genererar ett slumpmässigt sökord för att hämta filmer
  const generateRandomSearchTerm = () => {
    const searchTerms = ['action', 'comedy', 'drama', 'thriller', 'adventure'];
    const randomIndex = Math.floor(Math.random() * searchTerms.length);
    return searchTerms[randomIndex];
  };

  // Funktion som hanterar sökning efter filmer baserat på ett angivet sökord
  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`);
      const movieData = response.data.results;

      // Transformera filmdata till lämplig form och uppdatera state med den nya listan av filmer
      const movieList = movieData.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
        releaseYear: movie.release_date ? movie.release_date.substring(0, 4) : 'Okänt år',
        voteAverage: movie.vote_average ? movie.vote_average : 'N/A',
      }));

      setMovies(movieList);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Router>
      {/* Rendera navigationskomponenten och skicka med sökfunktionen */}
      <NavbarComponent handleSearch={handleSearch} />
      <Container fluid>
        {/* Definiera routerna för olika sidor */}
        <Routes>
          <Route path="/" element={<Home movies={movies} />} />
          <Route path="/movies/:id" element={<MovieDetails movies={movies} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;