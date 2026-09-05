import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart whenever authentication state changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);

      const response = await API.get('/cart');
      setCart(response.data.cart.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const response = await API.post('/cart', {
      productId,
      quantity
    });

    setCart(response.data.cart.items || []);
    return response.data;
  };

  const updateCartItem = async (productId, quantity) => {
    const response = await API.put(`/cart/${productId}`, {
      quantity
    });

    setCart(response.data.cart.items || []);
    return response.data;
  };

  const removeFromCart = async (productId) => {
    const response = await API.delete(`/cart/${productId}`);

    setCart(response.data.cart.items || []);
    return response.data;
  };

  const clearCart = async () => {
    const response = await API.delete('/cart');

    setCart([]);
    return response.data;
  };

  // Total number of individual items, used for navbar badge
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total cart value
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        cartCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};