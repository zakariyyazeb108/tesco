import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import ProductThumb from '../components/ProductThumb';

const API = 'http://localhost:5000/api';

const stores = [
  'London - Covent Garden',
  'London - Kensington',
  'Manchester - Piccadilly',
  'Birmingham - Bull Ring',
  'Leeds - City Centre',
  'Glasgow - Argyle Street'
];

const timeSlots = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00'
];

function Collection() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [store, setStore] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        order_type: 'collection',
        store_location: store,
        slot_date: date,
        slot_time: time
      })
    });

    if (res.ok) {
      const data = await res.json();
      setOrderDetails(data);
      setSuccess(true);
      clearCart();
    }
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="icon">🔒</div>
        <h2>Please log in</h2>
        <p>You need to be logged in to place an order</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    return (
      <div className="empty-state">
        <div className="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products before checkout</p>
        <Link to="/products">Browse Products</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-message">
        <div className="icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Order #{orderDetails.id} - Total: £{orderDetails.total.toFixed(2)}</p>
        <p>You earned <strong>{orderDetails.points_earned} reward points</strong>!</p>
        <p style={{ marginTop: 8, color: '#666' }}>
          🏪 Collect from: {store}<br />
          📅 {date} at {time}
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/order-history" className="hero-btn" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
            View Orders
          </Link>
          <Link to="/products" className="hero-btn" style={{ fontSize: '0.9rem', padding: '10px 20px', background: '#27ae60' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>🏪 Click & Collect</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Collection Details</h2>

          <div className="form-group">
            <label>Select Store</label>
            <select value={store} onChange={e => setStore(e.target.value)} required>
              <option value="">Choose a store...</option>
              {stores.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Collection Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Collection Time Slot</label>
            <select value={time} onChange={e => setTime(e.target.value)} required>
              <option value="">Choose a time slot...</option>
              {timeSlots.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={!store || !date || !time}
          >
            Place Collection Order - £{cartTotal.toFixed(2)}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span><ProductThumb imageUrl={item.image_url} size={32} />{item.name} x{item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>£{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
