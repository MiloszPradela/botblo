import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import logo from '../assets/botblo-logo.png';
import AnimatedBackground from '../components/AnimatedBackground';

const showAlert = (message: string, type: 'success' | 'danger') => {
    alert(`[${type.toUpperCase()}] ${message}`);
};

interface ApiError {
    message: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.username.trim()) newErrors.username = "Nazwa użytkownika jest wymagana.";
        if (!formData.email.trim()) newErrors.email = "Adres e-mail jest wymagany.";
        
        if (formData.password.length < 8) newErrors.password = "Hasło musi mieć co najmniej 8 znaków.";
        else if (!/[A-Z]/.test(formData.password)) newErrors.password = "Hasło musi zawierać co najmniej jedną wielką literę.";
        else if (!/[a-z]/.test(formData.password)) newErrors.password = "Hasło musi zawierać co najmniej jedną małą literę.";
        else if (!/\d/.test(formData.password)) newErrors.password = "Hasło musi zawierać co najmniej jedną cyfrę.";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = "Hasło musi zawierać co najmniej jeden znak specjalny.";

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Hasła nie są identyczne.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        try {
            await axios.post('/api/register/request', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            showAlert('Prośba o rejestrację została wysłana! Sprawdź e-mail od administratora.', 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiError>;
                const errorMessage = axiosError.response?.data?.message || 'Wystąpił błąd podczas rejestracji.';
                showAlert(errorMessage, 'danger');
            } else {
                console.error("An unexpected error occurred:", err);
                showAlert('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.', 'danger');
            }
        }
    };

    return (
        <>
            <AnimatedBackground />
            <div className="container d-flex align-items-center justify-content-center" style={{minHeight: '100vh', position: 'relative', zIndex: 1}}>
                <div className="auth-card">
                    <img src={logo} alt="BotBlo Logo" className="auth-logo" />
                    <h3 className="mb-4">Zarejestruj się</h3>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-floating mb-3">
                            <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} id="username" name="username" placeholder="Nazwa użytkownika" value={formData.username} onChange={handleChange} required />
                            <label htmlFor="username">Nazwa użytkownika</label>
                            {errors.username && <div className="text-danger mt-1 small text-start ps-1">{errors.username}</div>}
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                            <label htmlFor="email">Adres e-mail</label>
                            {errors.email && <div className="text-danger mt-1 small text-start ps-1">{errors.email}</div>}
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" placeholder="Hasło" value={formData.password} onChange={handleChange} required />
                            <label htmlFor="password">Hasło</label>
                            {errors.password && <div className="text-danger mt-1 small text-start ps-1">{errors.password}</div>}
                        </div>
                        <div className="form-floating mb-4">
                            <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPassword" name="confirmPassword" placeholder="Potwierdź hasło" value={formData.confirmPassword} onChange={handleChange} required />
                            <label htmlFor="confirmPassword">Potwierdź hasło</label>
                            {errors.confirmPassword && <div className="text-danger mt-1 small text-start ps-1">{errors.confirmPassword}</div>}
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100 mb-3">Zarejestruj</button>
                    </form>
                    <div className="text-center">
                        <Link to="/login">Masz już konto? Zaloguj się</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
