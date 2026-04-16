const { initDatabase, getDb } = require('./database');

initDatabase();
const db = getDb();

db.exec(`
  DELETE FROM rewards;
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM deals;
  DELETE FROM products;
  DELETE FROM users;
`);

console.log('Database reset. No products yet — add them in Admin.');
console.log('Register an account on the site, then use /admin to add stock.');
