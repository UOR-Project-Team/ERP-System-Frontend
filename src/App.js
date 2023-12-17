import './styles.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './containers/page.home';
import Login from './containers/page.login';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthentication = (value) => {
    setIsAuthenticated(value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login updateAuthentication={updateAuthentication} />} />
        <Route path="/home/*" element={isAuthenticated ? <Home updateAuthentication={updateAuthentication} /> : <Navigate to="/"/>} />
      </Routes>
    </Router>
  );
}

export default App;

