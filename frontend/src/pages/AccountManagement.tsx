// Plik: src/components/AccountManagement.tsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Tab = 'account' | 'posts' | 'logout';

interface Post {
  id: number;
  title: string;
  published_at: string;
  domain: string;
  url: string;
}

const AccountManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('account');

  // State dla formularzy
  const [profileData, setProfileData] = useState({ email: '', username: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State dla wpisów
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState('');

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await api.get('/account/profile');
      setProfileData(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setProfileError(error.response?.data?.message || 'Nie udało się pobrać danych użytkownika.');
      } else {
        setProfileError('Wystąpił nieznany błąd podczas pobierania danych.');
      }
    }
  };
  fetchUserData();
}, []); 

  // Pobieranie wpisów, gdy zakładka jest aktywna
  useEffect(() => {
  const fetchUserPosts = async () => {
    if (activeTab === 'posts') {
      setPostsLoading(true);
      setPostsError('');
      try {
        const response = await api.get('/account/posts');
        setPosts(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setPostsError(error.response?.data?.message || 'Nie udało się pobrać listy wpisów.');
        } else {
          setPostsError('Wystąpił nieznany błąd podczas pobierania wpisów.');
        }
      } finally {
        setPostsLoading(false);
      }
    }
  };
  fetchUserPosts();
}, [activeTab]);

  // Handlery formularzy
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(''); setProfileError('');
    try {
      const response = await api.put('/account/profile', { username: profileData.username });
      setProfileMessage(response.data.message);
    } catch (err: unknown) {
       if (axios.isAxiosError(err)) {
        setProfileError(err.response?.data?.message || 'Wystąpił błąd podczas aktualizacji profilu.');
        }  else {
        setProfileError('Wystąpił nieznany błąd.');
      }
    }
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(''); setPasswordError('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Nowe hasła nie są identyczne.');
      return;
    }
    try {
      const response = await api.put('/account/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage(response.data.message);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
          setPasswordError(err.response?.data?.message || 'Wystąpił błąd podczas zmiany hasła.');
      } else {
          setPasswordError('Wystąpił nieznany błąd.');
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="card p-4 h-100 card-inner">
                <h3>Dane Profilu</h3>
                <hr />
                {profileMessage && <div className="alert alert-success">{profileMessage}</div>}
                {profileError && <div className="alert alert-danger">{profileError}</div>}
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="username" name="username" value={profileData.username || ''} onChange={handleProfileChange} placeholder="Nazwa użytkownika" />
                    <label htmlFor="username">Nazwa użytkownika</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" name="email" value={profileData.email} placeholder="Adres e-mail" disabled readOnly/>
                    <label htmlFor="email">Adres e-mail</label>
                    <div className="form-text mt-2">Zmiana adresu e-mail wymaga kontaktu z administratorem.</div>
                  </div>
                  <button type="submit" className="btn-primary">Zapisz zmiany</button>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card p-4 h-100 card-inner">
                <h3>Zmiana hasła</h3>
                <hr />
                {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
                {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Aktualne hasło" required />
                    <label htmlFor="currentPassword">Aktualne hasło</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Nowe hasło" required />
                    <label htmlFor="newPassword">Nowe hasło</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Potwierdź nowe hasło" required />
                    <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
                  </div>
                  <button type="submit" className=" btn-primary">Zmień hasło</button>
                </form>
              </div>
            </div>
          </div>
        );
      
      case 'posts':
        return (
          <div className="card p-4 card-inner">
            <h3>Twoje dodane wpisy</h3>
            <hr />
            {postsLoading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Ładowanie...</span></div></div>}
            {postsError && <div className="alert alert-danger">{postsError}</div>}
            
            {!postsLoading && !postsError && (
              posts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {posts.map((post) => (
                    <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <div className="me-3 mb-2 mb-md-0">
                        <strong className="d-block">{post.title}</strong>
                        <small className="text-muted">
                          Opublikowano: {new Date(post.published_at).toLocaleString('pl-PL')} na {post.domain}
                        </small>
                      </div>
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        Zobacz wpis
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Nie opublikowałeś jeszcze żadnych wpisów.</p>
              )
            )}
          </div>
        );
        
      case 'logout':
        return (
          <div className="card p-4 text-center">
            <h3>Wylogowanie</h3> <hr />
            <p>Czy na pewno chcesz się wylogować z aplikacji?</p>
            <button className="btn btn-danger btn-lg" onClick={handleLogout}>Tak, wyloguj mnie</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="account-management-container">
      <h1 className="mb-4">Zarządzanie kontem</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Konto</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Dodane wpisy</button>
        </li>
        <li className="nav-item ms-auto">
          <button className={`nav-link text-danger ${activeTab === 'logout' ? 'active' : ''}`} onClick={() => setActiveTab('logout')}>Wyloguj</button>
        </li>
      </ul>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AccountManagement;
