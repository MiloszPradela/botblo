import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import axios from 'axios';
import logo from '../assets/botblo-logo.png';
import AnimatedBackground from '../components/AnimatedBackground';

interface ApiError {
    message: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post<{ token: string }>('/login', { email, password });
            
            localStorage.setItem('token', response.data.token);

            navigate('/'); 

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as ApiError;
                setError(apiError.message || 'Wystąpił błąd logowania.');
            } else {
                setError('Wystąpił nieoczekiwany błąd.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatedBackground />
            <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <div className="auth-card">
                    <img src={logo} alt="BotBlo Logo" className="auth-logo" />
                    <h3 className="mb-4">Zaloguj się</h3>
                    
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <fieldset disabled={isLoading}>
                            <div className="form-floating mb-3">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="login" 
                                    placeholder="name@example.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                                <label htmlFor="login">Login (e-mail)</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <label htmlFor="password">Hasło</label>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">
                                {isLoading ? 'Logowanie...' : 'Zaloguj'}
                            </button>
                        </fieldset>
                    </form>
                    <div className="text-center">
                        <p><Link to="/register">Nie masz konta? Zarejestruj się</Link></p>
                        <p><Link to="/request-password-reset">Zapomniałeś hasła?</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
