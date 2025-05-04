import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'trades'
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [tradeForm, setTradeForm] = useState({ symbol: '', action: '', price: '' });
  const [error, setError] = useState('');
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (view === 'trades') {
      fetchTrades();
    }
  }, [view]);

  // Shared change handler
  const handleAuthChange = e => {
    const { name, value } = e.target;
    setAuthForm(f => ({ ...f, [name]: value }));
  };

  const handleTradeChange = e => {
    const { name, value } = e.target;
    setTradeForm(f => ({ ...f, [name]: value }));
  };

  // REGISTER
  const handleRegister = async e => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', authForm);
      setError('');
      setAuthForm({ email: '', password: '' });
      setView('login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  // LOGIN
  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', authForm);
      localStorage.setItem('token', res.data.token);
      setError('');
      setAuthForm({ email: '', password: '' });
      setView('trades');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  // FETCH TRADES
  const fetchTrades = async () => {
    try {
      const res = await api.get('/api/trades');
      setTrades(res.data);
      setError('');
    } catch {
      setError('Error fetching trades');
    }
  };

  // ADD TRADE
  const handleAddTrade = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/trades', tradeForm);
      setTrades(t => [...t, res.data]);
      setTradeForm({ symbol: '', action: '', price: '' });
      setError('');
    } catch {
      setError('Error adding trade');
    }
  };

  // DELETE TRADE
  const handleDeleteTrade = async id => {
    try {
      await api.delete(`/api/trades/${id}`);
      setTrades(t => t.filter(x => x._id !== id));
      setError('');
    } catch {
      setError('Error deleting trade');
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    setTrades([]);
    setView('login');
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      {/* Toggle Login/Register */}
      {view !== 'trades' && (
        <button onClick={() => setView(v => v === 'login' ? 'register' : 'login')}>
          {view === 'login' ? 'Go to Register' : 'Go to Login'}
        </button>
      )}

      {/* REGISTER FORM */}
      {view === 'register' && (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            name="email" type="email" placeholder="Email"
            value={authForm.email} onChange={handleAuthChange} required
          /><br/>
          <input
            name="password" type="password" placeholder="Password"
            value={authForm.password} onChange={handleAuthChange} required
          /><br/>
          <button type="submit">Register</button>
        </form>
      )}

      {/* LOGIN FORM */}
      {view === 'login' && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            name="email" type="email" placeholder="Email"
            value={authForm.email} onChange={handleAuthChange} required
          /><br/>
          <input
            name="password" type="password" placeholder="Password"
            value={authForm.password} onChange={handleAuthChange} required
          /><br/>
          <button type="submit">Login</button>
        </form>
      )}

      {/* TRADES VIEW */}
      {view === 'trades' && (
        <>
          <h2>Trades</h2>
          <button onClick={handleLogout}>Logout</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleAddTrade}>
            <input
              name="symbol" placeholder="Symbol"
              value={tradeForm.symbol} onChange={handleTradeChange} required
            />
            <input
              name="action" placeholder="Action (buy/sell)"
              value={tradeForm.action} onChange={handleTradeChange} required
            />
            <input
              name="price" type="number" placeholder="Price"
              value={tradeForm.price} onChange={handleTradeChange} required
            />
            <button type="submit">Add Trade</button>
          </form>
          <ul>
            {trades.map(trade => (
              <li key={trade._id}>
                {trade.symbol} - {trade.action} at ${trade.price}{' '}
                <button onClick={() => handleDeleteTrade(trade._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
