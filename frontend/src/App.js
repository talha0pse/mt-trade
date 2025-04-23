import React, { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');
  const [newTrade, setNewTrade] = useState({ symbol: '', action: '', price: '' });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = () => {
    api.get('/api/trades')
      .then((res) => setTrades(res.data))
      .catch((err) => setError('Failed to load trades'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTrade(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/trades', newTrade, {
      headers: {
        // Authorization: `Bearer <token>` if needed
      }
    }).then((res) => {
      setTrades(prev => [...prev, res.data]);
      setNewTrade({ symbol: '', action: '', price: '' });
    }).catch(() => {
      setError('Error adding trade');
    });
  };

  const handleDelete = (id) => {
    api.delete(`/api/trades/${id}`, {
      headers: {
        // Authorization: `Bearer <token>` if needed
      }
    }).then(() => fetchTrades())
      .catch(() => setError('Error deleting trade'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Copy Trading App</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" name="symbol" placeholder="Symbol" value={newTrade.symbol} onChange={handleChange} required />
        <input type="text" name="action" placeholder="Action (buy/sell)" value={newTrade.action} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={newTrade.price} onChange={handleChange} required />
        <button type="submit">Add Trade</button>
      </form>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id}>
            {trade.symbol} - {trade.action} at ${trade.price} {' '}
            <button onClick={() => handleDelete(trade.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
