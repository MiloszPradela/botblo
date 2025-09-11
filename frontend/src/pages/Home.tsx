import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../api'; 

interface TileProps {
  to: string;
  title: string;
  text: string;
}

const DashboardTile: React.FC<TileProps> = ({ to, title, text }) => (
  <Col md={6} lg={4} xl={3}>
    <Card as={Link} to={to} className="custom-tile text-decoration-none h-100">
      <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
        <Card.Title as="h3" className="tile-title mb-2">{title}</Card.Title>
        <Card.Text className="tile-text mb-0">{text}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/account');
        setUserName(response.data.username);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        setUserName(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tiles: TileProps[] = [
    {
      to: '/account',
      title: 'Moje Konto',
      text: 'Zarządzaj ustawieniami swojego profilu i danymi.',
    },
    {
      to: '/manage-sites',
      title: 'Zarządzaj Stronami',
      text: 'Skonfiguruj swoje witryny WordPress do automatyzacji.',
    },
    {
      to: '/create-post',
      title: 'Nowy Wpis',
      text: 'Utwórz i opublikuj nowy artykuł na wybranej stronie.',
    },
  ];

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="info" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="home-container text-center">
      <header className="home-header">
        <h1 className="display-4 fw-bold mb-2">Witaj, {userName || 'Gościu'}!</h1>
        <p className="mb-4">Zarządzaj swoimi stronami i publikacjami w jednym miejscu.</p>
      </header>

      <Row className="justify-content-center g-4">
        {tiles.map((tile) => (
          <DashboardTile key={tile.to} {...tile} />
        ))}
      </Row>
    </Container>
  );
};

export default Home;