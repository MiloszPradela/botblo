import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

const Error404 = () => {
  return (
    <>
      <AnimatedBackground />
      <div className="error404-container container position-absolute z-1 d-flex flex-column align-items-center text-center">
        <h1 className="fw-bold mb-3">404</h1>
        <h2 className="mb-0">Strona nie została znaleziona</h2>
        <p className="mb-5">
          Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link to="/" className="btn-primary">
          Strona główna
        </Link>
      </div>
    </>
  );
};

export default Error404;
