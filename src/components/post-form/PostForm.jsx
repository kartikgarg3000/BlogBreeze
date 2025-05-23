import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

export default function PostForm({ post }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setLoading(true);
        setError("");
        try {
            if (!data.image?.[0] && !post) {
                throw new Error("Featured image is required");
            }

            let postData = {
                title: data.title,
                content: data.content,
                status: data.status
            };

            // Handle file upload first
            if (data.image?.[0]) {
                try {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) {
                        if (post?.image) {
                            await appwriteService.deleteFile(post.image);
                        }
                        postData.image = file.$id;
                    }
                } catch (error) {
                    console.error("File upload error:", error);
                    throw new Error("Failed to upload image. Please try again.");
                }
            }

            if (post) {
                // Update existing post
                const dbPost = await appwriteService.updatePost(post.$id, postData);
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Create new post
                postData.userId = userData.$id;
                const dbPost = await appwriteService.createPost(postData);
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Title"
                            placeholder="Enter post title"
                            className="w-full"
                            {...register("title", { 
                                required: "Title is required",
                                minLength: {
                                    value: 3,
                                    message: "Title must be at least 3 characters"
                                }
                            })}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>
                    
                    <div className="relative">
                        <Controller
                            name="content"
                            control={control}
                            rules={{ 
                                required: "Content is required",
                                validate: (value) => {
                                    if (!value || value.trim() === '') {
                                        return "Content cannot be empty";
                                    }
                                    if (value === '<p></p>' || value === '<p><br></p>') {
                                        return "Please add some content";
                                    }
                                    return true;
                                }
                            }}
                            defaultValue={getValues("content")}
                            render={({ field, fieldState: { error } }) => (
                                <div>
                                    <RTE 
                                        label="Content"
                                        control={field}
                                        defaultValue={field.value}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Featured Image"
                            type="file"
                            className="w-full"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post && "Featured image is required" })}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                        )}

                        {post && post.image && (
                            <div className="relative group overflow-hidden rounded-lg">
                                <img
                                    src={appwriteService.getFilePreview(post.image)}
                                    alt={post.title}
                                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}

                        <Select
                            options={["active", "inactive"]}
                            label="Status"
                            className="w-full"
                            {...register("status", { required: "Status is required" })}
                        />
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t">
                        <Button
                            type="button"
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 
                                     hover:bg-gray-50 rounded-xl font-medium transition-all duration-300"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-2.5 rounded-xl font-medium transition-all duration-300
                                ${loading ? 'opacity-80 cursor-not-allowed' : ''}
                                bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                                text-white shadow-sm hover:shadow-md`}
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {post ? "Updating..." : "Creating..."}
                                </span>
                            ) : (
                                post ? "Update Post" : "Create Post"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

PostForm.propTypes = {
    post: PropTypes.shape({
        $id: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        image: PropTypes.string,
        status: PropTypes.oneOf(['active', 'inactive']),
        userId: PropTypes.string
    })
};

PostForm.defaultProps = {
    post: null
};