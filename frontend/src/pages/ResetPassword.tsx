import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; 
import logo from '../assets/botblo-logo.png';
import AnimatedBackground from '../components/AnimatedBackground';

interface ApiErrorResponse {
  message: string;
}

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Oba pola hasła są wymagane.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/password/reset', { token, password });
      setMessage(response.data.message + ' Zostaniesz przekierowany na stronę logowania za 3 sekundy...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        const errorMessage = axiosError.response?.data?.message || 'Wystąpił nieoczekiwany błąd serwera.';
        setError(errorMessage);
      } else {
        setError('Wystąpił nieznany błąd.');
      }
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
          <h3 className="mb-3">Ustaw nowe hasło</h3>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!message && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Nowe hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <label htmlFor="password">Nowe hasło</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Potwierdź nowe hasło"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-4" disabled={isLoading}>
                {isLoading ? 'Zapisywanie...' : 'Zresetuj hasło'}
              </button>
            </form>
          )}

          {message && (
             <Link to="/login" className="btn btn-secondary w-100">Przejdź do logowania</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;