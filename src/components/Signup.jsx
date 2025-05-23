import { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input } from './index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const create = async (data) => {
        setError("");
        setLoading(true);
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) dispatch(login(currentUser));
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center w-full'>
            <div className="w-full max-w-lg backdrop-blur-sm bg-white/80 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-200">
                <div className="mb-8 text-center">
                    <Link 
                        to="/" 
                        className="inline-block transform hover:scale-105 transition-all duration-300"
                    >
                        <span className="text-3xl font-bold">
                            <span className="text-primary-600">Blog</span>
                            <span className="text-gray-900">Breeze</span>
                        </span>
                    </Link>
                </div>

                <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
                    Create your account
                </h2>
                <p className="text-center text-base text-gray-600 mb-8">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-red-600 text-center text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(create)} className="space-y-6">
                    <div className="space-y-5">
                        <div>
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                })}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Email address"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 text-base font-medium rounded-xl transition-all duration-300
                                ${loading 
                                    ? 'bg-primary-400 cursor-not-allowed' 
                                    : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
                                } text-white shadow-sm hover:shadow-md`}
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;