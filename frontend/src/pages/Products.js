import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetch(`${API}/products/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});

    fetch(`${API}/products/deals`)
      .then(res => res.json())
      .then(data => setDeals(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let url = `${API}/products`;
    const params = new URLSearchParams();
    if (activeCategory) params.append('category', activeCategory);
    if (search) params.append('search', search);
    if (params.toString()) url += '?' + params.toString();

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, [activeCategory, search]);

  const getDealForProduct = (productId) => {
    return deals.find(d => d.product_id === productId) || null;
  };

  const selectCategory = (cat) => {
    if (cat === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>
        {activeCategory || 'All Products'}
      </h1>

      <div className="products-layout">
        <aside className="products-sidebar">
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="filter-list">
            <li
              className={!activeCategory ? 'active' : ''}
              onClick={() => setSearchParams({})}
            >
              All Products
            </li>
            {categories.map(cat => (
              <li
                key={cat}
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div className="products-main">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h2>No products found</h2>
              <p>Try a different search term or category</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  deal={getDealForProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
