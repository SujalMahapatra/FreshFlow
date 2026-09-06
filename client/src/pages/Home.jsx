import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Fruits', emoji: '🍎' },
    { name: 'Vegetables', emoji: '🥬' },
    { name: 'Dairy', emoji: '🥛' },
    { name: 'Bakery', emoji: '🍞' },
    { name: 'Beverages', emoji: '🥤' },
    { name: 'Snacks', emoji: '🍪' }
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await API.get('/products');

        // Show the first 4 products as featured products
        setFeaturedProducts(response.data.products.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Fresh groceries, delivered simply</span>

          <h1>
            Fresh groceries for
            <span> everyday living.</span>
          </h1>

          <p>
            Shop fresh fruits, vegetables, dairy, bakery essentials and more —
            delivered conveniently to your doorstep.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="primary-btn">
              Shop Now
            </Link>

            <a href="#categories" className="secondary-btn">
              Explore Categories
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            🛒
          </div>
        </div>
      </section>


      {/* CATEGORIES SECTION */}
      <section className="categories-section" id="categories">
        <div className="section-heading">
          <span>EXPLORE</span>
          <h2>Shop by Category</h2>
          <p>Everything you need, organized for easier shopping.</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="category-card"
            >
              <div className="category-icon">
                {category.emoji}
              </div>

              <h3>{category.name}</h3>
              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </section>


      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <div className="section-heading section-heading-row">
          <div>
            <span>FRESH PICKS</span>
            <h2>Popular products</h2>
            <p>Fresh essentials selected for your everyday needs.</p>
          </div>

          <Link to="/shop" className="view-all-link">
            View all products →
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading fresh products...</p>
        ) : (
          <div className="featured-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>


      {/* WHY FRESHFLOW */}
      <section className="why-section">
        <div className="section-heading">
          <span>WHY FRESHFLOW</span>
          <h2>Groceries made simple</h2>
          <p>
            A smoother way to shop for everyday essentials.
          </p>
        </div>

        <div className="benefits-grid">

          <div className="benefit-card">
            <div className="benefit-icon">🥬</div>
            <h3>Fresh Products</h3>
            <p>
              Carefully selected groceries for your everyday needs.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🚚</div>
            <h3>Easy Ordering</h3>
            <p>
              Browse, add to cart and place your order in a few simple steps.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>
              Secure payment processing powered by Razorpay.
            </p>
          </div>

        </div>
      </section>


      {/* FINAL CTA */}
      <section className="home-cta">
        <div>
          <span>READY TO SHOP?</span>
          <h2>Fresh groceries are just a few clicks away.</h2>
          <p>
            Browse our collection and get your everyday essentials delivered.
          </p>
        </div>

        <Link to="/shop" className="primary-btn">
          Start Shopping →
        </Link>
      </section>

    </div>
  );
};

export default Home;