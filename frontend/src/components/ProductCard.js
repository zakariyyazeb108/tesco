import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { productImageSrc } from '../utils/productImage';

function ProductCard({ product, deal }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const effectivePrice = deal ? deal.deal_price : product.price;
  const imgSrc = productImageSrc(product.image_url);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image_url: product.image_url
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div className="product-card">
      {deal && (
        <span className="deal-badge">{deal.discount_percent}% OFF</span>
      )}
      <div className="product-image">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }} />
        ) : (
          product.image_url
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="product-price">
          <span className="current">£{effectivePrice.toFixed(2)}</span>
          {deal && (
            <span className="original">£{product.price.toFixed(2)}</span>
          )}
        </div>
        <button
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
