const { initDatabase, getDb } = require('./database');

async function seed() {
  await initDatabase();
  const db = getDb();

  db.exec('DELETE FROM rewards');
  db.exec('DELETE FROM order_items');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM deals');
  db.exec('DELETE FROM products');
  db.exec('DELETE FROM users');

  console.log('Database reset. No products yet — add them in Admin.');
  console.log('Register an account on the site, then use /admin to add stock.');
}

seed();
