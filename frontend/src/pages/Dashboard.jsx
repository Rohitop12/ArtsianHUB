import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchMyProducts = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, ordersRes] = await Promise.all([
                api.get('/products/artisan/me'),
                api.get('/orders/artisan')
            ]);
            setProducts(productsRes.data);
            setOrders(ordersRes.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'artisan') {
            navigate('/');
            return;
        }
        fetchMyProducts();
    }, [user, navigate, fetchMyProducts]);

    const handleCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success('Product deleted.');
        } catch (err) {
            console.error('Delete Error:', err);
            toast.error('Failed to delete product: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleFormSubmit = async (productData) => {
        setSubmitting(true);
        try {
            if (editingProduct) {
                // Update
                const { data } = await api.put(`/products/${editingProduct._id}`, productData);
                setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
                toast.success('Product updated!');
            } else {
                // Create
                const { data } = await api.post('/products', productData);
                setProducts([data, ...products]);
                toast.success('Product published!');
            }
            setIsFormOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, itemId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/item/${itemId}/status`, { status: newStatus });
            // Refresh orders blindly or manually update state
            const { data } = await api.get('/orders/artisan');
            setOrders(data);
            toast.success(`Order marked as ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Analytics Calculations
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.orderItems
            .filter(item => item.artisan === user._id)
            .reduce((itemSum, item) => itemSum + (item.price * item.qty), 0);
        return sum + orderTotal;
    }, 0);

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-stone-800">My Studio</h1>
                        <p className="text-stone-500 mt-2">Manage your artistic creations and orders</p>
                    </div>
                    {!isFormOpen && activeTab === 'products' && (
                        <button onClick={handleCreate} className="btn-primary">
                            + Add New Product
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-stone-200 overflow-x-auto select-none">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 px-2 font-bold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-2 font-bold whitespace-nowrap transition-all ${activeTab === 'products' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        My Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-2 font-bold whitespace-nowrap transition-all ${activeTab === 'orders' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        Customer Orders
                    </button>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

                {/* Form Section */}
                {isFormOpen && activeTab === 'products' && (
                    <div className="mb-10 max-w-2xl animate-fade-in shadow-xl bg-white p-6 rounded-3xl border border-stone-100">
                        <ProductForm
                            initialData={editingProduct}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                            loading={submitting}
                        />
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in space-y-8">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl">🖌️</div>
                                <div>
                                    <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Products</p>
                                    <p className="text-4xl font-serif font-bold text-stone-800">{totalProducts}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">📦</div>
                                <div>
                                    <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
                                    <p className="text-4xl font-serif font-bold text-stone-800">{totalOrders}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl">💸</div>
                                <div>
                                    <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                                    <p className="text-4xl font-serif font-bold text-stone-800">{formatPrice(totalRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Snippet */}
                        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-serif text-2xl font-bold text-stone-800">Recent Orders</h3>
                                <button onClick={() => setActiveTab('orders')} className="text-amber-600 font-bold hover:text-amber-700 text-sm transition-colors">
                                    View All &rarr;
                                </button>
                            </div>

                            {orders.length === 0 ? (
                                <p className="text-stone-500 italic">No recent orders yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.slice(0, 3).map(order => {
                                        const myItems = order.orderItems.filter(item => item.artisan === user._id);
                                        const orderValue = myItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
                                        return (
                                            <div key={order._id} className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl">
                                                <div>
                                                    <p className="font-bold text-stone-800">#{order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()} &bull; {myItems.length} items</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-stone-800">{formatPrice(orderValue)}</p>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${myItems.every(i => i.status === 'Delivered') ? 'bg-green-100 text-green-700' :
                                                        myItems.some(i => i.status === 'Pending') ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {myItems.every(i => i.status === 'Delivered') ? 'Completed' : 'In Progress'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && !isFormOpen && (
                    products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
                            <div className="text-6xl mb-4">🖌️</div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">Your studio is empty</h3>
                            <p className="text-stone-500">You haven't added any products yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="card overflow-hidden group">
                                    <div className="relative h-48 bg-stone-200">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-stone-700 shadow-sm">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif font-bold text-stone-800 truncate mb-1">
                                            {product.title}
                                        </h3>
                                        <div className="text-amber-600 font-bold mb-4">{formatPrice(product.price)}</div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">No orders yet</h3>
                            <p className="text-stone-500">When customers purchase your items, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                                    <div className="flex flex-col sm:flex-row justify-between mb-6 pb-6 border-b border-stone-100">
                                        <div>
                                            <h3 className="font-bold text-stone-800">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                            <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 text-left sm:text-right">
                                            <p className="font-semibold text-stone-800">{order.buyer?.name || 'Customer'}</p>
                                            <p className="text-sm text-stone-500">{order.buyer?.email}</p>
                                            <p className="text-sm text-stone-500 mt-1">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                            <p className="text-sm text-amber-600 font-semibold mt-1">Paid via: {order.paymentMethod || 'Card'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Filter order items to only show those belonging to THIS artisan */}
                                        {order.orderItems
                                            .filter(item => item.artisan.toString() === user._id)
                                            .map(item => (
                                                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-4 bg-stone-50 p-4 rounded-xl">
                                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                                                    <div className="flex-1 text-center sm:text-left">
                                                        <p className="font-bold text-stone-800">{item.title}</p>
                                                        <p className="text-sm text-stone-500">Qty: {item.qty} &times; {formatPrice(item.price)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            item.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order._id, item._id, e.target.value)}
                                                            className="text-sm border border-stone-300 rounded-lg px-2 py-1 outline-none"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Dashboard;
