import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            🛒 Fresh<span>Mart</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/products" className={isActive('/products')}>Products</Link>
            <Link to="/deals" className={isActive('/deals')}>Deals</Link>
            {user && <Link to="/order-history" className={isActive('/order-history')}>Orders</Link>}
            {user && <Link to="/rewards" className={isActive('/rewards')}>Rewards</Link>}
            <Link to="/admin" className={isActive('/admin')}>Admin</Link>
          </div>

          <div className="navbar-right">
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {user ? (
              <>
                <span style={{ color: 'white', fontSize: '0.85rem' }}>Hi, {user.name.split(' ')[0]}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="user-btn">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-panel">
            <div className="cart-header">
              <h2>Your Cart ({cartCount})</h2>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p style={{ fontSize: '3rem' }}>🛒</p>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-emoji">{item.image_url}</div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <Link
                    to="/delivery"
                    className="btn-delivery"
                    onClick={() => setCartOpen(false)}
                  >
                    🚚 Checkout for Delivery
                  </Link>
                  <Link
                    to="/collection"
                    className="btn-collection"
                    onClick={() => setCartOpen(false)}
                  >
                    🏪 Checkout for Collection
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
