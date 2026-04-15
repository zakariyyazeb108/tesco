import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import ProductThumb from '../components/ProductThumb';

const API = 'http://localhost:5000/api';

const timeSlots = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00'
];

function Delivery() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useUser();

  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullAddress = `${address}, ${postcode}`;

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
        order_type: 'delivery',
        delivery_address: fullAddress,
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
          🚚 Delivering to: {address}, {postcode}<br />
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
  const deliveryFee = cartTotal >= 40 ? 0 : 3.99;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>🚚 Home Delivery</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery Details</h2>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your full address..."
              required
            />
          </div>

          <div className="form-group">
            <label>Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
              placeholder="e.g. SW1A 1AA"
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Time Slot</label>
            <select value={time} onChange={e => setTime(e.target.value)} required>
              <option value="">Choose a time slot...</option>
              {timeSlots.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {deliveryFee > 0 && (
            <p style={{ fontSize: '0.85rem', color: '#e31837', marginBottom: 8 }}>
              Delivery fee: £{deliveryFee.toFixed(2)} (Free delivery on orders over £40)
            </p>
          )}

          <button
            type="submit"
            className="place-order-btn"
            disabled={!address || !postcode || !date || !time}
          >
            Place Delivery Order - £{(cartTotal + deliveryFee).toFixed(2)}
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
          <div className="summary-item" style={{ color: deliveryFee === 0 ? '#27ae60' : '#333' }}>
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>£{(cartTotal + deliveryFee).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
