import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import MyOrders from './pages/MyOrders';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  },
                }}
              />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/my-orders" element={<MyOrders />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
