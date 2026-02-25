import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto animate-fade-in-up">
            <input
                type="text"
                placeholder="Search for pottery, handmade jewelry, woodwork..."
                className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm text-lg font-medium text-stone-700 bg-white placeholder:font-normal placeholder:text-stone-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                type="submit"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 transition-colors p-1"
                aria-label="Search"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {searchTerm && (
                <button
                    type="button"
                    onClick={() => {
                        setSearchTerm('');
                        onSearch('');
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Clear Search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </form>
    );
};

export default SearchBar;
