import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import MainContent from "./components/MainContent/MainContent";
import Player from "./components/Player/Player";
import "./App.css";

function App() {
  return (
    <Container fluid className="app-container p-0">
      <Row className="g-0 app-body">
        <Col xs={12} md={3} lg={2} className="sidebar-col">
          <Sidebar />
        </Col>
        <Col xs={12} md={9} lg={10} className="main-col">
          <TopBar />
          <MainContent />
        </Col>
      </Row>
      <Row className="g-0">
        <Col xs={12}>
          <Player />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
