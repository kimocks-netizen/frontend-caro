import { useState, useEffect } from 'react';
interface CartItem {
  id: string;
  title: string;
  image_url?: string[];
  quantity: number; // Ensure this is in your interface
  message?: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('quoteCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('quoteCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity: number }) => {
  setCartItems(prevItems => {
    const existingItem = prevItems.find(item => item.id === product.id);
    if (existingItem) {
      return prevItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
    }
    return [...prevItems, product];
  });
};

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};