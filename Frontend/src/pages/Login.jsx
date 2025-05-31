import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap } from 'lucide-react';
import open from '../picture/open.png';
import close from '../picture/close.png';

const userSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

const Login = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data) => {
        setLoginError('');
        setIsLoading(true);

        try {
            // Add your login logic here
        } catch (err) {
            setLoginError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mt-20 flex flex-col items-center justify-center">
            <div className="flex items-center flex-col justify-center mb-5 lg:mb-10">
                <Zap className="h-20 w-20 lg:h-30 lg:w-30 text-primary transition-transform hover:rotate-[-15deg]" />
                <h1 className="mt-5 text-4xl font-bold">Procrastivity</h1>
            </div>

            <div className="relative z-10 bg-white rounded-lg lg:shadow-xl px-10 py-12 w-full max-w-md mx-10">
                <div className="text-center mb-8">
                    <h2 className="font-bodoni text-2xl mb-2">Welcome Back</h2>
                    <p className="text-gray-600 italic font-cormorant">Sign in to continue to Steal His Look</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            {...register('username')}
                            placeholder="Username"
                            className="w-full px-4 py-3 border rounded shadow-inner focus:outline-none focus:border-black"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full px-4 py-3 pr-12 border rounded shadow-inner focus:outline-none focus:border-black"
                        />
                        <img
                            src={showPassword ? close : open}
                            alt="Toggle visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            {...register('rememberMe')}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>

                    {loginError && (
                        <p className="text-sm text-red-500 text-center">{loginError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-black text-white rounded uppercase tracking-wider hover:bg-gray-900 transition disabled:bg-gray-400"
                    >
                        {isLoading ? 'Signing In...' : 'Login'}
                    </button>

                    <div className="flex flex-row justify-center items-center mt-6 space-x-2">
                        <p className="text-black">Already have an account?</p>
                        <NavLink
                            to="/Register"
                            className="text-blue-600 underline font-cormorant italic hover:underline"
                        >
                            Sign up
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
