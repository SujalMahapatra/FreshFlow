import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    cartLoading,
    cartTotal,
    updateCartItem,
    removeFromCart
  } = useCart();

  const handleIncrease = async (item) => {
    try {
      if (item.quantity >= item.product.stock) {
        alert(`Only ${item.product.stock} unit(s) available`);
        return;
      }

      await updateCartItem(
        item.product._id,
        item.quantity + 1
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  const handleDecrease = async (item) => {
    try {
      if (item.quantity === 1) {
        await removeFromCart(item.product._id);
        return;
      }

      await updateCartItem(
        item.product._id,
        item.quantity - 1
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to remove product'
      );
    }
  };

  if (cartLoading) {
    return (
      <div className="page container">
        <div className="loading-state">Loading your cart…</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page container empty-cart">
        <div className="empty-cart-icon">
          <ShoppingBag size={32} strokeWidth={1.5} />
        </div>

        <h2>Your cart is empty</h2>

        <p>Looks like you haven't added anything yet.</p>

        <Link to="/shop" className="continue-shopping-btn">
          <ArrowLeft size={16} strokeWidth={2} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page container cart-page">

      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>{cart.length} product{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <Link to="/shop" className="back-shopping">
          ← Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">

        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.product._id}>

              <img
                src={item.product.image}
                alt={item.product.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <span className="product-category">
                  {item.product.category}
                </span>

                <h3>{item.product.name}</h3>

                <p>{item.product.unit}</p>

                <span className="cart-item-price">
                  ₹{item.product.price} each
                </span>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() => handleDecrease(item)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => handleIncrease(item)}
                  aria-label="Increase quantity"
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>

              <div className="cart-item-total">
                ₹{item.product.price * item.quantity}
              </div>

              <button
                className="remove-btn"
                onClick={() => handleRemove(item.product._id)}
                aria-label={`Remove ${item.product.name}`}
              >
                <Trash2 size={16} strokeWidth={1.75} />
              </button>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-delivery">Free</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <p className="secure-checkout">
            <ShieldCheck size={13} strokeWidth={2} />
            Secure checkout powered by Razorpay
          </p>
        </div>

      </div>
    </div>
  );
}

export default Cart;