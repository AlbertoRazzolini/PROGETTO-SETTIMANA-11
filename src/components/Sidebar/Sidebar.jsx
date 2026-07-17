import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, InputGroup, Offcanvas } from "react-bootstrap";
import { FaHome, FaBook, FaBars } from "react-icons/fa";
import { setSearchQuery, fetchSearchResults, resetSearch } from "../../redux/musicSlice";
import "./Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.music.searchQuery);
  const [show, setShow] = useState(false);

  const handleLogoClick = (e) => {
    e.preventDefault();
    dispatch(resetSearch());
    setShow(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchSearchResults(searchQuery));
      setShow(false);
    }
  };

  return (
    <>
      <div className="sidebar-mobile-bar d-flex d-md-none align-items-center justify-content-between">
        <a href="#" className="sidebar-logo-mobile" onClick={handleLogoClick}>
          Spotify
        </a>
        <Button
          type="button"
          className="sidebar-burger"
          onClick={() => setShow(true)}
          aria-label="Apri menu"
        >
          <FaBars />
        </Button>
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        responsive="md"
        placement="start"
        className="sidebar-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="d-md-none" />
        <Offcanvas.Body className="sidebar">
          <a href="#" className="sidebar-logo" onClick={handleLogoClick}>
            Spotify
          </a>

          <nav className="sidebar-nav">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaHome className="me-2" />
              Home
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaBook className="me-2" />
              Your Library
            </a>
          </nav>

          <Form className="sidebar-search" onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
              <Button type="submit" variant="light">
                GO
              </Button>
            </InputGroup>
          </Form>

          <div className="sidebar-auth">
            <Button variant="light" type="button" className="sidebar-auth-btn mb-2 rounded-pill">
              Sign Up
            </Button>
            <Button variant="outline-light" type="button" className="sidebar-auth-btn rounded-pill">
              Login
            </Button>
          </div>

          <div className="sidebar-footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
            {" | "}
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
