import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProductThumb from '../components/ProductThumb';

const API = 'http://localhost:5000/api';

function OrderHistory() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`${API}/orders/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="empty-state">
        <div className="icon">🔒</div>
        <h2>Please log in</h2>
        <p>You need to be logged in to view your order history</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Order History</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <Link to="/products">Browse Products</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.id}</span>
                <span style={{ marginLeft: 12, color: '#666', fontSize: '0.85rem' }}>
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <span className={`order-status ${order.status}`}>{order.status}</span>
            </div>

            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item-row">
                  <span><ProductThumb imageUrl={item.image_url} size={32} />{item.name} x{item.quantity}</span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-meta">
              <span>
                {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Collection'}
                {order.order_type === 'delivery' && order.delivery_address && ` - ${order.delivery_address}`}
                {order.order_type === 'collection' && order.store_location && ` - ${order.store_location}`}
              </span>
              <span className="order-total">Total: £{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
