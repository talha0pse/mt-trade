let trades = [
    { id: 1, symbol: 'AAPL', action: 'buy', price: 150 },
    { id: 2, symbol: 'GOOGL', action: 'sell', price: 2800 },
    { id: 3, symbol: 'TSLA', action: 'buy', price: 700 },
  ];
  
  exports.createTrade = async (req, res) => {
    const { symbol, action, price } = req.body;
    if (!symbol || !action || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newTrade = { id: trades.length + 1, symbol, action, price };
    trades.push(newTrade);
    res.status(201).json(newTrade);
  };
  
  exports.getTrades = async (req, res) => {
    res.json(trades);
  };
  
  exports.deleteTrade = async (req, res) => {
    const { id } = req.params;
    const tradeId = parseInt(id);
    const initialLength = trades.length;
    trades = trades.filter(trade => trade.id !== tradeId);
    if (trades.length === initialLength) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json({ message: 'Trade deleted successfully' });
  };
  
  exports.updateTrade = async (req, res) => {
    const { id } = req.params;
    const tradeId = parseInt(id);
    const { symbol, action, price } = req.body;
    const trade = trades.find(trade => trade.id === tradeId);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
  
    trade.symbol = symbol || trade.symbol;
    trade.action = action || trade.action;
    trade.price = price || trade.price;
    res.json({ message: 'Trade updated successfully', trade });
  };
  