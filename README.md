
# BotBlo - User Authentication System

## Overview

This project is a full-stack user authentication system, built with a Flask backend and React frontend. It supports secure user registration, login with JWT tokens, password reset via email, and administrator approval of new accounts.

## Technologies
- Backend: Python, Flask, SQLAlchemy, PostgreSQL, Flask-Mail, Flask-Bcrypt, JWT
- Frontend: React, TypeScript, React Router

## Features
- User registration with email verification and admin approval
- Secure password storage with bcrypt
- JWT-based login sessions
- Password reset with time-limited token sent by email
- Modular backend architecture with Blueprints
- Responsive frontend with reusable components and layout

## Project Structure
```
/
├── backend/                 # Flask backend
│   ├── config/             # Blueprints, models, extensions
│   ├── venv/               # Python virtual environment
│   ├── .env                # Environment variables
│   └── app.py              # Flask app entry point
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # React pages
│   │   └── App.tsx          # React router
│   └── package.json         # Frontend dependencies
└── README.md               # Project documentation
```

## Setup Instructions

### Backend

1. Clone the repository and navigate to backend:
```bash
git clone <repo_url>
cd botblo/backend
```

2. Set up Python virtual environment and install dependencies:
```bash
python -m venv venv
venv\Scriptsctivate   # Windows
source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

3. Create and edit `.env` file with database credentials, JWT secret, and mail server settings.

4. Run the backend server:
```bash
python app.py
```

### Frontend

1. Navigate to frontend and install dependencies:
```bash
cd ../frontend
npm install
npm install bootstrap react-bootstrap
npm install axios react-router-dom
npm install -D cypress
npm install react-quill-new
```

2. Start development server:
```bash
***** feature/frontend
cd ../backedn
=======
cd ../backend
***** main

pip install Flask 
pip install Flask-SQLAlchemy 
pip install psycopg2-binary 
pip install Flask-Migrate 
pip install python-dotenv
pip install selenium 
pip install Flask-JWT-Extended 
pip install pytest
pip install flask-cors
pip install Flask-Mail
pip install Flask-Bcrypt
pip install python-wordpress-xmlrpc
pip install cryptography
pip install selenium webdriver-manager
pip install webdriver-manager

***** feature/frontend
npm run dev
=======
python app.py
***** main
```

3. Access the app at `http://localhost:5173`

## Contact

Maintainer: Miłosz Pradela
