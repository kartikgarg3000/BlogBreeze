import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.UserId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                console.log("Fetched Post:", post); // Debugging
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.FeaturedImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                {/* Display Featured Image */}
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {post.FeaturedImage ? (
                        <img
                            src={appwriteService.getFilePreview(post.FeaturedImage)}
                            alt={post.Title}
                            className="rounded-xl"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-300 rounded-xl flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}

                    {/* Edit/Delete Buttons for Author */}
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Display Title */}
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.Title}</h1>
                </div>

                {/* Display Content */}
                <div className="browser-css">
                    {post.Content ? parse(post.Content) : <p>No content available</p>}
                </div>
            </Container>
        </div>
    ) : null;
}