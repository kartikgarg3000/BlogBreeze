import React from 'react';
import PropTypes from 'prop-types';

function Search({ onSearch, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                placeholder="Search posts..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
            <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
}

Search.propTypes = {
    onSearch: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default Search;