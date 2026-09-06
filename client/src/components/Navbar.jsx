import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, Leaf, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/');
  };

  const firstInitial = user?.name?.charAt(0).toUpperCase() || '';

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand */}
          <Link to="/" className="brand" onClick={closeMobile}>
            <div className="brand-icon" aria-hidden="true">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            FreshFlow
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>

            <NavLink to="/shop">
              Shop
            </NavLink>

            {user && (
              <NavLink to="/orders">
                <Package size={15} strokeWidth={2} />
                My Orders
              </NavLink>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="nav-actions">
            <Link to="/cart" className="cart-link" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingCart size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="cart-badge" aria-hidden="true">{cartCount}</span>
              )}
            </Link>

            {user ? (
              <div className="user-actions">
                <div className="user-avatar" aria-hidden="true">{firstInitial}</div>
                <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                <button
                  className="icon-btn"
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={17} strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} role="dialog" aria-label="Navigation menu">
        <div className="mobile-overlay" onClick={closeMobile} />
        <div className="mobile-drawer">
          <div className="mobile-drawer-header">
            <div className="brand" style={{ fontSize: '1.1rem' }}>
              <div className="brand-icon">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              FreshFlow
            </div>
            <button className="icon-btn" onClick={closeMobile} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <NavLink to="/" end onClick={closeMobile}>Home</NavLink>
          <NavLink to="/shop" onClick={closeMobile}>Shop</NavLink>
          {user && (
            <NavLink to="/orders" onClick={closeMobile}>
              <Package size={16} strokeWidth={2} />
              My Orders
            </NavLink>
          )}
          <NavLink to="/cart" onClick={closeMobile}>
            <ShoppingCart size={16} strokeWidth={1.75} />
            Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>

          <div className="mobile-drawer-footer">
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
                  <div className="user-avatar">{firstInitial}</div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    background: 'transparent',
                    color: 'var(--color-muted)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={closeMobile}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;