import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import CreateBoardPage from './pages/CreateBoardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // In a real application, you would check if the user is authenticated
  // For now, we'll just check if a token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/boards/:boardId" element={<BoardPage />} />
              <Route 
                path="/create-board" 
                element={
                  <ProtectedRoute>
                    <CreateBoardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;