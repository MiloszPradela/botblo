import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Site {
  id: number;
  name: string;
  url: string;
}

interface ApiError {
  message: string;
}
// dodac obsluge kategori - bot bedzie musial najpierw sprawdzic czy wpisana kategorie istnieje, jesli tak, wybrac, jesli nie, utworzyc, zaznaczyc, i zapisac
// do sprawdzenia w pozniejszym etapie wraz dla bota z selenium
const CreatePost: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<number[]>([]);
  const [tags, setTags] = useState('');

  // Stany dla komunikatów i ładowania
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pobieranie listy zapisanych stron
  useEffect(() => {
    const fetchSites = async () => {
      
      try {
        const response = await api.get<Site[]>('/sites');
        setSites(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setSites(err.response?.data?.message || 'Wystąpił błąd podczas zmiany hasła.');
        } else {
          setError('Wystąpił nieznany błąd.');
        }
        
      }
    };
    fetchSites();
  }, []);

  // Obsługa zmiany kategorii
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setCategories(selectedOptions);
  };
  
  // Funkcja wysyłająca wpis
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
      categories,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      await api.post('/wordpress/posts', {
        site_id: selectedSiteId,
        post: postData
      });
      setMessage('Wpis został pomyślnie opublikowany!');
      // Resetowanie formularza
      setTitle('');
      setContent('');
      setCategories([]);
      setTags('');
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
          <div className="card p-4 mb-4">
            <div className="mb-3">
              <label htmlFor="siteSelect" className="form-label">1. Wybierz stronę docelową</label>
              <select 
                id="siteSelect" 
                className="form-select" 
                value={selectedSiteId} 
                onChange={(e) => setSelectedSiteId(e.target.value)}
                required
              >
                <option value="" disabled>-- Wybierz z listy --</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
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
              <ReactQuill theme="snow" value={content} onChange={setContent} style={{ backgroundColor: 'var(--third-color)', color: 'white' }} />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <label htmlFor="postCategories" className="form-label">Kategorie</label>
                <select 
                  multiple 
                  className="form-select" 
                  id="postCategories" 
                  size={5}
                  value={categories.map(String)}
                  onChange={handleCategoryChange}
                >
                 
                </select>
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="postTags" className="form-label">Tagi (oddzielone przecinkami)</label>
                <input
                  type="text"
                  className="form-control"
                  id="postTags"
                  placeholder="np. react, wordpress, programowanie"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" className=" btn-primary ">
              {isLoading ? 'Publikowanie...' : 'Opublikuj Wpis'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreatePost;
