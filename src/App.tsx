import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { IntelligenceFeed } from './pages/IntelligenceFeed';
import { VideoHub } from './pages/VideoHub';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { Architecture } from './pages/Architecture';
import { Layout } from './components/Layout';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string; org: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; org: string } | null>(null);

  const login = (email: string, _password: string) => {
    // Demo authentication - in production, this calls FastAPI /api/v1/auth/login
    if (email) {
      setIsAuthenticated(true);
      setUser({
        name: 'Rajesh Kumar',
        role: 'EnterpriseCIO',
        org: 'Varna Finance Ltd (Upper Layer NBFC)'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/intelligence" element={
            isAuthenticated ? <Layout><IntelligenceFeed /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/videos" element={
            isAuthenticated ? <Layout><VideoHub /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/architecture" element={
            isAuthenticated ? <Layout><Architecture /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/subscription" element={
            isAuthenticated ? <Layout><Subscription /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/settings" element={
            isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" />
          } />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
