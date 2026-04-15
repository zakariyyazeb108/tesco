const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

router.get('/:userId', (req, res) => {
  const db = getDb();
  const orders = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
  ).all(parseInt(req.params.userId));

  const enriched = orders.map(order => {
    const items = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
    return { ...order, items };
  });

  res.json(enriched);
});

router.post('/', (req, res) => {
  const db = getDb();
  const { user_id, items, order_type, delivery_address, store_location, slot_time, slot_date } = req.body;

  if (!user_id || !items || !items.length || !order_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  total = Math.round(total * 100) / 100;

  const result = db.prepare(`
    INSERT INTO orders (user_id, total, order_type, delivery_address, store_location, slot_time, slot_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    user_id, total, order_type,
    delivery_address || null, store_location || null,
    slot_time || null, slot_date || null
  );

  const orderId = result.lastInsertRowid;

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
  );
  items.forEach(item => {
    insertItem.run(orderId, item.product_id, item.quantity, item.price);
  });

  // £1 spent = 1 point (whole pounds)
  const points = Math.floor(total);
  db.prepare('UPDATE users SET reward_points = reward_points + ? WHERE id = ?').run(points, user_id);
  db.prepare(
    "INSERT INTO rewards (user_id, points, type, description) VALUES (?, ?, 'earned', ?)"
  ).run(user_id, points, `Order #${orderId}`);

  res.status(201).json({ id: orderId, total, points_earned: points });
});

module.exports = router;
