import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SortBar from '../components/SortBar';
import SearchBar from '../components/SearchBar';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlKeyword = params.get('keyword');
        if (urlKeyword !== null && urlKeyword !== keyword) {
            setKeyword(urlKeyword);
        }
    }, [location.search]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (sort) params.append('sort', sort);
            if (category) params.append('category', category);
            if (keyword) params.append('keyword', keyword);

            const { data } = await api.get(`/products?${params.toString()}`);
            setProducts(data);
        } catch (err) {
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [sort, category, keyword]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Page Header */}
            <div className="bg-stone-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
                        Our <span className="text-amber-400">Collection</span>
                    </h1>
                    <p className="text-stone-300 text-lg max-w-xl mx-auto">
                        Browse our full range of handcrafted goods, lovingly made by skilled artisans.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Search Bar */}
                <div className="mb-6">
                    <SearchBar onSearch={setKeyword} />
                </div>

                {/* Sort Bar */}
                <div className="mb-8 relative z-10">
                    <SortBar
                        currentSort={sort}
                        currentCategory={category}
                        onSortChange={setSort}
                        onCategoryChange={setCategory}
                    />
                </div>

                {/* Results count */}
                {!loading && !error && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-stone-500 text-sm">
                            Showing <span className="text-amber-600 font-semibold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                            {keyword && <span> matching "<span className="text-amber-600 font-semibold">{keyword}</span>"</span>}
                            {category && <span> in <span className="text-amber-600 font-semibold">{category}</span></span>}
                        </p>
                        {sort === 'price_asc' && <span className="badge bg-amber-100 text-amber-700">↑ Price: Low to High</span>}
                        {sort === 'price_desc' && <span className="badge bg-amber-100 text-amber-700">↓ Price: High to Low</span>}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
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
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <button onClick={fetchProducts} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Products grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-stone-700 mb-2">No products found</h3>
                        <p className="text-stone-400 mb-6">Try adjusting your search criteria or modifying your filters.</p>
                        <button onClick={() => { setSort(''); setCategory(''); setKeyword(''); }} className="btn-secondary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
