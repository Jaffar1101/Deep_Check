import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, ChevronDown, Settings, LogOut, User,
    FileVideo, Newspaper, FileText, Link as LinkIcon, Youtube, History,
    Menu, X, Search, Check, Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    const { user, logout, updateUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Profile editing state
    const [editName, setEditName] = useState(user?.name || '');
    const [savedNotification, setSavedNotification] = useState(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const navLinks = [
        { name: 'Deepfake Verifier', path: '/dashboard/deepfake', icon: <FileVideo className="w-4 h-4" /> },
        { name: 'News Verifier', path: '/dashboard/news', icon: <Newspaper className="w-4 h-4" /> },
        { name: 'Content Checker', path: '/dashboard/content', icon: <Search className="w-4 h-4" /> },
    ];

    const toolsLinks = [
        { name: 'Text Verifier', path: '/dashboard/tools/text', icon: <FileText className="w-4 h-4" /> },
        { name: 'Article Verifier', path: '/dashboard/tools/article', icon: <Newspaper className="w-4 h-4" /> },
        { name: 'URL Verifier', path: '/dashboard/tools/url', icon: <LinkIcon className="w-4 h-4" /> },
        { name: 'YouTube Checker', path: '/dashboard/tools/youtube', icon: <Youtube className="w-4 h-4" /> },
        { name: 'History', path: '/dashboard/history', icon: <History className="w-4 h-4" /> },
    ];

    const handleSignOut = () => {
        setIsSettingsOpen(false);
        setIsMobileMenuOpen(false);
        setIsProfileModalOpen(false);
        logout();
        navigate('/signin', { replace: true });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (editName.trim()) {
            updateUser({ name: editName.trim() });
            setSavedNotification(true);
            setTimeout(() => setSavedNotification(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-col">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo - Navigates to dashboard root */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="DeepCheck Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            DeepCheck
                        </span>
                    </Link>

                    {/* Main Navigation (Desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive(link.path)
                                    ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {/* Tools Dropdown */}
                        <div className="relative group">
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${location.pathname.includes('/tools') || location.pathname.includes('/history')
                                    ? 'bg-white/10 text-white border border-white/5'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                            >
                                <Shield className="w-4 h-4" />
                                Tools
                                <ChevronDown className={`w-3 h-3 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isToolsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                                        onMouseLeave={() => setIsToolsOpen(false)}
                                    >
                                        <div className="p-2 space-y-1">
                                            {toolsLinks.map((tool) => (
                                                <Link
                                                    key={tool.path}
                                                    to={tool.path}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    onClick={() => setIsToolsOpen(false)}
                                                >
                                                    <div className="p-1.5 rounded-md bg-white/5 text-primary">
                                                        {tool.icon}
                                                    </div>
                                                    {tool.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            to="/"
                            className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                        >
                            Landing Page
                        </Link>

                        <button
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative cursor-pointer"
                            onClick={() => setIsSettingsOpen(true)}
                            title="Open Settings"
                            aria-label="Open Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* User Avatar - toggles settings */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] cursor-pointer hover:opacity-90 transition-opacity"
                            title={`Signed in as ${user?.name || 'User'}`}
                            aria-label="User account"
                        >
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                            </div>
                        </button>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
                            aria-label="Toggle Dashboard Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col space-y-2 pb-3"
                        >
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                                Verifiers
                            </div>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${isActive(link.path)
                                        ? 'bg-white/10 text-white font-semibold'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="p-1 rounded-md bg-white/5 text-primary">
                                        {link.icon}
                                    </div>
                                    {link.name}
                                </Link>
                            ))}

                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pt-2 py-1">
                                Extra Tools
                            </div>
                            {toolsLinks.map((tool) => (
                                <Link
                                    key={tool.path}
                                    to={tool.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${isActive(tool.path)
                                        ? 'bg-white/10 text-white font-semibold'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="p-1 rounded-md bg-white/5 text-primary">
                                        {tool.icon}
                                    </div>
                                    {tool.name}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-white/10 px-3">
                                <Link
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-1"
                                >
                                    ← Back to Landing Page
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 relative">
                <Outlet />
            </main>

            {/* Settings Sidebar (Right) */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setIsSettingsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-[#111] border-l border-white/10 z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Settings</h2>
                                <button
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                                    aria-label="Close Settings"
                                >
                                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                            </div>

                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
                                    <button
                                        onClick={() => setIsProfileModalOpen(true)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer border border-white/5"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] shrink-0">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-white">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate">{user?.name || 'Verified User'}</div>
                                            <div className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                                            <div className="text-[10px] text-primary mt-0.5">{user?.role || 'Verified Researcher'}</div>
                                        </div>
                                        <Edit2 className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Preferences</h3>
                                    <div
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-gray-300 text-sm font-medium">Dark Mode</span>
                                        <div className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setNotifications(!notifications)}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-gray-300 text-sm font-medium">Alert Notifications</span>
                                        <div className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <Link
                                        to="/"
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="block w-full py-2.5 px-4 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        View Public Landing Page
                                    </Link>
                                    <a
                                        href="https://github.com/Jaffar1101/Deep_Check"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-2.5 px-4 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        GitHub Repository
                                    </a>
                                </div>
                            </div>

                            {/* Sign Out Button - securely clears session and replaces history */}
                            <div className="p-6 border-t border-white/10">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Profile Edit Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                            onClick={() => setIsProfileModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                                    <h3 className="text-lg font-bold text-white">Account Profile</h3>
                                    <button
                                        onClick={() => setIsProfileModalOpen(false)}
                                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {savedNotification && (
                                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400">
                                        <Check className="w-4 h-4" />
                                        Profile updated successfully!
                                    </div>
                                )}

                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-semibold">Display Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-semibold">Email</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full mt-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-gray-400">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="text-gray-500">Role</div>
                                            <div className="text-white font-medium mt-0.5">{user?.role || 'Researcher'}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="text-gray-500">Member Since</div>
                                            <div className="text-white font-medium mt-0.5">{user?.joinedAt || '2025'}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsProfileModalOpen(false)}
                                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold cursor-pointer"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors text-sm font-semibold cursor-pointer shadow-md"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
