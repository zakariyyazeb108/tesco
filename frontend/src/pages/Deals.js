import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/products/deals`)
      .then(res => res.json())
      .then(data => {
        setDeals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading deals...</div>;

  return (
    <div>
      <div className="deals-banner">
        <h1>🔥 Today's Deals</h1>
        <p>Great savings on your favourite products</p>
      </div>

      {deals.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏷️</div>
          <h2>No deals right now</h2>
          <p>Check back soon for new offers</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Deals;
