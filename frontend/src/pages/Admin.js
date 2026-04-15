import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    description: '',
    stock: '100'
  });

  const load = () => {
    fetch(`${API}/admin/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
    fetch(`${API}/admin/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', price: '', category: '', image_url: '', description: '', stock: '100' });
  };

  const submitProduct = (e) => {
    e.preventDefault();
    const body = {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image_url: form.image_url,
      description: form.description,
      stock: parseInt(form.stock, 10)
    };
    const url = editingId ? `${API}/admin/products/${editingId}` : `${API}/admin/products`;
    const method = editingId ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(() => {
      resetForm();
      load();
    });
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      image_url: p.image_url || '',
      description: p.description || '',
      stock: String(p.stock)
    });
  };

  const del = (id) => {
    if (!window.confirm('Delete this product?')) return;
    fetch(`${API}/admin/products/${id}`, { method: 'DELETE' }).then(load);
  };

  const setStatus = (id, status) => {
    fetch(`${API}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(load);
  };

  return (
    <div>
      <h1>Admin</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Add your products here first — the shop starts empty until you do.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          className="hero-btn"
          style={tab !== 'products' ? { background: '#ccc', color: '#333' } : {}}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          type="button"
          className="hero-btn"
          style={tab !== 'orders' ? { background: '#ccc', color: '#333' } : {}}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
          <form onSubmit={submitProduct} className="checkout-form" style={{ maxWidth: 480 }}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Image (emoji or text)</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <button type="submit" className="place-order-btn">{editingId ? 'Save' : 'Add'}</button>
            {editingId && (
              <button type="button" className="logout-btn" style={{ marginLeft: 8 }} onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>

          <h2 className="section-title" style={{ marginTop: 32 }}>All products ({products.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>£</th>
                <th style={{ padding: 8 }}>Category</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{p.image_url} {p.name}</td>
                  <td style={{ padding: 8 }}>{Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{p.category}</td>
                  <td style={{ padding: 8 }}>
                    <button type="button" onClick={() => startEdit(p)}>Edit</button>
                    <button type="button" onClick={() => del(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h2>Orders ({orders.length})</h2>
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12, borderRadius: 8 }}>
              <strong>#{o.id}</strong> — {o.user_name} — £{Number(o.total).toFixed(2)}
              <br />
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} style={{ marginTop: 8 }}>
                <option value="confirmed">confirmed</option>
                <option value="dispatched">dispatched</option>
                <option value="delivered">delivered</option>
                <option value="collected">collected</option>
                <option value="cancelled">cancelled</option>
              </select>
              <ul style={{ marginTop: 8 }}>
                {(o.items || []).map((it, i) => (
                  <li key={i}>{it.product_name} x{it.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
