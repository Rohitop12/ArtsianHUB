import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const [checkoutMode, setCheckoutMode] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [shipping, setShipping] = React.useState({
        address: '', city: '', postalCode: '', country: ''
    });
    const [paymentMethod, setPaymentMethod] = React.useState('Card');

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role === 'artisan') {
            toast.error('Artisans cannot place orders. Please login as a Buyer.');
            return;
        }

        if (!shipping.address.trim() || !shipping.city.trim() || !shipping.postalCode.trim() || !shipping.country.trim()) {
            return toast.error('Please provide complete shipping information.');
        }

        setSubmitting(true);
        try {
            await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress: shipping,
                paymentMethod,
                totalPrice: cartTotal
            });
            clearCart();
            setSuccess(true);
            toast.success('Order placed successfully! 🎨');
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to place order. ' + (error.response?.data?.message || ''));
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="font-serif text-4xl font-bold text-stone-800 mb-4">Order Placed!</h2>
                <p className="text-stone-500 mb-8 max-w-md text-center">
                    Thank you for supporting our artisans! Your order has been securely placed and is now being processed.
                </p>
                <Link to="/products" className="btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="font-serif text-3xl font-bold text-stone-800 mb-4">Your cart is empty</h2>
                <p className="text-stone-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Discover unique handcrafted pieces in our collection.
                </p>
                <Link to="/products" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-4xl font-bold text-stone-800 mb-10">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-stone-100 flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 w-full text-center sm:text-left">
                                    <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">{item.title}</h3>
                                    <p className="text-stone-500 text-sm mb-4">{item.category}</p>
                                    <div className="text-amber-600 font-bold text-lg">{formatPrice(item.price)}</div>
                                </div>

                                <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                                    <div className="flex items-center gap-3 bg-stone-50 rounded-full px-4 py-2 border border-stone-200">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                                            className="text-stone-500 hover:text-stone-800 font-bold text-xl px-2"
                                        >
                                            &minus;
                                        </button>
                                        <span className="font-semibold text-stone-800 w-6 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                                            className="text-stone-500 hover:text-stone-800 font-bold text-xl px-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 sticky top-24">
                            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-stone-600 mb-6 pb-6 border-b border-stone-100">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-stone-800">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-stone-800">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-semibold text-stone-800">Total</span>
                                <span className="font-bold text-2xl text-stone-900">{formatPrice(cartTotal)}</span>
                            </div>

                            {!checkoutMode ? (
                                user ? (
                                    <button
                                        onClick={() => setCheckoutMode(true)}
                                        className="w-full btn-primary py-4 text-lg"
                                    >
                                        Proceed to Checkout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-4 rounded-xl text-lg transition-all"
                                    >
                                        Log in to Checkout
                                    </button>
                                )
                            ) : (
                                <form onSubmit={handleCheckout} className="mt-6 flex flex-col gap-4 animate-fade-in">
                                    <h3 className="font-serif font-bold text-xl text-stone-800 border-b pb-2">Shipping Information</h3>
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={shipping.address}
                                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            required
                                            className="w-1/2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            value={shipping.city}
                                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postal Code"
                                            required
                                            className="w-1/2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            value={shipping.postalCode}
                                            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={shipping.country}
                                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                                    />

                                    <h3 className="font-serif font-bold text-xl text-stone-800 border-b pb-2 mt-2">Payment Method</h3>
                                    <div className="flex flex-col gap-3">
                                        {['Card', 'UPI', 'Cash on Delivery'].map((method) => (
                                            <label key={method} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method ? 'border-amber-500 bg-amber-50/50 text-amber-900' : 'border-stone-200 hover:border-amber-300/50'}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={paymentMethod === method}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="hidden"
                                                />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === method ? 'border-amber-500' : 'border-stone-300'}`}>
                                                    {paymentMethod === method && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                                                </div>
                                                <span className="font-medium text-sm">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setCheckoutMode(false)}
                                            className="w-1/3 py-3 rounded-xl border border-stone-300 text-stone-600 font-bold hover:bg-stone-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-2/3 btn-primary py-3 flex justify-center items-center"
                                        >
                                            {submitting ? (
                                                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                            ) : (
                                                'Confirm Order'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
