import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', role: 'buyer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Assuming 'login' function in AuthContext now accepts the form object and role,
            // and returns user data upon successful login.
            // The instruction's `await login(data, role);` implies `data` and `role` are defined
            // before this call, or that the `login` function itself returns `data`.
            // Given the original code, `form` is the data and `form.role` is the role.
            // Let's assume the `login` function is updated to return user data.
            const userData = await login(form.email, form.password, form.role); // Keep original call signature for login, but expect it to return user data
            toast.success(`Welcome back, ${userData.name.split(' ')[0]}! ✨`); // Use userData from login result
            navigate(form.role === 'artisan' ? '/dashboard' : '/'); // Use form.role for navigation
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <span className="text-stone-900 font-serif font-bold text-xl">A</span>
                        </div>
                        <span className="font-serif font-bold text-2xl text-white">
                            Artisan<span className="text-amber-400">Hub</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Welcome Back</h1>
                        <p className="text-stone-500">Sign in to continue your artisan journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, role: 'buyer' })}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${form.role === 'buyer'
                                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                                    : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'
                                    }`}
                            >
                                🛍️ Login as Buyer
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, role: 'artisan' })}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${form.role === 'artisan'
                                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                                    : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'
                                    }`}
                            >
                                🎨 Login as Artisan
                            </button>
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-stone-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-center flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-stone-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                            Create one →
                        </Link>
                    </p>
                </div>

                <p className="text-center text-stone-500 text-sm mt-4">
                    <Link to="/" className="hover:text-amber-400 transition-colors">← Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
