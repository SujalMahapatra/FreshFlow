import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orderApi';

function Checkout() {
  const navigate = useNavigate();

  const { cart, cartTotal } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await createOrder(formData);

      // Store the newly created order temporarily
      // We'll use this ID for Razorpay in the next step
      navigate(`/payment/${response.order._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to create order'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page container empty-cart">
        <h2>Your cart is empty</h2>

        <button
          className="continue-shopping-btn"
          onClick={() => navigate('/products')}
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="page container checkout-page">

      <button
        className="back-button"
        onClick={() => navigate('/cart')}
      >
        <ArrowLeft size={18} />
        Back to Cart
      </button>

      <div className="checkout-layout">

        {/* Shipping Form */}
        <div className="checkout-form-container">

          <div className="checkout-title">
            <MapPin size={28} />
            <div>
              <h1>Delivery Details</h1>
              <p>Where should we deliver your groceries?</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter recipient name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House number, street, locality"
                rows="4"
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="payment-continue-btn"
              disabled={loading}
            >
              {loading
                ? 'Creating Order...'
                : `Continue to Payment • ₹${cartTotal}`
              }
            </button>

          </form>

        </div>

        {/* Order Preview */}
        <div className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-products">

            {cart.map((item) => (
              <div
                className="checkout-product"
                key={item.product._id}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                />

                <div>
                  <h4>{item.product.name}</h4>
                  <span>
                    {item.quantity} × ₹{item.product.price}
                  </span>
                </div>

                <strong>
                  ₹{item.quantity * item.product.price}
                </strong>
              </div>
            ))}

          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <strong>₹{cartTotal}</strong>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;