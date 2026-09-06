import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import API from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await API.get('/orders/my-orders');

        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load your orders'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="page-loading">Loading your orders…</div>
      </div>
    );
  }

  return (
    <div className="page container orders-page">

      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track and manage your grocery orders</p>
        </div>

        <div className="orders-header-icon">
          <Package size={22} strokeWidth={1.75} />
        </div>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      {!error && orders.length === 0 && (
        <div className="empty-orders">
          <div className="empty-orders-icon">
            <ShoppingBag size={32} strokeWidth={1.5} />
          </div>

          <h2>No orders yet</h2>

          <p>
            Looks like you haven't placed any orders yet.
            Start shopping for fresh groceries!
          </p>

          <Link to="/shop" className="primary-btn">
            Start Shopping
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <Link
            to={`/orders/${order._id}`}
            className="order-card"
            key={order._id}
          >
            <div className="order-card-main">
              <div className="order-icon">
                <Package size={18} strokeWidth={1.75} />
              </div>

              <div className="order-info">
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>

                <span>
                  {formatDate(order.createdAt)} · {order.items.length} item
                  {order.items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="order-card-right">
              <strong>₹{order.totalAmount}</strong>

              <span
                className={`status status-${order.orderStatus}`}
              >
                {order.orderStatus.replace(/_/g, ' ')}
              </span>

              <ChevronRight size={18} strokeWidth={1.75} />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default Orders;