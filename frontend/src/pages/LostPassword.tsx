import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/botblo-logo.png';
import AnimatedBackground from '../components/AnimatedBackground';

const LostPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Pole e-mail jest wymagane.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/password/request-reset', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch {
      setError('Wystąpił błąd. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="auth-card">
          <img src={logo} alt="BotBlo Logo" className="auth-logo" />
          <h3 className="mb-3">Resetowanie hasła</h3>
          <p className="mb-4 text-white-50">Podaj adres e-mail powiązany z Twoim kontem, a wyślemy Ci link do zresetowania hasła.</p>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <label htmlFor="email">Adres e-mail</label>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-4" disabled={isLoading}>
              {isLoading ? 'Wysyłanie...' : 'Wyślij link do resetu'}
            </button>
          </form>

          <div className="text-center">
            <Link to="/login">Wróć do logowania</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LostPassword;
