// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import TradeApp from './TradeApp';      // <-- this now points to the file you created

export default function App() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <button onClick={logout}>Logout</button>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TradeApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
