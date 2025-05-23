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
                console.log('Fetched post:', fetchedPost);
                
                if (fetchedPost) {
                    setPost(fetchedPost);
                    if (fetchedPost.image) {
                        // Preload image
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
            
            // Delete post first
            await appwriteService.deletePost(post.$id);
            
            // If successful, try to delete the image
            if (post.image) {
                try {
                    await appwriteService.deleteFile(post.image);
                } catch (imageError) {
                    console.warn('Failed to delete image:', imageError);
                    // Continue even if image deletion fails
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

    const renderImage = () => {
        if (!post.image || imageError) {
            return (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                    <img 
                        src={placeholderImage}
                        alt="No image available"
                        className="w-full h-full object-contain opacity-50"
                    />
                </div>
            );
        }

        return (
            <div className="relative w-full">
                <img
                    src={appwriteService.getFilePreview(post.image)}
                    alt={post.title || "Post image"}
                    className="rounded-xl max-h-[600px] w-full object-contain"
                    onError={(e) => {
                        console.error('Image load error for:', post.image);
                        e.target.onerror = null;
                        setImageError(true);
                    }}
                />
            </div>
        );
    };

    if (loading) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </Container>
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

    const isAuthor = userData && post.userId === userData.$id;

    return (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {renderImage()}
                </div>

                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {post.title || "Untitled Post"}
                    </h1>
                    
                    {isAuthor && (
                        <div className="flex gap-3 mt-4">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button 
                                    bgColor="bg-green-500"
                                    className="hover:bg-green-600 transition-colors"
                                >
                                    Edit
                                </Button>
                            </Link>
                            <Button 
                                bgColor="bg-red-500"
                                className="hover:bg-red-600 transition-colors"
                                onClick={handleDeletePost}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="prose prose-lg max-w-none">
                    {post.content ? (
                        parse(post.content)
                    ) : (
                        <p className="text-gray-500">No content available</p>
                    )}
                </div>
            </Container>
        </div>
    );
}