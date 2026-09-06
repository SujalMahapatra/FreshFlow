import API from './axios';

export const createOrder = async (shippingAddress) => {
  const response = await API.post('/orders', {
    shippingAddress
  });

  return response.data;
};

export const getMyOrders = async () => {
  const response = await API.get('/orders/my-orders');

  return response.data;
};

export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`);

  return response.data;
};