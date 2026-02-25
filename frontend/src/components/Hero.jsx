import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Hero = () => {
    const navigate = useNavigate();

    const handleSearch = (keyword) => {
        if (keyword) {
            navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
        } else {
            navigate('/products');
        }
    };
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 opacity-90" />

            {/* Decorative blobs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full opacity-10 blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-400 rounded-full opacity-5 blur-3xl -translate-x-1/2 -translate-y-1/2" />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium py-2 px-5 rounded-full mb-8 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span>Handcrafted with ❤️ by Artisans Worldwide</span>
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                    Discover
                    <span className="block text-amber-400 drop-shadow-lg">
                        Handcrafted
                    </span>
                    <span className="block text-stone-200">Treasures</span>
                </h1>

                {/* Subheadline */}
                <p className="text-stone-300 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
                    A curated marketplace where skilled artisans bring their finest
                    handmade creations — from pottery to jewelry, textiles to woodwork.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-10">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/products"
                        className="btn-primary text-base sm:text-lg px-8 py-4 w-full sm:w-auto shadow-amber-500/30 shadow-lg"
                    >
                        Explore Products
                    </Link>
                    <Link
                        to="/register"
                        className="btn-secondary text-base sm:text-lg px-8 py-4 w-full sm:w-auto border-amber-500 text-amber-400 hover:bg-amber-500/10"
                    >
                        Join as Artisan
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    {[
                        { value: '500+', label: 'Artisans' },
                        { value: '2,000+', label: 'Products' },
                        { value: '10k+', label: 'Happy Customers' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{stat.value}</div>
                            <div className="text-stone-400 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="mt-16 animate-bounce">
                    <svg className="w-6 h-6 text-amber-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
