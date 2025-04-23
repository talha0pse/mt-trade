// src/pages/Register.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const nav = useNavigate();

  const handleChange = e => setCreds({ ...creds, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', creds);
      setMessage('Registered! Redirecting to login...');
      setTimeout(() => nav('/login'), 1500);
    } catch {
      setMessage('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}
