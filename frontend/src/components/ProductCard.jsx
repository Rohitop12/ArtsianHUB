import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const categoryColors = {
    Pottery: 'bg-orange-100 text-orange-700',
    Jewelry: 'bg-yellow-100 text-yellow-700',
    Textiles: 'bg-purple-100 text-purple-700',
    Woodwork: 'bg-green-100 text-green-700',
    Glasswork: 'bg-blue-100 text-blue-700',
    Leather: 'bg-red-100 text-red-700',
};

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [added, setAdded] = useState(false);

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (user && user.role === 'artisan') {
            toast.error('Artisans cannot purchase items. Please login as a Buyer.');
            return;
        }

        addToCart(product);
        navigate('/cart');
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (user && user.role === 'artisan') {
            toast.error('Artisans cannot purchase items. Please login as a Buyer.');
            return;
        }

        addToCart(product);
        toast.success(`${product.title} added to cart! 🛒`);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const badgeClass = categoryColors[product.category] || 'bg-stone-100 text-stone-600';

    return (
        <div className="card group cursor-pointer animate-fade-in relative flex flex-col h-full">
            <Link to={`/product/${product._id}`} className="block flex-grow">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-stone-100">
                    {!imgError ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50">
                            <div className="text-center">
                                <span className="text-5xl">🎨</span>
                                <p className="text-stone-400 text-sm mt-2">Handcrafted Item</p>
                            </div>
                        </div>
                    )}

                    {/* Category badge over image */}
                    <div className="absolute top-3 left-3">
                        <span className={`badge ${badgeClass} font-semibold shadow-sm`}>
                            {product.category}
                        </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-serif font-semibold text-stone-800 text-lg leading-tight group-hover:text-amber-700 transition-colors duration-200">
                        {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1 mb-2">
                        <p className="text-stone-400 text-xs font-medium">
                            By: {product.artisan?.name || 'Local Artisan'}
                        </p>
                        {product.createdAt && (
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-bold">
                                {formatTimeAgo(product.createdAt)}
                            </span>
                        )}
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                    </p>
                </div>
            </Link>

            {/* Price + Add to Cart */}
            <div className="p-5 pt-0 mt-auto flex items-center justify-between">
                <div>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className={`text-sm font-semibold py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${added
                            ? 'bg-green-500 text-white shadow-green-200 shadow-md'
                            : 'bg-stone-200 hover:bg-stone-300 text-stone-700 shadow-sm'
                            } `}
                        title="Add to Cart"
                    >
                        {added ? '✓' : '🛒'}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-amber-600 hover:bg-amber-500 text-white shadow-amber-200 shadow-md"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
