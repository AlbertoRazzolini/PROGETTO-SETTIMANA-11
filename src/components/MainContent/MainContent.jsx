import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import SongCard from "../SongCard/SongCard";
import "./MainContent.css";

const DEFAULT_SECTIONS = [
  { title: "Metal", query: "slipknot" },
  { title: "Pop-Rock", query: "michael jackson" },
  { title: "#HipHop", query: "eminem" },
];

export default function MainContent() {
  const { searchQuery, searchResults, isLoading, isError } = useSelector(
    (state) => state.music
  );
  const [defaultSections, setDefaultSections] = useState([]);
  const [isDefaultLoading, setIsDefaultLoading] = useState(true);

  useEffect(() => {
    async function loadDefaultSections() {
      try {
        const sections = await Promise.all(
          DEFAULT_SECTIONS.map(async ({ title, query }) => {
            const response = await fetch(
              `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(query)}`
            );
            const { data } = await response.json();
            return { title, tracks: data.slice(0, 4) };
          })
        );
        setDefaultSections(sections);
      } catch {
        setDefaultSections([]);
      } finally {
        setIsDefaultLoading(false);
      }
    }

    loadDefaultSections();
  }, []);

  if (isLoading) {
    return (
      <Container className="main-content-status">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="main-content-status">
        <Alert variant="danger">Errore durante la ricerca. Riprova.</Alert>
      </Container>
    );
  }

  if (searchResults.length === 0) {
    if (isDefaultLoading) {
      return (
        <Container className="main-content-status">
          <Spinner animation="border" variant="light" />
        </Container>
      );
    }

    return (
      <Container fluid className="main-content main-content-home">
        {defaultSections.map((section) => (
          <section key={section.title} className="main-content-section">
            <h2 className="main-content-title">{section.title}</h2>
            <Row className="g-4 justify-content-around">
              {section.tracks.map((track) => (
                <Col key={track.id} xs={6} sm={4} md={3} lg={2}>
                  <SongCard track={track} />
                </Col>
              ))}
            </Row>
          </section>
        ))}
      </Container>
    );
  }

  return (
    <Container fluid className="main-content">
      <h2 className="main-content-title">Risultati per &quot;{searchQuery}&quot;</h2>
      <Row className="g-4">
        {searchResults.map((track) => (
          <Col key={track.id} xs={6} sm={4} md={3} lg={2}>
            <SongCard track={track} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
