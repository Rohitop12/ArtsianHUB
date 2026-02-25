import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const MyOrders = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'buyer') {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch your orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="font-serif text-4xl font-bold text-stone-800">My Orders</h1>
                    <p className="text-stone-500 mt-2 text-lg">Track your handcrafted purchases</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">No orders found</h3>
                        <p className="text-stone-500 mb-8">Looks like you haven't made any purchases yet.</p>
                        <Link to="/products" className="btn-primary">Browse Artisan Goods</Link>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">

                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-stone-100">
                                    <div>
                                        <p className="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">
                                            Order Placed
                                        </p>
                                        <p className="font-bold text-stone-800 text-lg">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:text-right">
                                        <p className="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">
                                            Order Total
                                        </p>
                                        <p className="font-bold text-stone-800 text-lg">{formatPrice(order.totalPrice)}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:text-right">
                                        <p className="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">
                                            Payment
                                        </p>
                                        <p className="font-bold text-stone-800">{order.paymentMethod || 'Card'}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:text-right">
                                        <p className="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">
                                            Order #
                                        </p>
                                        <p className="font-bold text-stone-800">{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Order Items timeline */}
                                <div className="space-y-6">
                                    <h4 className="font-bold text-stone-800 mb-4 text-xl">Order Items</h4>
                                    {order.orderItems.map((item) => (
                                        <div key={item._id} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-stone-50 p-4 sm:p-6 rounded-2xl">
                                            <div className="w-24 h-24 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>

                                            <div className="flex-1 text-center sm:text-left">
                                                <Link to={`/product/${item.product}`} className="font-serif font-bold text-xl text-stone-800 hover:text-amber-600 transition-colors">
                                                    {item.title}
                                                </Link>
                                                <p className="text-stone-500 mt-1">
                                                    Qty: {item.qty} &times; {formatPrice(item.price)}
                                                </p>
                                                <p className="text-stone-400 text-sm mt-1">
                                                    Shipped to: {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0 mt-2 sm:mt-0 flex flex-col items-center sm:items-end">
                                                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Status</p>
                                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {item.status === 'Pending' ? '📦 Preparing' : item.status === 'Shipped' ? '🚚 Shipped' : '✅ Delivered'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
