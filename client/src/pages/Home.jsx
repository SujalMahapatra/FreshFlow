import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Truck, ShieldCheck, Apple, Salad, Milk, Wheat, Coffee, Cookie, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Fruits',     icon: Apple  },
  { name: 'Vegetables', icon: Salad  },
  { name: 'Dairy',      icon: Milk   },
  { name: 'Bakery',     icon: Wheat  },
  { name: 'Beverages',  icon: Coffee },
  { name: 'Snacks',     icon: Cookie },
];

const BENEFITS = [
  {
    icon: Leaf,
    title: 'Fresh Products',
    description: 'Carefully sourced groceries for your everyday needs, delivered at peak freshness.',
  },
  {
    icon: Truck,
    title: 'Easy Ordering',
    description: 'Browse, add to cart and place your order in a few simple steps.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Trusted, secure payment processing powered by Razorpay.',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <Leaf size={13} strokeWidth={2.5} />
            Fresh groceries, delivered simply
          </span>

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
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>

            <a href="#categories" className="secondary-btn">
              Explore Categories
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop" 
            alt="Fresh Groceries" 
            style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius)', objectFit: 'cover', maxHeight: '400px' }}
          />
        </div>
      </section>


      {/* ── CATEGORIES ── */}
      <section className="categories-section" id="categories">
        <div className="section-heading">
          <span>Explore</span>
          <h2>Shop by Category</h2>
          <p>Everything you need, organized for easier shopping.</p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              to={`/shop?category=${name}`}
              className="category-card"
            >
              <div className="category-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3>{name}</h3>
              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </section>


      {/* ── FEATURED PRODUCTS ── */}
      <section className="featured-section">
        <div className="section-heading section-heading-row">
          <div>
            <span>Fresh Picks</span>
            <h2>Popular Products</h2>
            <p>Fresh essentials selected for your everyday needs.</p>
          </div>

          <Link to="/shop" className="view-all-link">
            View all products <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading fresh products…</p>
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


      {/* ── WHY FRESHFLOW ── */}
      <section className="why-section">
        <div className="section-heading">
          <span>Why FreshFlow</span>
          <h2>Groceries made simple</h2>
          <p>A smoother way to shop for everyday essentials.</p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div className="benefit-card" key={title}>
              <div className="benefit-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── FINAL CTA ── */}
      <section className="home-cta">
        <div>
          <span>Ready to shop?</span>
          <h2>Fresh groceries are just a few clicks away.</h2>
          <p>Browse our collection and get your everyday essentials delivered.</p>
        </div>

        <Link to="/shop" className="primary-btn">
          Start Shopping
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </section>

    </div>
  );
};

export default Home;