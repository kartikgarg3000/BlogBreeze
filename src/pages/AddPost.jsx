import React from 'react'
import { Container, PostForm } from '../components'

function AddPost() {
    return (
        <div className="py-8 md:py-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Container>
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Create New Post
                        </h1>
                        <PostForm />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default AddPost