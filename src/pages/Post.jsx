import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630' fill='none'%3E%3Crect width='1200' height='630' fill='%23F3F4F6'/%3E%3Cpath d='M600 315C600 365 560 405 510 405C460 405 420 365 420 315C420 265 460 225 510 225C560 225 600 265 600 315Z' fill='%23E5E7EB'/%3E%3Cpath d='M676 405C676 433.719 652.719 457 624 457H396C367.281 457 344 433.719 344 405V225C344 196.281 367.281 173 396 173H624C652.719 173 676 196.281 676 225V405Z' stroke='%23D1D5DB' stroke-width='12'/%3E%3C/svg%3E`;

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Estimate reading time
    const calculateReadingTime = (content) => {
        if (!content) return '1 min read';
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    useEffect(() => {
        async function fetchPost() {
            if (!slug) {
                setError("No post ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const fetchedPost = await appwriteService.getPost(slug);
                
                if (fetchedPost) {
                    setPost(fetchedPost);
                    if (fetchedPost.image) {
                        const img = new Image();
                        img.src = appwriteService.getFilePreview(fetchedPost.image);
                        img.onerror = () => setImageError(true);
                    }
                } else {
                    setError("Post not found");
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        try {
            setDeleteLoading(true);
            setError(null);
            await appwriteService.deletePost(post.$id);
            
            if (post.image) {
                try {
                    await appwriteService.deleteFile(post.image);
                } catch (imageError) {
                    console.warn('Failed to delete image:', imageError);
                }
            }
            
            navigate("/");
        } catch (err) {
            console.error('Delete error:', err);
            setError("Failed to delete post. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Container>
                    <div className="animate-pulse space-y-8 py-16">
                        <div className="h-96 bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !post) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            {error || "Post not found"}
                        </h2>
                        <Button 
                            onClick={() => navigate("/")}
                            className="hover:bg-gray-100 transition-colors"
                        >
                            Go Back Home
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <article className="min-h-screen bg-gray-50 py-16">
            <Container>
                <div className="max-w-4xl mx-auto">
                    {post.image && !imageError && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={appwriteService.getFilePreview(post.image)}
                                alt={post.title}
                                className="w-full h-[500px] object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    setImageError(true);
                                }}
                            />
                        </div>
                    )}

                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {post.title || "Untitled Post"}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <time dateTime={post.$createdAt}>
                                {formatDate(post.$createdAt)}
                            </time>
                            <span>•</span>
                            <span>{calculateReadingTime(post.content)}</span>
                        </div>
                    </header>

                    {userData && post.userId === userData.$id && (
                        <div className="flex gap-4 mb-8">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-600" className="hover:bg-green-700">
                                    Edit Post
                                </Button>
                            </Link>
                            <Button 
                                bgColor="bg-red-600" 
                                className="hover:bg-red-700"
                                onClick={handleDeletePost}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete Post"}
                            </Button>
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600">
                        {post.content ? (
                            parse(post.content)
                        ) : (
                            <p className="text-gray-500">No content available</p>
                        )}
                    </div>
                </div>
            </Container>
        </article>
    );
}