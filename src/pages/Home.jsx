import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard, Search } from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('latest')
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
                setFilteredPosts(posts.documents)
            }
            setLoading(false)
        })
    }, [])

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPosts(getSortedPosts(posts))
            return
        }
        
        const filtered = posts.filter((post) => 
            post.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.Content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredPosts(getSortedPosts(filtered))
    }

    const getSortedPosts = (postsToSort) => {
        switch(sortBy) {
            case 'oldest':
                return [...postsToSort].sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt))
            case 'title':
                return [...postsToSort].sort((a, b) => a.Title.localeCompare(b.Title))
            default: // 'latest'
                return [...postsToSort].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
        }
    }

    const renderHeroSection = (message, buttonText) => (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <Container>
                <div className="text-center text-white relative z-10">
                    <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                        Welcome to BlogBreeze
                    </h1>
                    <p className="text-xl mb-8 animate-fade-in [animation-delay:200ms]">
                        {message}
                    </p>
                    <Link 
                        to={authStatus ? "/add-post" : "/login"}
                        className="inline-flex items-center px-8 py-3 rounded-full font-semibold
                                bg-white text-primary-600 hover:bg-primary-50 
                                transform hover:scale-105 transition-all duration-300
                                animate-fade-in [animation-delay:400ms]"
                    >
                        {buttonText}
                        {authStatus && (
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </Link>
                </div>
            </Container>
        </div>
    )

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
                    <Container>
                        <div className="space-y-8">
                            <div className="h-12 w-2/3 mx-auto bg-white/20 rounded animate-pulse"></div>
                            <div className="h-6 w-1/3 mx-auto bg-white/20 rounded animate-pulse"></div>
                            <div className="h-10 w-40 mx-auto bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                    </Container>
                </div>
                <Container>
                    <div className="py-16">
                        <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 shadow-md">
                                    <div className="h-48 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
                                    <div className="space-y-3">
                                        <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
            {renderHeroSection(
                "Share your thoughts with the world",
                authStatus ? "Create Post" : "Login to Start"
            )}

            <Container>
                <div className="py-16">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
                            Discover Amazing Stories
                        </h2>
                        <p className="text-gray-600 mb-8 animate-fade-in [animation-delay:200ms]">
                            Explore our collection of thoughtful articles and insights shared by our community
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
                            
                            <div className="flex justify-center gap-4">
                                {['latest', 'oldest', 'title'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option)
                                            setFilteredPosts(getSortedPosts(filteredPosts))
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

                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm animate-fade-in [animation-delay:600ms]">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                            </svg>
                            <h2 className="text-2xl text-gray-900 mb-2">No posts found</h2>
                            <p className="text-gray-500">Try adjusting your search or explore different topics</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8 animate-fade-in [animation-delay:600ms]">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {sortBy === 'latest' ? 'Latest Posts' : 
                                     sortBy === 'oldest' ? 'Oldest Posts' : 
                                     'Posts by Title'}
                                </h3>
                                <span className="text-primary-600 font-medium">{filteredPosts.length} posts</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post, index) => (
                                    <div 
                                        key={post.$id}
                                        className="animate-fade-in transform hover:-translate-y-1 transition-all duration-300"
                                        style={{ animationDelay: `${(index * 100) + 800}ms` }}
                                    >
                                        <PostCard {...post} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </Container>

            <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/30 via-transparent to-primary-50/30 pointer-events-none" aria-hidden="true"></div>
        </div>
    )
}

export default Home