const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

router.post('/register', (req, res) => {
  const db = getDb();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, password);

    const user = db.prepare(
      'SELECT id, name, email, reward_points FROM users WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', (req, res) => {
  const db = getDb();
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    reward_points: user.reward_points
  });
});

router.get('/:userId/rewards', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT reward_points FROM users WHERE id = ?').get(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });

  const history = db.prepare(
    'SELECT * FROM rewards WHERE user_id = ? ORDER BY created_at DESC'
  ).all(parseInt(req.params.userId));

  res.json({ total_points: user.reward_points, history });
});

router.post('/:userId/rewards/redeem', (req, res) => {
  const db = getDb();
  const { points } = req.body;
  const uid = parseInt(req.params.userId, 10);

  if (points !== 100) {
    return res.status(400).json({ error: 'Redeem exactly 100 points at a time (£10)' });
  }

  const user = db.prepare('SELECT reward_points FROM users WHERE id = ?').get(uid);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.reward_points < 100) {
    return res.status(400).json({ error: 'Not enough points (need 100 for £10)' });
  }

  db.prepare('UPDATE users SET reward_points = reward_points - 100 WHERE id = ?').run(uid);
  db.prepare(
    "INSERT INTO rewards (user_id, points, type, description) VALUES (?, 100, 'redeemed', '£10 off voucher')"
  ).run(uid);

  const updated = db.prepare('SELECT reward_points FROM users WHERE id = ?').get(uid);
  res.json({ message: 'Redeemed', remaining: updated.reward_points });
});

module.exports = router;
