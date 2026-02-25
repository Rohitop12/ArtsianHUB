import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { currency, setCurrency, currencies } = useCurrency();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        if (user) {
            const fetchNotifications = async () => {
                try {
                    const { data } = await api.get('/notifications');
                    setNotifications(data);
                } catch (err) {
                    console.error('Failed to fetch notifications', err);
                }
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="bg-stone-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-200">
                            <span className="text-stone-900 font-serif font-bold text-lg">A</span>
                        </div>
                        <span className="font-serif font-bold text-xl text-white">
                            Artisan<span className="text-amber-400">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-stone-300 hover:text-amber-400 transition-colors duration-200 font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-stone-300 hover:text-amber-400 transition-colors duration-200 font-medium"
                        >
                            Products
                        </Link>
                        <Link
                            to="/#new-arrivals"
                            onClick={() => {
                                setTimeout(() => {
                                    document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            }}
                            className="text-stone-300 hover:text-amber-400 transition-colors duration-200 font-medium"
                        >
                            New Arrivals
                        </Link>
                    </div>

                    {/* Auth + Cart */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-stone-800 text-stone-300 border border-stone-700 rounded-md px-2 py-1 text-sm font-semibold focus:outline-none focus:border-amber-500 hover:bg-stone-700 cursor-pointer transition-colors"
                        >
                            {currencies.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 text-stone-300 hover:text-amber-400 transition-colors relative"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden py-2 animate-fade-in z-50">
                                        <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                            <h3 className="font-semibold text-stone-800">Notifications</h3>
                                            {unreadCount > 0 && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">{unreadCount} New</span>}
                                        </div>
                                        <div className="max-h-[22rem] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-sm text-stone-500 flex flex-col items-center">
                                                    <span className="text-4xl mb-2">📭</span>
                                                    <p>No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n._id}
                                                        onClick={() => { if (!n.isRead) markAsRead(n._id); }}
                                                        className={`p-4 border-b border-stone-50 hover:bg-stone-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-amber-50/30 border-l-4 border-l-amber-400' : 'border-l-4 border-l-transparent'}`}
                                                    >
                                                        <p className={`text-sm ${!n.isRead ? 'text-stone-800 font-semibold' : 'text-stone-500'}`}>{n.message}</p>
                                                        <span className="text-[10px] text-stone-400 mt-1.5 block font-medium">
                                                            {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-stone-300 text-sm hidden lg:inline">
                                    Hi, <span className="text-amber-400 font-semibold">{user.name?.split(' ')[0]}</span>
                                </span>
                                {user.role === 'buyer' && (
                                    <Link
                                        to="/my-orders"
                                        className="text-stone-300 hover:text-amber-400 text-sm font-semibold transition-colors bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg px-3 py-1.5"
                                    >
                                        My Orders
                                    </Link>
                                )}
                                {user.role === 'artisan' && (
                                    <Link
                                        to="/dashboard"
                                        className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        My Studio
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-stone-700 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-stone-300 hover:text-amber-400 hover:bg-stone-800 transition-all"
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-stone-700 animate-fade-in">
                        <div className="flex flex-col space-y-3 px-2">
                            {/* Mobile Currency Selector */}
                            <div className="flex items-center justify-between py-2 px-2 hover:bg-stone-800 rounded-lg">
                                <span className="text-stone-300 font-medium">Currency</span>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-stone-700 text-stone-200 border-none rounded-md px-2 py-1 text-sm focus:outline-none"
                                >
                                    {currencies.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <Link to="/" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">Home</Link>
                            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">Products</Link>
                            {user ? (
                                <>
                                    <span className="text-stone-400 text-sm px-2">Hi, {user.name}</span>
                                    {user.role === 'buyer' && (
                                        <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">My Orders</Link>
                                    )}
                                    {user.role === 'artisan' && (
                                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">My Studio</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-stone-800 transition-all">Login</Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-amber-600 hover:bg-amber-500 text-white py-2 px-4 rounded-lg text-center font-semibold transition-all">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
