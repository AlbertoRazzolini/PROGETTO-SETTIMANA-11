import { useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import SongCard from "../SongCard/SongCard";
import "./MainContent.css";

export default function MainContent() {
  const { searchQuery, searchResults, isLoading, isError } = useSelector(
    (state) => state.music
  );

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
    return (
      <Container className="main-content-status">
        <p className="main-content-empty">Cerca un artista o un brano per iniziare</p>
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
