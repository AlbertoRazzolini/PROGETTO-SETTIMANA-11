import { Nav } from "react-bootstrap";
import "./TopBar.css";

const NAV_LINKS = ["Trending", "Podcast", "Moods and Genres", "New Releases", "Discover"];

export default function TopBar() {
  return (
    <Nav className="topbar">
      {NAV_LINKS.map((label) => (
        <Nav.Link
          key={label}
          href="#"
          className="topbar-link"
          onClick={(e) => e.preventDefault()}
        >
          {label}
        </Nav.Link>
      ))}
    </Nav>
  );
}
