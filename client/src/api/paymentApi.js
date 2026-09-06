import API from './axios';

export const createRazorpayOrder = async (orderId) => {
  const response = await API.post(
    `/payments/create-order/${orderId}`
  );

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await API.post(
    '/payments/verify',
    paymentData
  );

  return response.data;
};