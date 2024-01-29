import './styles.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './containers/page.home';
import Login from './containers/page.login';
import { UserProvider } from './services/services.UserContext';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthentication = (value) => {
    setIsAuthenticated(value);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setIsAuthenticated(!!storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login updateAuthentication={updateAuthentication} />} />
        <Route path="/home/*" element={isAuthenticated ? (
          <UserProvider>
            <Home updateAuthentication={updateAuthentication} /> 
          </UserProvider>
          ):( <Navigate to="/"/>)
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

