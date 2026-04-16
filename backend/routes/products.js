const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

router.get('/', (req, res) => {
  const db = getDb();
  const { category, search } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY category, name';
  const products = db.prepare(sql).all(...params);
  res.json(products);
});

router.get('/categories', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

router.get('/deals', (req, res) => {
  const db = getDb();
  const deals = db.prepare(`
    SELECT d.*, p.name, p.price AS original_price, p.image_url, p.category, p.description AS product_description
    FROM deals d
    JOIN products p ON d.product_id = p.id
    ORDER BY d.discount_percent DESC
  `).all();
  res.json(deals);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const deal = db.prepare('SELECT * FROM deals WHERE product_id = ?').get(product.id);
  res.json({ ...product, deal: deal || null });
});

module.exports = router;
