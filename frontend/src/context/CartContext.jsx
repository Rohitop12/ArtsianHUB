import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const cartKey = user ? `artisanhub_cart_${user._id}` : 'artisanhub_cart_guest';

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const localData = localStorage.getItem(cartKey);
        setCartItems(localData ? JSON.parse(localData) : []);
    }, [cartKey]);

    const saveCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem(cartKey, JSON.stringify(newCart));
    };

    const addToCart = (product) => {
        const prev = cartItems;
        const exists = prev.find((item) => item._id === product._id);
        let newCart;
        if (exists) {
            newCart = prev.map((item) =>
                item._id === product._id ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            newCart = [...prev, { ...product, qty: 1 }];
        }
        saveCart(newCart);
    };

    const removeFromCart = (productId) => {
        const newCart = cartItems.filter((item) => item._id !== productId);
        saveCart(newCart);
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        const newCart = cartItems.map((item) => (item._id === productId ? { ...item, qty: newQty } : item));
        saveCart(newCart);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export default CartContext;
