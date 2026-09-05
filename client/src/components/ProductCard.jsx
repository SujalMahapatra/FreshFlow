import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert(
        error.response?.data?.message ||
        'Could not add product to cart'
      );
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        {product.stock < 10 && product.stock > 0 && (
          <span className="stock-warning">Only {product.stock} left</span>
        )}

        {product.stock === 0 && (
          <span className="out-of-stock">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-unit">{product.unit}</p>

        <div className="product-footer">
          <div>
            <span className="product-price">
              ₹{product.price}
            </span>
          </div>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;