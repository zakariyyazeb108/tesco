import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Deals from './pages/Deals';
import OrderHistory from './pages/OrderHistory';
import Rewards from './pages/Rewards';
import Collection from './pages/Collection';
import Delivery from './pages/Delivery';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>FreshMart</h4>
            <p>Online groceries (coursework build)</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <p>Products | Deals | Rewards</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>help@freshmart.local</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FreshMart</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
