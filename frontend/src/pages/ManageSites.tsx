import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';

interface Site {
  id: number;
  name: string;
  url: string;
  username?: string;
  password?: string;
}

interface ApiError {
  message: string;
}

const ManageSites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    username: '',
    password: ''
  });
  const [editingSiteId, setEditingSiteId] = useState<number | null>(null);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Site[]>('/sites');
        setSites(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const apiError = err.response.data as ApiError;
            setError(apiError.message || 'Wystąpił błąd podczas dodawania strony.');
        } else {
            setError('Wystąpił nieoczekiwany błąd.');
        }
    } finally {
      setIsLoading(false);
    }
    };
    fetchSites();
  }, []);

  // Obsługa forma
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset formularz/edycji
  const resetForm = () => {
    setFormData({ name: '', url: '', username: '', password: '' });
    setEditingSiteId(null);
  };

  // 
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSiteId) {
      await handleUpdateSite(); // Aktualizacja danych
    } else {
      await handleAddSite(); // Else, nowa strona
    }
  };

  // Nowa strona
  const handleAddSite = async () => {
    if (!formData.name || !formData.url || !formData.username || !formData.password) {
      setError('Wszystkie pola są wymagane.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await api.post<{ id: number; message: string }>('/sites', formData);
      setSites([...sites, { ...formData, id: response.data.id }]);
      resetForm();
      setMessage(response.data.message);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const apiError = err.response.data as ApiError;
            setError(apiError.message || 'Wystąpił błąd podczas dodawania strony.');
        } else {
            setError('Wystąpił nieoczekiwany błąd.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  // Edit storny
  const handleUpdateSite = async () => {
    if (!editingSiteId) return;
    
    setIsLoading(true);
    setMessage('');
    setError('');

    const updateData: Partial<Site> = {
        name: formData.name,
        url: formData.url,
        username: formData.username,
    };
    if (formData.password) {
        updateData.password = formData.password;
    }

    try {
      await api.put(`/sites/${editingSiteId}`, updateData);
      setSites(sites.map(site => site.id === editingSiteId ? { ...site, ...updateData } : site));
      setMessage('Dane strony zostały zaktualizowane.');
      resetForm();
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const apiError = err.response.data as ApiError;
            setError(apiError.message || 'Wystąpił błąd podczas aktualizacji.');
        } else {
            setError('Wystąpił nieoczekiwany błąd.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  //Aktywacja edycji
  const handleEditClick = (site: Site) => {
    setEditingSiteId(site.id);
    setFormData({
      name: site.name,
      url: site.url,
      username: site.username || '',
      password: '' // Puste
    });
    setMessage('');
    setError('');
    window.scrollTo(0, 0);
  };
  
  //Delete strony
  const handleDeleteSite = async (siteId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę stronę?')) {
      setIsLoading(true);
      try {
        await api.delete(`/sites/${siteId}`);
        setSites(sites.filter(site => site.id !== siteId));
        setMessage('Strona została usunięta.');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const apiError = err.response.data as ApiError;
            setError(apiError.message || 'Nie udało się usunąć strony.');
        } else {
            setError('Wystąpił nieoczekiwany błąd.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="manage-sites-container">
      <h1 className="mb-4">Zarządzaj Stronami WordPress</h1>

      <div className="card p-4 mb-5">
        <h3>{editingSiteId ? 'Edytuj stronę' : 'Dodaj nową stronę'}</h3>
        <hr />
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleFormSubmit}>
          <fieldset disabled={isLoading}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa strony" required />
                  <label htmlFor="name">Nazwa strony (np. Mój Blog)</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="url" name="url" value={formData.url} onChange={handleChange} placeholder="URL do xmlrpc.php" required />
                  <label htmlFor="url">URL do xmlrpc.php</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Login WordPress" required />
                  <label htmlFor="username">Login WordPress</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nowe hasło (pozostaw puste, by nie zmieniać)" />
                  <label htmlFor="password">Hasło Aplikacji {editingSiteId && '(pozostaw puste, by nie zmieniać)'}</label>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary me-3">
                {isLoading ? 'Przetwarzanie...' : (editingSiteId ? 'Zapisz zmiany' : 'Dodaj i Zapisz Stronę')}
              </button>
              {editingSiteId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Anuluj edycję
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </div>

      <div className="card p-4 card-saved-sites">
        <h3>Twoje zapisane strony</h3>
        <hr />
        {isLoading && sites.length === 0 && <p>Ładowanie listy stron...</p>}
        <ul className="list-group">
          {!isLoading && sites.length === 0 && <p>Nie dodałeś jeszcze żadnych stron.</p>}
          {sites.map(site => (
            <li key={site.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{site.name}</strong>
                <br />
                <p className="mb-0 ">{site.url}</p>
              </div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(site)} disabled={isLoading}>
                  Edytuj
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSite(site.id)} disabled={isLoading}>
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageSites;
