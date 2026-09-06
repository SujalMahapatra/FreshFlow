import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import loadRazorpay from '../utils/loadRazorpay';
import {
  createRazorpayOrder,
  verifyPayment
} from '../api/paymentApi';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { fetchCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStarted, setPaymentStarted] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError('');

        // Load Razorpay SDK
        const isLoaded = await loadRazorpay();

        if (!isLoaded) {
          setError(
            'Failed to load Razorpay. Please check your internet connection.'
          );
          return;
        }

        // Create Razorpay order through our secure backend
        const response = await createRazorpayOrder(orderId);

        const { razorpayOrder, keyId } = response;

        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'FreshFlow',
          description: 'Fresh groceries delivered to your doorstep',
          order_id: razorpayOrder.id,

          handler: async function (razorpayResponse) {
            try {
              setPaymentStarted(true);

              const verificationResponse = await verifyPayment({
                orderId,
                razorpay_payment_id:
                  razorpayResponse.razorpay_payment_id,
                razorpay_order_id:
                  razorpayResponse.razorpay_order_id,
                razorpay_signature:
                  razorpayResponse.razorpay_signature
              });

              if (verificationResponse.success) {
                // Refresh frontend cart because backend cleared it
                await fetchCart();

                navigate(
                  `/order-success/${verificationResponse.order._id}`,
                  { replace: true }
                );
              }
            } catch (error) {
              setError(
                error.response?.data?.message ||
                'Payment verification failed'
              );
              setPaymentStarted(false);
            }
          },

          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
          },

          theme: {
            color: '#1a5c38'
          },

          modal: {
            ondismiss: () => {
              setPaymentStarted(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on('payment.failed', function (response) {
          setError(
            response.error?.description ||
            'Payment failed. Please try again.'
          );
          setPaymentStarted(false);
        });

        razorpay.open();
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to initialize payment'
        );
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [orderId, user, fetchCart, navigate]);

  return (
    <div className="page container payment-page">

      <div className="payment-card">

        {loading && (
          <>
            <div className="payment-loader-wrap">
              <Loader className="payment-loader" size={28} strokeWidth={2} />
            </div>
            <h2>Preparing secure payment…</h2>
            <p>Please wait while we connect to Razorpay.</p>
          </>
        )}

        {!loading && error && (
          <>
            <CreditCard size={48} className="payment-error-icon" strokeWidth={1.5} />

            <h2>Payment could not be started</h2>

            <p className="payment-error">{error}</p>

            <button
              className="retry-payment-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </>
        )}

        {paymentStarted && (
          <>
            <div className="payment-loader-wrap">
              <ShieldCheck size={28} className="payment-success-icon" strokeWidth={2} />
            </div>

            <h2>Verifying your payment…</h2>

            <p>Please don't close or refresh this page.</p>
          </>
        )}

        {!loading && !error && !paymentStarted && (
          <p className="payment-secure-badge">
            <ShieldCheck size={14} strokeWidth={2} />
            Secured by Razorpay
          </p>
        )}

      </div>

    </div>
  );
}

export default Payment;