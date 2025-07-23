const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const User = require('./models/User');
const Ad = require('./models/Ad');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

// Serve static files (UI)
app.use(express.static(path.join(__dirname, 'public')));

// Register
app.post('/api/users/register', async (req, res) => {
  try {
    const { mobile, password, role } = req.body;
    if (!['superuser', 'admin', 'system_user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.create({ mobile, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findByMobile(mobile);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/users/me', auth(), async (req, res) => {
  res.json(req.user);
});

// Create ad (system_user only)
app.post('/api/ads', auth(['system_user']), async (req, res) => {
  try {
    const { car_id, user_id, price } = req.body;
    if (req.user.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const ad = await Ad.create({ car_id, user_id, price });
    res.status(201).json({ ...ad, price_history: [price], images: ['sample.jpg'] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ad (admin or superuser)
app.delete('/api/ads/:ad_id', auth(['admin', 'superuser']), async (req, res) => {
  try {
    const ad = await Ad.delete(req.params.ad_id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction (system_user only)
app.post('/api/transactions', auth(['system_user']), async (req, res) => {
  try {
    const { car_id, buyer_id, seller_id, price, status } = req.body;
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const query = `
      INSERT INTO Transactions (car_id, buyer_id, seller_id, price, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [car_id, buyer_id, seller_id, price, status]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get related cars
app.get('/api/ads/:ad_id/related', async (req, res) => {
  try {
    const query = `
      SELECT a.*, c.*, b.name as brand_name
      FROM Ads a
      JOIN Cars c ON a.car_id = c.car_id
      JOIN Brands b ON c.brand_id = b.brand_id
      WHERE b.brand_id = (
        SELECT c2.brand_id
        FROM Ads a2
        JOIN Cars c2 ON a2.car_id = c2.car_id
        WHERE a2.ad_id = $1
      ) AND a.ad_id != $1
      LIMIT 5
    `;
    const { rows } = await pool.query(query, [req.params.ad_id]);
    res.json(rows.map(ad => ({ ...ad, price_history: [ad.price], images: ['sample.jpg'] })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced search
app.get('/api/ads/search', async (req, res) => {
  const { min_price, max_price, brand, color, condition } = req.query;
  let query = `
    SELECT a.*, c.*, b.name as brand_name
    FROM Ads a
    JOIN Cars c ON a.car_id = c.car_id
    JOIN Brands b ON c.brand_id = b.brand_id
    WHERE 1=1
  `;
  const values = [];
  let paramCount = 1;

  if (min_price) {
    query += ` AND a.price >= $${paramCount++}`;
    values.push(min_price);
  }
  if (max_price) {
    query += ` AND a.price <= $${paramCount++}`;
    values.push(max_price);
  }
  if (brand) {
    query += ` AND b.name = $${paramCount++}`;
    values.push(brand);
  }
  if (color) {
    query += ` AND c.color = $${paramCount++}`;
    values.push(color);
  }
  if (condition) {
    query += ` AND c.condition = $${paramCount++}`;
    values.push(condition);
  }

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows.map(ad => ({ ...ad, price_history: [ad.price], images: ['sample.jpg'] })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve UI
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));