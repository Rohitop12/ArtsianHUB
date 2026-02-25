import React from 'react';

const CATEGORIES = ['All', 'Pottery', 'Jewelry', 'Textiles', 'Woodwork', 'Glasswork', 'Leather'];

const SortBar = ({ onSortChange, onCategoryChange, currentSort, currentCategory }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            {/* Sort by Price */}
            <div className="flex items-center gap-2 flex-1">
                <label className="text-stone-600 text-sm font-semibold whitespace-nowrap">Sort by Price:</label>
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="input-field py-2 cursor-pointer text-sm flex-1"
                    id="sort-select"
                >
                    <option value="">Default</option>
                    <option value="price_asc">Low → High</option>
                    <option value="price_desc">High → Low</option>
                </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-1">
                <label className="text-stone-600 text-sm font-semibold whitespace-nowrap">Category:</label>
                <select
                    value={currentCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="input-field py-2 cursor-pointer text-sm flex-1"
                    id="category-select"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat === 'All' ? '' : cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset button */}
            {(currentSort || currentCategory) && (
                <button
                    onClick={() => {
                        onSortChange('');
                        onCategoryChange('');
                    }}
                    className="text-sm text-amber-600 hover:text-amber-800 font-medium whitespace-nowrap transition-colors duration-200 flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                </button>
            )}
        </div>
    );
};

export default SortBar;
