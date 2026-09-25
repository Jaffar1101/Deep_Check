import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Play, FileVideo, Search, Plus, Minus, HelpCircle, Mail, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const targetTimeRef = useRef(0);
    const rafIdRef = useRef(null);
    const navigate = useNavigate();

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
            // Ensure video is paused so we can control it manually
            video.pause();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        // If video is already loaded (cached)
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
                // Map scroll progress (0-1) to video duration
                const targetTime = Math.max(0, Math.min(latest * (video.duration - 0.1), video.duration));
                targetTimeRef.current = targetTime;
            }
        });

        // Use requestAnimationFrame loop to safely seek without flooding the decoder
        const updateVideoFrame = () => {
            if (video && video.duration) {
                const target = targetTimeRef.current;
                const diff = Math.abs(video.currentTime - target);

                // Only seek if timestamp difference is noticeable and decoder is ready
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
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <button onClick={scrollToTop} className="hover:text-white transition-colors">Home</button>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ's</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/signin">
                            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-black/50">
                                Sign In
                            </button>
                        </Link>
                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
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
                                onClick={() => { scrollToTop(); setIsMobileMenuOpen(false); }}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Home
                            </button>
                            <a
                                href="#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                FAQ's
                            </a>
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
                    {/* Overlay gradient to blend video edges */}
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
                            <Link to="/signin" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-full font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base">
                                    Get Started for Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/50 text-sm sm:text-base">
                                <Play className="w-4 h-4" />
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Content (to allow scrolling) */}
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
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8 text-primary" />}
                            title="Source Verification"
                            description="Cross-reference text claims against trusted global sources in real-time."
                        />
                        <FeatureCard
                            icon={<AlertTriangle className="w-8 h-8 text-accent" />}
                            title="Crisis Monitoring"
                            description="Track emerging misinformation trends during global events and crises."
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
                                        <span>Real-time Analysis</span>
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
                            answer="Our multi-modal analysis system achieves over 99% accuracy by examining visual artifacts, audio inconsistencies, and metadata anomalies."
                        />
                        <FaqItem
                            question="Can I use DeepCheck for free?"
                            answer="Yes! We offer a free tier for individual users that includes basic image and text verification. Premium features are available for enterprise needs."
                        />
                        <FaqItem
                            question="What formats do you support?"
                            answer="We support all major image (JPG, PNG, WEBP) and video (MP4, MOV, AVI) formats, as well as direct URL analysis."
                        />
                        <FaqItem
                            question="Is my data private?"
                            answer="Absolutely. All uploaded media is processed securely and automatically deleted from our servers after analysis is complete."
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center border-t border-white/5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">Ready to verify the truth?</h2>
                    <p className="text-gray-400 text-sm sm:text-base mb-8">Join thousands of researchers and journalists using DeepCheck.</p>
                    <Link to="/signin">
                        <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all text-sm sm:text-base">
                            Get Started for Free
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
                                    <li><button onClick={scrollToTop} className="hover:text-primary transition-colors">Home</button></li>
                                    <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                                    <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                                    <li><a href="#faq" className="hover:text-primary transition-colors">FAQ's</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><button className="hover:text-primary transition-colors">Help Center</button></li>
                                    <li><button className="hover:text-primary transition-colors">Contact Us</button></li>
                                    <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
                                    <li><button className="hover:text-primary transition-colors">Terms of Service</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                            <div className="text-gray-500 text-sm">
                                © 2025 DeepCheck AI. All rights reserved.
                            </div>
                            <div className="flex gap-6 text-gray-500 text-sm">
                                <button className="hover:text-white transition-colors">Twitter</button>
                                <button className="hover:text-white transition-colors">LinkedIn</button>
                                <button className="hover:text-white transition-colors">GitHub</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
        <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-primary/20 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-medium text-white">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0 }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-4 text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
