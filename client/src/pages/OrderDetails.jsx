import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    CalendarDays
} from 'lucide-react';

import API from '../api/axios';

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);

                const response = await API.get(`/orders/${id}`);

                setOrder(response.data.order);
            } catch (err) {
                console.error('Error fetching order:', err);

                setError(
                    err.response?.data?.message ||
                    'Failed to load order details'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="page container">
                <div className="page-loading">
                    Loading order details...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="page container">
                <div className="error-message">
                    {error || 'Order not found'}
                </div>

                <Link to="/orders" className="secondary-btn">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const orderSteps = [
        {
            key: 'confirmed',
            label: 'Order Confirmed',
            description: 'Your order has been confirmed successfully.'
        },
        {
            key: 'processing',
            label: 'Processing',
            description: 'We are preparing your fresh groceries.'
        },
        {
            key: 'out_for_delivery',
            label: 'Out for Delivery',
            description: 'Your order is on its way.'
        },
        {
            key: 'delivered',
            label: 'Delivered',
            description: 'Your order has been delivered.'
        }
    ];

    const currentStepIndex = orderSteps.findIndex(
        (step) => step.key === order.orderStatus
    );

    return (
        <div className="page container order-details-page">

            <Link to="/orders" className="back-link">
                <ArrowLeft size={18} />
                Back to Orders
            </Link>

            <div className="order-details-header">
                <div>
                    <h1>
                        Order #{order._id.slice(-6).toUpperCase()}
                    </h1>

                    <div className="order-date">
                        <CalendarDays size={16} />
                        {formatDate(order.createdAt)}
                    </div>
                </div>

                <span className={`status status-${order.orderStatus}`}>
                    {order.orderStatus.replace(/_/g, ' ')}
                </span>
            </div>

            {/* ORDER TRACKING */}
            <div className="order-tracking-section">
                <h2>Track Your Order</h2>

                <div className="tracking-timeline">
                    {orderSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div
                                className={`tracking-step ${isCompleted ? 'completed' : ''
                                    } ${isCurrent ? 'current' : ''}`}
                                key={step.key}
                            >
                                <div className="tracking-indicator">
                                    <div className="tracking-dot">
                                        {isCompleted ? '✓' : index + 1}
                                    </div>

                                    {index !== orderSteps.length - 1 && (
                                        <div className="tracking-line" />
                                    )}
                                </div>

                                <div className="tracking-content">
                                    <h3>{step.label}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="order-details-grid">

                {/* ORDER ITEMS */}
                <div className="order-details-section items-section">
                    <h2>
                        <Package size={21} />
                        Order Items
                    </h2>

                    <div className="order-items">
                        {order.items.map((item, index) => (
                            <div className="order-item" key={index}>

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />

                                <div className="order-item-info">
                                    <h3>{item.name}</h3>

                                    <span>
                                        ₹{item.price} × {item.quantity}
                                    </span>
                                </div>

                                <strong>
                                    ₹{item.price * item.quantity}
                                </strong>

                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <span>Total Amount</span>
                        <strong>₹{order.totalAmount}</strong>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="order-sidebar">

                    {/* DELIVERY ADDRESS */}
                    <div className="order-details-section">
                        <h2>
                            <MapPin size={21} />
                            Delivery Address
                        </h2>

                        <div className="address-details">
                            <strong>{order.shippingAddress.name}</strong>

                            <span>{order.shippingAddress.phone}</span>

                            <p>
                                {order.shippingAddress.address}
                                <br />
                                {order.shippingAddress.city} -{' '}
                                {order.shippingAddress.pincode}
                            </p>
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="order-details-section">
                        <h2>
                            <CreditCard size={21} />
                            Payment Details
                        </h2>

                        <div className="payment-details">
                            <div>
                                <span>Payment Status</span>

                                <strong
                                    className={`payment-${order.paymentStatus}`}
                                >
                                    {order.paymentStatus}
                                </strong>
                            </div>

                            {order.paymentId && (
                                <div>
                                    <span>Payment ID</span>

                                    <small>{order.paymentId}</small>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default OrderDetails;