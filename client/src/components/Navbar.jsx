import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="brand">
          <Leaf size={28} />
          <span>FreshFlow</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/shop">
            Shop
          </NavLink>

          {user && (
            <NavLink to="/orders">
              <Package size={19} />
              My Orders
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            <ShoppingCart size={21} />
            <span className="cart-badge">{cartCount}</span>
          </Link>

          {user ? (
            <div className="user-actions">
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>

              <button
                className="icon-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;