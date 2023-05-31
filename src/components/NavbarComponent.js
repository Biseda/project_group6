import React, { useState } from 'react';
import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavbarComponent = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Tillstånd för söktermen

  const navigate = useNavigate(); // Hook för att hantera navigation
  const location = useLocation(); // Hook för att få nuvarande plats

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Uppdatera söktermen när användaren skriver
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindra att formuläret skickas vid inlämning
    handleSearch(searchTerm); // Anropa förälderkomponentens funktion för att utföra sökning med söktermen
    if (location.pathname !== '/') {
      navigate('/'); // Om användaren befinner sig på en annan plats än startsidan, navigera till startsidan
    }
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          MovieApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex ms-auto" onSubmit={handleSubmit} autoComplete="off">
            <FormControl
              type="search"
              placeholder="Sök film"
              className="me-2"
              aria-label="search"
              name="searchTerm"
              value={searchTerm}
              onChange={handleChange}
            />
            <Button variant="secondary" type="submit">
              Sök
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
