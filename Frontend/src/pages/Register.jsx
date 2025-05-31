import React, {useEffect, useState} from 'react';
import { Zap } from 'lucide-react';
import open from '../picture/open.png';
import close from '../picture/close.png';
import { register as apiRegister } from '../services/api';

import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const { username, password, confirmPassword } = form;
        if (!username || !password || !confirmPassword) {
            setErrorMsg('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        try {
            const res = await apiRegister(username, password);
            if (res.success) {
                alert('Account created – please log in.');
                navigate('/login');
            } else {
                setErrorMsg(res.msg || 'Registration failed. Try again.');
            }
        } catch (err) {
            setErrorMsg('Registration failed. Try again.');
        }
    };

    useEffect(() => {
        document.title = "Procrastivity - Register";
    }, [])

    return (
        <div className="relative mt-20 flex flex-col items-center justify-center">
            <div className="flex items-center flex-col justify-center mb-5 lg:mb-10">
                <Zap className="h-20 w-20 lg:h-30 lg:w-30 text-primary transition-transform hover:rotate-[-15deg]" />
                <h1 className="mt-5 text-4xl font-bold">Procrastivity</h1>
            </div>

            <div className="z-10 w-full mx-8 max-w-md p-10 bg-white rounded-lg lg:shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="font-bodoni text-[20px] mb-[12px] tracking-[0.5px]">
                        Create Account
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block mb-2">
                            USERNAME
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded focus:border-black"
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block mb-2">
                            PASSWORD
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 pr-12 border rounded focus:border-black"
                            placeholder="••••••••"
                            required
                        />
                        <img
                            src={showPassword ? close : open}
                            alt="Toggle password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute top-[40px] mt-1.5 right-3 w-5 h-5 cursor-pointer"
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="confirmPassword" className="block mb-2">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 pr-12 border rounded focus:border-black"
                            placeholder="••••••••"
                            required
                        />
                        <img
                            src={showConfirmPassword ? close : open}
                            alt="Toggle confirm password"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute top-[40px] mt-1.5 right-3 w-5 h-5 cursor-pointer"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-center text-red-500 mb-4">{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full p-3 bg-black text-white rounded uppercase tracking-wider"
                    >
                        Sign Up
                    </button>

                    <div className="flex flex-row justify-center items-center mt-6 space-x-2">
                        <p className="text-black">Already have an account?</p>
                        <NavLink
                            to="/login"
                            className="text-blue-600 underline font-cormorant italic hover:underline"
                        >
                            Sign in
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
