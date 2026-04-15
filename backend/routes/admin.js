const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

router.get('/products', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM products ORDER BY id DESC').all());
});

router.post('/products', (req, res) => {
  const db = getDb();
  const { name, price, category, image_url, description, stock } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ error: 'name, price and category needed' });
  }
  const r = db.prepare(
    'INSERT INTO products (name, price, category, image_url, description, stock) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, Number(price), category, image_url || '', description || '', stock != null ? Number(stock) : 100);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/products/:id', (req, res) => {
  const db = getDb();
  const id = parseInt(req.params.id, 10);
  const old = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!old) return res.status(404).json({ error: 'not found' });
  const { name, price, category, image_url, description, stock } = req.body;
  db.prepare(
    'UPDATE products SET name=?, price=?, category=?, image_url=?, description=?, stock=? WHERE id=?'
  ).run(
    name != null ? name : old.name,
    price != null ? Number(price) : old.price,
    category != null ? category : old.category,
    image_url !== undefined ? image_url : old.image_url,
    description !== undefined ? description : old.description,
    stock != null ? Number(stock) : old.stock,
    id
  );
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
});

router.delete('/products/:id', (req, res) => {
  const db = getDb();
  const id = parseInt(req.params.id, 10);
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(id)) {
    return res.status(404).json({ error: 'not found' });
  }
  db.prepare('DELETE FROM deals WHERE product_id = ?').run(id);
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ ok: true });
});

router.get('/orders', (req, res) => {
  const db = getDb();
  const orders = db.prepare(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
     FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
  ).all();
  orders.forEach((order) => {
    order.items = db.prepare(
      `SELECT oi.*, p.name AS product_name FROM order_items oi
       JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`
    ).all(order.id);
  });
  res.json(orders);
});

router.put('/orders/:id/status', (req, res) => {
  const db = getDb();
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });
  const o = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
  if (!o) return res.status(404).json({ error: 'not found' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  res.json({ id, status });
});

module.exports = router;
