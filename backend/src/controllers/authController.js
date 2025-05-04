// backend/src/controllers/authController.js
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory users for demo; replace with DB in prod
let users = [];

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: users.length+1, email, password: hashed };
  users.push(user);
  res.status(201).json({ message: 'Registered' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
