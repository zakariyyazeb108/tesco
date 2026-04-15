const express = require('express');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./database');

async function startServer() {
  await initDatabase();

  const productRoutes = require('./routes/products');
  const orderRoutes = require('./routes/orders');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');

  const app = express();
  const PORT = 5000;

  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  app.use(express.json());

  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/', (req, res) => {
    res.json({ ok: true, message: 'API running' });
  });

  app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
  });
}

startServer();
