// filepath: d:\BlogBreeze\src\pages\AllPosts.jsx
import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                // Map database fields to match PostCard props
                const mappedPosts = posts.documents.map((post) => ({
                    $id: post.$id,
                    title: post.Title, // Map 'Title' to 'title'
                    content: post.Content, // Map 'Content' to 'content'
                    featuredImage: post.FeaturedImage, // Map 'FeaturedImage' to 'featuredImage'
                }));
                setPosts(mappedPosts);
            }
        });
    }, []);

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;