import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import SongCard from "../SongCard/SongCard";
import { fetchSearchResults } from "../../redux/musicSlice";
import { searchTracks } from "../../api/deezer";
import "./MainContent.css";

const DEFAULT_SECTIONS = [
  { title: "Metal", query: "slipknot" },
  { title: "Pop-Rock", query: "michael jackson" },
  { title: "#HipHop", query: "eminem" },
];

export default function MainContent() {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, isLoading, isError } = useSelector(
    (state) => state.music
  );
  const [defaultSections, setDefaultSections] = useState([]);
  const [isDefaultLoading, setIsDefaultLoading] = useState(true);

  const handleRetry = () => {
    dispatch(fetchSearchResults(searchQuery));
  };

  useEffect(() => {
    async function loadDefaultSections() {
      try {
        const sections = await Promise.all(
          DEFAULT_SECTIONS.map(async ({ title, query }) => {
            const tracks = await searchTracks(query);
            return { title, tracks: tracks.slice(0, 4) };
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
        <Alert variant="danger">Errore durante la ricerca.</Alert>
        <Button variant="outline-light" onClick={handleRetry}>
          Riprova
        </Button>
      </Container>
    );
  }

  if (searchResults.length === 0) {
    if (searchQuery) {
      return (
        <Container className="main-content-status">
          <p className="main-content-no-results">
            Nessun risultato per &quot;{searchQuery}&quot;
          </p>
          <Button variant="outline-light" onClick={handleRetry}>
            Riprova
          </Button>
        </Container>
      );
    }

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
                <Col key={track.id} xs={6} sm={6} md={3} lg={2}>
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
