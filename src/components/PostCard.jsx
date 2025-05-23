import React, { useState } from 'react';
import PropTypes from 'prop-types';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';

function PostCard({ $id, title, content, image, $createdAt, className = '' }) {
    const [imageError, setImageError] = useState(false);

    // Function to strip HTML tags and get plain text
    const getPlainText = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full animate-fade-in ${className}`}>
            <Link to={`/post/${$id}`} className="block h-full">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    {image && !imageError ? (
                        <img
                            src={appwriteService.getFilePreview(image)}
                            alt={title || 'Post image'}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg 
                                className="w-16 h-16 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                    <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500">
                            {formatDate($createdAt)}
                        </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {title || 'Untitled Post'}
                    </h2>
                    
                    {content && (
                        <p className="text-gray-600 line-clamp-3 text-sm mb-3">
                            {getPlainText(content)}
                        </p>
                    )}

                    <div className="flex items-center justify-end mt-4">
                        <span className="text-primary-600 text-sm font-medium hover:text-primary-800">
                            Read More →
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

PostCard.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    image: PropTypes.string,
    $createdAt: PropTypes.string.isRequired,
    className: PropTypes.string
};

PostCard.defaultProps = {
    title: 'Untitled Post',
    content: '',
    image: '',
    className: ''
};

export default PostCard;