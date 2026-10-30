import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, CheckCircle2, Sun, Moon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SignInPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    // Check if the route is /signup or if user toggled
    const isSignUpRoute = location.pathname.includes('/signup');
    const [isSignUp, setIsSignUp] = useState(isSignUpRoute);

    useEffect(() => {
        setIsSignUp(location.pathname.includes('/signup'));
    }, [location.pathname]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Target route to redirect to upon login (default /dashboard)
    const fromPath = location.state?.from || '/dashboard';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        if (isSignUp && !name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            login(email, password, isSignUp ? name : undefined);
            setLoading(false);
            navigate(fromPath, { replace: true });
        }, 300);
    };

    const handleGoogleAuth = () => {
        setLoading(true);
        setTimeout(() => {
            loginWithGoogle();
            setLoading(false);
            navigate(fromPath, { replace: true });
        }, 300);
    };

    return (
        <div className="min-h-screen bg-background text-slate-900 dark:text-white flex items-center justify-center relative overflow-hidden p-4 sm:p-6 transition-colors duration-200">
            {/* Top Bar with Home & Theme Toggle */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-center z-20">
                <Link
                    to="/"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                >
                    ← Back to Home
                </Link>
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    aria-label="Toggle Theme"
                >
                    {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
                </button>
            </div>

            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="DeepCheck Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 group-hover:to-white transition-all">
                            DeepCheck
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-surface/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                    {/* Header Tabs */}
                    <div className="flex bg-black/5 dark:bg-black/30 p-1 rounded-xl mb-6 border border-slate-200 dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(false);
                                setError('');
                                navigate('/signin', { replace: true });
                            }}
                            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                !isSignUp ? 'bg-primary text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(true);
                                setError('');
                                navigate('/signup', { replace: true });
                            }}
                            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                isSignUp ? 'bg-primary text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
                        {isSignUp ? 'Create an Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base mb-6">
                        {isSignUp
                            ? 'Join thousands of fact-checkers & researchers'
                            : 'Sign in to continue your verification'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-red-600 dark:text-red-300">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="space-y-1.5">
                                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        required
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer text-sm sm:text-base"
                        >
                            {loading ? 'Authenticating...' : isSignUp ? 'Create Free Account' : 'Sign In'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="relative my-6 sm:my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="px-3 bg-surface text-gray-500 rounded-full border border-slate-200 dark:border-white/5">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full py-3 bg-white hover:bg-slate-50 dark:bg-white dark:hover:bg-gray-100 disabled:opacity-50 text-slate-900 rounded-xl font-bold transition-all flex items-center justify-center gap-3 cursor-pointer text-sm sm:text-base shadow-md border border-slate-200 dark:border-transparent"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                const nextState = !isSignUp;
                                setIsSignUp(nextState);
                                setError('');
                                navigate(nextState ? '/signup' : '/signin', { replace: true });
                            }}
                            className="text-primary hover:text-primary/80 font-semibold transition-colors underline ml-1 cursor-pointer"
                        >
                            {isSignUp ? 'Sign in here' : 'Sign up for free'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignInPage;
