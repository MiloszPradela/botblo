import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LostPassword from './pages/LostPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AccountManagement from './pages/AccountManagement';
import ManageSites from './pages/ManageSites';
import CreatePost from './pages/CreatePost';
import Error404 from './pages/Error404';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lost-password" element={<LostPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/"  element={<MainLayout><Home /></MainLayout>} />
          <Route path="/account"  element={<MainLayout><AccountManagement /></MainLayout>} />
          <Route path="/manage-sites" element={<MainLayout><ManageSites /></MainLayout>}  />
          <Route path="/create-post" element={<MainLayout><CreatePost /></MainLayout>}  />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
