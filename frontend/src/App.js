// frontend/src/App.js

import React, { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [trades, setTrades] = useState([]);
  const [error, setError]   = useState('');
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    action: '',
    price: ''
  });

  // 1. Fetch trades when component mounts
  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const res = await api.get('/api/trades');
      setTrades(res.data);
    } catch (err) {
      setError('Error fetching trades');
    }
  };

  // 2. Handle form input
  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewTrade(prev => ({ ...prev, [name]: value }));
  };

  // 3. Add a new trade (buy/sell)
  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/trades', newTrade);
      setTrades(prev => [...prev, res.data]);
      setNewTrade({ symbol: '', action: '', price: '' });
    } catch (err) {
      setError('Error adding trade');
    }
  };

  // 4. Delete a trade by its MongoDB _id
  const handleDelete = async id => {
    try {
      await api.delete(`/api/trades/${id}`);
      setTrades(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError('Error deleting trade');
    }
  };

  return (
    <div className="App">
      <h1>Copy Trading Frontend</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="symbol"
          placeholder="Symbol"
          value={newTrade.symbol}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="action"
          placeholder="Action (buy/sell)"
          value={newTrade.action}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newTrade.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Trade</button>
      </form>

      <ul>
        {trades.map(trade => (
          // key must be unique: use the MongoDB _id field
          <li key={trade._id}>
            {trade.symbol} - {trade.action} at ${trade.price}{' '}
            <button onClick={() => handleDelete(trade._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
