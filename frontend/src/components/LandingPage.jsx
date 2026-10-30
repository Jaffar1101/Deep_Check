import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
    Shield, CheckCircle, AlertTriangle, ArrowRight, Play, FileVideo,
    Search, Plus, Minus, HelpCircle, Mail, Menu, X, ExternalLink,
    Lock, CheckCircle2, Phone, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'help' | 'contact' | 'privacy' | 'terms' | 'demo' | null
    const targetTimeRef = useRef(0);
    const rafIdRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 25,
        restDelta: 0.005
    });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setIsVideoLoaded(true);
            video.pause();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        if (video.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    // Sync video time with scroll smoothly without blocking the decoder
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVideoLoaded) return;

        const unsubscribe = smoothProgress.on("change", (latest) => {
            if (video.duration) {
                const targetTime = Math.max(0, Math.min(latest * (video.duration - 0.1), video.duration));
                targetTimeRef.current = targetTime;
            }
        });

        const updateVideoFrame = () => {
            if (video && video.duration) {
                const target = targetTimeRef.current;
                const diff = Math.abs(video.currentTime - target);

                if (diff > 0.04 && !video.seeking) {
                    if ('fastSeek' in video) {
                        video.fastSeek(target);
                    } else {
                        video.currentTime = target;
                    }
                }
            }
            rafIdRef.current = requestAnimationFrame(updateVideoFrame);
        };

        rafIdRef.current = requestAnimationFrame(updateVideoFrame);

        return () => {
            unsubscribe();
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [isVideoLoaded, smoothProgress]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    };

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="relative bg-background min-h-[400vh]">
            {/* Fixed Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/10 transform-gpu">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="DeepCheck Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            DeepCheck
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <button onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Home</button>
                        <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Features</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
                        <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ's</button>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-primary/25 cursor-pointer flex items-center gap-2">
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                        ) : (
                            <Link to="/signin">
                                <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-black/50 cursor-pointer">
                                    Sign In
                                </button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col space-y-3 pb-2"
                        >
                            <button
                                onClick={scrollToTop}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                FAQ's
                            </button>
                            {isAuthenticated && (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                                >
                                    Go to Dashboard →
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Sticky Container for Hero Content & Video */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transform-gpu">
                {/* Background Gradients */}
                <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none transform-gpu" />
                <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none transform-gpu" />

                {/* Video Background / Element */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 transform-gpu">
                    <video
                        ref={videoRef}
                        src={`${import.meta.env.BASE_URL}Model.mp4`}
                        className="w-full h-full object-cover md:object-contain max-w-fit-content mx-auto transform-gpu"
                        muted
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        disableRemotePlayback
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
                </div>

                {/* Hero Content Overlay */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
                            <span className="block text-white">Truth in the Age of</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                                Artificial Intelligence
                            </span>
                        </h1>

                        <p className="text-sm sm:text-lg md:text-xl text-gray-400 sm:text-gray-500 font-medium max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                            Detect deepfakes and verify claims with advanced AI.<br className="hidden sm:inline" />
                            Combat misinformation in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
                            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base cursor-pointer">
                                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button
                                onClick={() => setActiveModal('demo')}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/50 text-sm sm:text-base cursor-pointer"
                            >
                                <Play className="w-4 h-4" />
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Content */}
            <div className="relative z-20 mt-[100vh] bg-background">

                {/* Features Grid */}
                <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Advanced Detection Features</h2>
                        <p className="text-gray-400 text-sm sm:text-base">Comprehensive tools to verify authenticity in the digital age.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <FeatureCard
                            icon={<FileVideo className="w-8 h-8 text-secondary" />}
                            title="Deepfake Detection"
                            description="Analyze videos and images frame-by-frame to detect AI manipulation and artifacts."
                            linkTo={isAuthenticated ? "/dashboard/deepfake" : "/signin"}
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8 text-primary" />}
                            title="Source Verification"
                            description="Cross-reference text claims against trusted global sources in real-time."
                            linkTo={isAuthenticated ? "/dashboard/news" : "/signin"}
                        />
                        <FeatureCard
                            icon={<AlertTriangle className="w-8 h-8 text-accent" />}
                            title="Crisis Monitoring"
                            description="Track emerging misinformation trends during global events and crises."
                            linkTo={isAuthenticated ? "/dashboard/content" : "/signin"}
                        />
                    </div>
                </div>

                {/* About Section */}
                <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">About DeepCheck</h2>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                                In an era of digital misinformation, DeepCheck stands as a beacon of truth.
                                Our mission is to empower individuals and organizations with state-of-the-art AI tools
                                to verify media authenticity and combat the spread of deepfakes.
                            </p>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                Founded by a team of AI researchers and security experts, we leverage advanced
                                computer vision and natural language processing to detect manipulation that the human eye might miss.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
                            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Trusted Technology</div>
                                        <div className="text-sm text-gray-400">Industry Standard Protection</div>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm sm:text-base">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>99.9% Detection Accuracy</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Real-time Multi-modal Analysis</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Global Source Verification</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 border-t border-white/5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="How accurate is the deepfake detection?"
                            answer="Our multi-modal analysis system achieves over 99% accuracy by examining visual artifacts, audio inconsistencies, facial landmarks, and metadata anomalies."
                        />
                        <FaqItem
                            question="Can I use DeepCheck for free?"
                            answer="Yes! We offer a free tier for researchers and individuals that includes image, video, and text verification."
                        />
                        <FaqItem
                            question="What formats do you support?"
                            answer="We support all major image (JPG, PNG, WEBP) and video (MP4, MOV, AVI) formats, as well as direct social media links and article URLs."
                        />
                        <FaqItem
                            question="Is my data private?"
                            answer="Absolutely. All uploaded media is processed securely with zero permanent retention and automatically purged after verification."
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center border-t border-white/5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">Ready to verify the truth?</h2>
                    <p className="text-gray-400 text-sm sm:text-base mb-8">Join thousands of researchers and journalists using DeepCheck.</p>
                    <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                        <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all text-sm sm:text-base cursor-pointer shadow-lg">
                            {isAuthenticated ? 'Open Dashboard' : 'Get Started for Free'}
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/10 py-12 bg-black/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="col-span-1 sm:col-span-2">
                                <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 mb-4 group">
                                    <Shield className="w-6 h-6 text-primary" />
                                    <span className="font-bold text-lg text-white">DeepCheck</span>
                                </Link>
                                <p className="text-gray-400 text-sm max-w-sm">
                                    Empowering the world with truth through advanced AI verification technology.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Platform</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><button onClick={scrollToTop} className="hover:text-primary transition-colors cursor-pointer">Home</button></li>
                                    <li><button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors cursor-pointer">Features</button></li>
                                    <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors cursor-pointer">About</button></li>
                                    <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary transition-colors cursor-pointer">FAQ's</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Support & Info</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>
                                        <button
                                            onClick={() => setActiveModal('help')}
                                            className="hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Help Center
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveModal('contact')}
                                            className="hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Contact Us
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveModal('privacy')}
                                            className="hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Privacy Policy
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveModal('terms')}
                                            className="hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Terms of Service
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                            <div className="text-gray-500 text-sm">
                                © 2025 DeepCheck AI. All rights reserved.
                            </div>
                            <div className="flex gap-6 text-gray-500 text-sm">
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://github.com/Jaffar1101/Deep_Check"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors flex items-center gap-1"
                                >
                                    GitHub
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Support / Info Modals */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[85vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {activeModal === 'help' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <HelpCircle className="w-6 h-6" />
                                        <h3 className="text-xl font-bold text-white">Help Center</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Welcome to DeepCheck Support. Here are quick tips for getting the best verification results:
                                    </p>
                                    <div className="space-y-2 text-xs text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="font-semibold text-white">1. Video Deepfakes:</div>
                                        <p>Upload files up to 500MB in MP4 or AVI. Clear facial visibility yields highest accuracy.</p>
                                        <div className="font-semibold text-white mt-2">2. News & Article Verification:</div>
                                        <p>Paste the full claim or original URL to query cross-referenced global intelligence sources.</p>
                                        <div className="font-semibold text-white mt-2">3. Social Media Content:</div>
                                        <p>Paste links from Twitter/X, Instagram, TikTok, or Facebook into the Content Checker.</p>
                                    </div>
                                    <div className="pt-2 text-xs text-gray-400 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <span>Need dedicated assistance? Email: support@deepcheck.ai</span>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'contact' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Mail className="w-6 h-6" />
                                        <h3 className="text-xl font-bold text-white">Contact Us</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Have a question, feedback, or enterprise inquiry? Reach out to our research and engineering team.
                                    </p>
                                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5 text-sm">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>General Inquiries: contact@deepcheck.ai</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Shield className="w-4 h-4 text-secondary" />
                                            <span>Security & Privacy: security@deepcheck.ai</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <ExternalLink className="w-4 h-4 text-accent" />
                                            <span>GitHub: github.com/Jaffar1101/Deep_Check</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                            {activeModal === 'privacy' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Lock className="w-6 h-6" />
                                        <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        At DeepCheck, user privacy and media confidentiality are our top priorities:
                                    </p>
                                    <div className="space-y-2.5 text-xs text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p><strong className="text-white">• Zero Permanent Retention:</strong> Uploaded video/image files are processed in secure memory buffers and automatically deleted post-analysis.</p>
                                        <p><strong className="text-white">• No Data Monetization:</strong> We never sell, license, or share user uploaded media with third parties or external ad networks.</p>
                                        <p><strong className="text-white">• End-to-End Encryption:</strong> All API communication takes place over HTTPS with strict TLS transport encryption.</p>
                                    </div>
                                    <p className="text-gray-500 text-xs">Last updated: October 2026. DeepCheck AI Team.</p>
                                </div>
                            )}

                            {activeModal === 'terms' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <FileText className="w-6 h-6" />
                                        <h3 className="text-xl font-bold text-white">Terms of Service</h3>
                                    </div>
                                    <div className="space-y-2.5 text-xs text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p><strong className="text-white">1. Permitted Use:</strong> DeepCheck is designed for journalists, researchers, and public truth verification. Malicious probing or reverse engineering is prohibited.</p>
                                        <p><strong className="text-white">2. AI Confidence Disclaimers:</strong> While our forensic models maintain 99%+ empirical accuracy, outputs are probability scores and forensic signals to assist human fact-checking.</p>
                                        <p><strong className="text-white">3. Fair Rate Limits:</strong> Free accounts are subject to fair use request caps to ensure reliability for all researchers.</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                                    >
                                        Understood
                                    </button>
                                </div>
                            )}

                            {activeModal === 'demo' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Play className="w-6 h-6" />
                                        <h3 className="text-xl font-bold text-white">DeepCheck Interactive Demo</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        DeepCheck delivers real-time multimodal forensic verification. Try these features inside your dashboard:
                                    </p>
                                    <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-gray-300">
                                        <div className="flex items-center gap-2 text-white font-semibold">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            <span>Deepfake Video/Image Verifier</span>
                                        </div>
                                        <p className="pl-6 text-gray-400">Examines facial blending boundary anomalies, specular vectors, and EXIF signatures.</p>

                                        <div className="flex items-center gap-2 text-white font-semibold mt-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            <span>Global Claim & News Cross-Referencing</span>
                                        </div>
                                        <p className="pl-6 text-gray-400">Verifies factual claims against Reuters, AP, and accredited fact-checking feeds in seconds.</p>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setActiveModal(null)}
                                            className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                                        >
                                            Dismiss
                                        </button>
                                        <Link
                                            to={isAuthenticated ? "/dashboard" : "/signin"}
                                            onClick={() => setActiveModal(null)}
                                            className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>Launch Dashboard</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, linkTo }) => (
    <Link to={linkTo} className="block group">
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
                <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-primary/20 transition-colors">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
            </div>
            <div className="mt-4 text-xs font-semibold text-primary/80 group-hover:text-primary flex items-center gap-1">
                Try Tool →
            </div>
        </div>
    </Link>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
            >
                <span className="font-medium text-white">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0 }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-4 text-gray-400 leading-relaxed text-sm">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
