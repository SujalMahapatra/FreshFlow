import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();

  // Read category from URL, defaulting to All
  const categoryFromURL = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep selected category synchronized with URL
  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    setSelectedCategory(category);
  }, [searchParams]);

  // Fetch products whenever category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};

        // Only send category when a specific category is selected
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        // Send search query if present
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

    // Small debounce for search input
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, search]);

  // Handle category selection and synchronize it with URL
  const handleCategoryChange = (category) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="page container products-page">

      {/* PAGE HEADER */}
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

      {/* CATEGORY FILTER */}
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="loading-state">
          Loading fresh products...
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try searching for something else.</p>
        </div>
      )}

      {/* PRODUCTS GRID */}
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