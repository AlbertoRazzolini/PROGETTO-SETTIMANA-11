import { useDispatch, useSelector } from "react-redux";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaHome, FaBook } from "react-icons/fa";
import { setSearchQuery, fetchSearchResults, resetSearch } from "../../redux/musicSlice";
import "./Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.music.searchQuery);

  const handleLogoClick = (e) => {
    e.preventDefault();
    dispatch(resetSearch());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchSearchResults(searchQuery));
    }
  };

  return (
    <aside className="sidebar">
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
        <Button variant="light" type="button" className="w-100 mb-2 rounded-pill">
          Sign Up
        </Button>
        <Button variant="outline-light" type="button" className="w-100 rounded-pill">
          Login
        </Button>
      </div>

      <div className="sidebar-footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
        {" | "}
        <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
      </div>
    </aside>
  );
}
