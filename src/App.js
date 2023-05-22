import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BookList from './BookList';

const App = () => {
  return (
    <Router>
      <Container>
        <Navbar bg="light" expand="lg" className="mb-4">
          <Navbar.Brand as={Link} to="/"> Home </Navbar.Brand>
          <Navbar.Brand as={Link} to="/books"> Books</Navbar.Brand>
        </Navbar>

        <Routes>
          <Route path="/books" element={<BookList />} />
          <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
