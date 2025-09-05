import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import CustomSelect from '../components/CustomSelect'; 

interface Site {
  id: number;
  name: string;
  url: string;
}

interface ApiError {
  message: string;
}

const CreatePost: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await api.get<Site[]>('/sites');
        setSites(response.data);
        setError('');
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Nie udało się pobrać listy stron.');
        } else {
          setError('Wystąpił nieznany, nieoczekiwany błąd.');
        }
        setSites([]);
      }
    };
    fetchSites();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedSiteId) {
      setError('Musisz wybrać stronę, na której chcesz opublikować wpis.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError('Tytuł i treść są wymagane.');
      return;
    }

    setIsLoading(true);

    const postData = {
      title,
      content,
    };

    try {
      await api.post('/wordpress/posts', {
        site_id: selectedSiteId,
        post: postData
      });
      setMessage('Wpis został pomyślnie opublikowany!');
      setTitle('');
      setContent('');
      setSelectedSiteId('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiError;
        setError(apiError.message || 'Wystąpił błąd podczas publikacji.');
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="mb-4">Utwórz Nowy Wpis</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handlePublish}>
        <fieldset disabled={isLoading}>
          <div className="card p-4 mb-4 z-3">
            <div className="mb-3">
              <label htmlFor="siteSelect" className="form-label">1. Wybierz stronę docelową</label>
              
              <CustomSelect 
                sites={sites}
                selectedSiteId={selectedSiteId}
                setSelectedSiteId={setSelectedSiteId}
              />
              
            </div>
          </div>

          <div className="card p-4">
            <h3 className="mb-3">2. Treść wpisu</h3>
            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="postTitle"
                placeholder="Wpisz tytuł..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label htmlFor="postTitle">Tytuł Wpisu</label>
            </div>

            <div className="mb-4">
              <label className="form-label d-block mb-2">Treść</label>
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                style={{ backgroundColor: 'var(--third-color)', color: 'white' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isLoading ? 'Publikowanie...' : 'Opublikuj Wpis'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreatePost;
