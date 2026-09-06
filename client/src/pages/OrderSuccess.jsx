import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="page container order-success-page">
      <div className="order-success-card">
        <CheckCircle size={80} className="success-icon" />

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Your payment was successful and your order has been confirmed.
        </p>

        <div className="order-id-box">
          <span>Order ID</span>
          <strong>{orderId}</strong>
        </div>

        <div className="success-info">
          <div className="success-info-item">
            <Package size={22} />
            <div>
              <strong>Order Confirmed</strong>
              <span>We're preparing your groceries</span>
            </div>
          </div>

          <div className="success-info-item">
            <ShoppingBag size={22} />
            <div>
              <strong>Fresh Delivery</strong>
              <span>Your order will be delivered soon</span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="primary-btn">
            View My Orders
          </Link>

          <Link to="/products" className="secondary-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;