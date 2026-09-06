import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="page container order-success-page">
      <div className="order-success-card">

        {/* Success Icon */}
        <div className="success-icon-wrap">
          <CheckCircle size={36} strokeWidth={2} className="success-icon" />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Your payment was successful and your order has been confirmed.
          We'll start preparing your fresh groceries right away.
        </p>

        <div className="order-id-box">
          <span>Order ID</span>
          <strong>{orderId}</strong>
        </div>

        <div className="success-info">
          <div className="success-info-item">
            <Package size={18} strokeWidth={2} />
            <div>
              <strong>Order Confirmed</strong>
              <span>We're preparing your groceries</span>
            </div>
          </div>

          <div className="success-info-item">
            <Truck size={18} strokeWidth={2} />
            <div>
              <strong>Fresh Delivery</strong>
              <span>Your order will be delivered soon</span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="primary-btn">
            View My Orders
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>

          <Link to="/shop" className="secondary-btn">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;