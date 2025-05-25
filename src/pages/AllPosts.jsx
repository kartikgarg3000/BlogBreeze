import React, { useState, useEffect } from 'react';
import { Container, PostCard, Search } from '../components';
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortBy, setSortBy] = useState('latest');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await appwriteService.getPosts([]);
                if (postsData) {
                    // Map posts to ensure correct property names
                    const mappedPosts = postsData.documents.map(post => ({
                        $id: post.$id,
                        title: post.title,
                        content: post.content,
                        image: post.image,
                        $createdAt: post.$createdAt,
                        status: post.status,
                        userId: post.userId
                    }));
                    setPosts(mappedPosts);
                    setFilteredPosts(getSortedPosts(mappedPosts));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPosts(getSortedPosts(posts));
            return;
        }
        
        const filtered = posts.filter((post) => 
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(getSortedPosts(filtered));
    };

    const getSortedPosts = (postsToSort) => {
        switch(sortBy) {
            case 'oldest':
                return [...postsToSort].sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));
            case 'title':
                return [...postsToSort].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            default: // 'latest'
                return [...postsToSort].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white">
            <Container>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
                            All Posts
                        </h1>
                        <p className="text-gray-600 mb-8 animate-fade-in [animation-delay:200ms]">
                            Explore all articles from our talented writers
                        </p>
                        
                        <div className="space-y-6 animate-fade-in [animation-delay:400ms]">
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white shadow-lg rounded-2xl p-2">
                                    <Search 
                                        onSearch={handleSearch}
                                        className="transform hover:scale-101 transition-all duration-300" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-4">
                                {['latest', 'oldest', 'title'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option);
                                            setFilteredPosts(getSortedPosts(filteredPosts));
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                            ${sortBy === option 
                                                ? 'bg-primary-600 text-white shadow-md' 
                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'}`}
                                    >
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                            <p className="text-gray-600">Loading posts...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm animate-fade-in [animation-delay:600ms]">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                            </svg>
                            <h2 className="text-2xl text-gray-900 mb-2">No posts found</h2>
                            <p className="text-gray-500">Try adjusting your search or explore different topics</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <div 
                                    key={post.$id}
                                    className="animate-fade-in transform hover:-translate-y-1 transition-all duration-300"
                                    style={{ animationDelay: `${(index * 100) + 800}ms` }}
                                >
                                    <PostCard 
                                        $id={post.$id}
                                        title={post.title}
                                        content={post.content}
                                        image={post.image}
                                        $createdAt={post.$createdAt}
                                        className="h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;