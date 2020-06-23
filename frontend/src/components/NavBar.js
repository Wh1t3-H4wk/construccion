import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" id="mainNav" sticky="top">
      <Navbar.Brand
        className="text-uppercase d-lg-none text-expanded"
        as={Link}
        to="/"
      >
        Donde José Villar
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse>
        <Nav.Link className="text-white text-uppercase" as={Link} to="/">
          Inicio
        </Nav.Link>
        <Nav.Link className="text-white text-uppercase" as={Link} to="/">
          Productos
        </Nav.Link>
        <Nav.Link className="text-white text-uppercase">Conócenos</Nav.Link>
        <Nav.Link
          className="text-white text-uppercase"
          as={Link}
          to="/registrarse"
        >
          Registrarse
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
