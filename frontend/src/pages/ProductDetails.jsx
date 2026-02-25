import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setActiveImage(data.image); // Reset to first image on product load
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !product) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
            <h2 className="font-serif text-3xl font-bold text-stone-800 mb-4">Product Not Found</h2>
            <Link to="/products" className="btn-primary">Back to Shop</Link>
        </div>
    );

    // Combine main image and gallery for the carousel
    const allImages = product ? [product.image, ...(product.gallery || [])].filter(Boolean) : [];

    const handleAddToCart = () => {
        if (user && user.role === 'artisan') {
            toast.error('Artisans cannot purchase items. Please log in as a Buyer.');
            return;
        }

        if (product) {
            addToCart(product);
            toast.success(`${product.title} added to cart! 🛒`);
        }
    };

    const handleBuyNow = () => {
        if (user && user.role === 'artisan') {
            toast.error('Artisans cannot purchase items. Please log in as a Buyer.');
            return;
        }

        if (product) {
            addToCart(product);
            navigate('/cart');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="text-sm text-stone-500 mb-8 whitespace-nowrap overflow-x-auto pb-2">
                    <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/products" className="hover:text-amber-600 transition-colors">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-800 font-semibold">{product.title}</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 md:p-10 flex flex-col md:flex-row gap-10">

                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 select-none">
                            <img
                                src={activeImage}
                                alt={product.title}
                                className="w-full h-full object-cover animate-fade-in"
                            />
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 select-none">
                                {allImages.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === imgUrl ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit mb-4">
                            {product.category}
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
                            {product.title}
                        </h1>

                        <p className="text-lg text-stone-500 mb-6 italic">
                            By {product.artisan?.name || 'Local Artisan'}
                        </p>

                        <div className="text-3xl font-bold text-amber-600 mb-8">
                            {formatPrice(product.price)}
                        </div>

                        <div className="prose prose-stone mb-10 text-stone-600 text-lg leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full sm:w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-800 py-4 px-10 text-xl font-bold rounded-2xl transition-all flex justify-center items-center gap-3 border-2 border-stone-200"
                            >
                                <span>🛒</span> Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="w-full sm:w-1/2 btn-primary py-4 px-10 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center"
                            >
                                Buy Now 🚀
                            </button>
                        </div>

                        {/* Highlights Row */}
                        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-stone-100 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-stone-50 rounded-full text-xl text-stone-600">🧵</div>
                                <span className="text-sm font-semibold text-stone-700">100% Handcrafted</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-stone-50 rounded-full text-xl text-stone-600">🛡️</div>
                                <span className="text-sm font-semibold text-stone-700">Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-stone-50 rounded-full text-xl text-stone-600">🚚</div>
                                <span className="text-sm font-semibold text-stone-700">Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-stone-50 rounded-full text-xl text-stone-600">🤝</div>
                                <span className="text-sm font-semibold text-stone-700">Directly supports artisan</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
