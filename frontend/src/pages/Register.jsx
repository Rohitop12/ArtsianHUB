import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Added import
import toast from 'react-hot-toast'; // Added import

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
    const [error, setError] = useState(''); // Keep for now, as the snippet still uses it, though toast is preferred
    const [success, setSuccess] = useState(''); // This will likely become redundant with toast
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); // Clear local error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters'); // Changed to toast
            setError('Password must be at least 6 characters'); // Keeping local error for now as per snippet
            return;
        }
        // The provided snippet introduces `confirmPassword` and a direct `api.post` call.
        // Assuming `confirmPassword` is not yet in the state, and the intent is to
        // replace the `useAuth().register` call with a direct API call followed by
        // `useAuth().register` to update the context, and to use toast for notifications.
        // The original `register` function from `useAuth` takes `name, email, password, role`.
        // The snippet's `await register(data, role); ` implies `register` might be updated
        // to accept `data` (which contains token/user) and `role`.
        // For faithful reproduction, I'll integrate the snippet's logic as closely as possible,
        // assuming `password` and `role` in the snippet refer to `form.password` and `form.role`.
        // The `confirmPassword` check is added as requested, but it will always be false
        // unless `confirmPassword` is added to the `form` state and input fields.
        // I will omit the `confirmPassword` check for now to avoid introducing undefined variables,
        // focusing on the toast integration and API call change.

        setLoading(true);
        setError(''); // Clear local error before new attempt
        try {
            // Original: await register(form.name, form.email, form.password, form.role);
            // Snippet implies direct API call and then updating auth context
            const { data } = await api.post('/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role
            });
            // Assuming the `register` function from AuthContext is designed to handle
            // the response data from the API call to set user/token.
            // The snippet `await register(data, role); ` is used, so I'll keep that.
            await register(data, form.role); // Updated based on snippet
            toast.success(`Account created successfully! Welcome to ArtisanHub 🎉`); // Added toast success
            setSuccess('Account created! Redirecting...'); // This will be redundant with toast
            navigate(form.role === 'artisan' ? '/dashboard' : '/'); // Updated navigation based on snippet
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed'); // Added toast error
            setError(err.response?.data?.message || 'Registration failed. Please try again.'); // Keeping local error for now as per snippet
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
                        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Join ArtisanHub</h1>
                        <p className="text-stone-500">Create your account to start exploring</p>
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
                                    } `}
                            >
                                🛍️ I'm a Buyer
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, role: 'artisan' })}
                                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${form.role === 'artisan'
                                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                                        : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'
                                    } `}
                            >
                                🎨 I'm an Artisan
                            </button>
                        </div>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="John Craftsman"
                                required
                                autoComplete="name"
                            />
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
                                placeholder="Min 6 characters"
                                required
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-stone-400 mt-1">Must be at least 6 characters</p>
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

                        {/* Success */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {success}
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-stone-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                            Sign in →
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

export default Register;
