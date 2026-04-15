import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

const categoryEmojis = {
  'Fruit & Veg': '🥬',
  'Meat & Fish': '🥩',
  'Dairy & Eggs': '🥛',
  'Bakery': '🍞',
  'Drinks': '☕',
  'Snacks': '🍪',
  'Frozen': '🍕',
  'Household': '🧴'
};

function Home() {
  const [deals, setDeals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API}/products/deals`)
      .then(res => res.json())
      .then(data => setDeals(data.slice(0, 4)))
      .catch(() => {});

    fetch(`${API}/products?category=Fruit & Veg`)
      .then(res => res.json())
      .then(data => setFeatured(data.slice(0, 4)))
      .catch(() => {});

    fetch(`${API}/products/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Welcome to FreshMart</h1>
        <p>Fresh groceries delivered to your door or ready for collection</p>
        <Link to="/products" className="hero-btn">Shop Now</Link>
      </div>

      <h2 className="section-title">Shop by Category</h2>
      {categories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24 }}>
          No categories yet — go to Admin and add some products first.
        </p>
      ) : (
        <div className="category-grid">
          {categories.map(cat => (
            <Link to={`/products?category=${encodeURIComponent(cat)}`} key={cat} className="category-card">
              <span className="emoji">{categoryEmojis[cat] || '📦'}</span>
              <span className="label">{cat}</span>
            </Link>
          ))}
        </div>
      )}

      {deals.length > 0 && (
        <>
          <h2 className="section-title">Today's Deals</h2>
          <div className="product-grid">
            {deals.map(deal => (
              <ProductCard
                key={deal.id}
                product={{
                  id: deal.product_id,
                  name: deal.name,
                  price: deal.original_price,
                  image_url: deal.image_url,
                  description: deal.product_description
                }}
                deal={deal}
              />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Link to="/deals" className="hero-btn" style={{ background: '#e31837', color: 'white' }}>
              View All Deals
            </Link>
          </div>
        </>
      )}

      {featured.length > 0 && (
        <>
          <h2 className="section-title">Fresh Picks</h2>
          <div className="product-grid">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
