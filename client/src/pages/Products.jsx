import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/productApi';

const categories = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks'
];

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};

        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const data = await getProducts(params);
        setProducts(data.products);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load products'
        );
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, search]);

  return (
    <div className="page container products-page">
      <div className="page-header">
        <div>
          <h1>Fresh Groceries</h1>
          <p>Fresh products delivered to your doorstep.</p>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">
          Loading fresh products...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try searching for something else.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;