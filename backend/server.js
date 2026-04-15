const express = require('express');
const { initDatabase } = require('./database');

async function startServer() {
  await initDatabase();

  const productRoutes = require('./routes/products');
  const orderRoutes = require('./routes/orders');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');

  const app = express();
  const PORT = 5000;

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
