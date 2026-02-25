import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from './ProductCard';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const { data } = await api.get('/products/new-arrivals');
                setProducts(data);
            } catch (err) {
                setError('Failed to load new arrivals');
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    return (
        <section id="new-arrivals" className="py-20 bg-gradient-to-b from-stone-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center space-x-2 text-amber-600 text-sm font-semibold uppercase tracking-widest mb-3">
                        <span className="w-8 h-px bg-amber-400" />
                        <span>Fresh from the Studio</span>
                        <span className="w-8 h-px bg-amber-400" />
                    </div>
                    <h2 className="section-title">New Arrivals</h2>
                    <p className="text-stone-500 mt-3 max-w-xl mx-auto">
                        The latest handcrafted pieces added to our marketplace — freshly made, freshly listed.
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-56 bg-stone-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                                    <div className="h-3 bg-stone-100 rounded w-full" />
                                    <div className="h-3 bg-stone-100 rounded w-5/6" />
                                    <div className="h-8 bg-stone-200 rounded-lg w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">⚠️</div>
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">No products yet</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* View All CTA */}
                {!loading && !error && products.length > 0 && (
                    <div className="text-center mt-12">
                        <Link to="/products" className="btn-primary inline-block">
                            View All Products →
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewArrivals;
