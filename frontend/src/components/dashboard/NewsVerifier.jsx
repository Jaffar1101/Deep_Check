import React, { useState, useEffect } from 'react';
import { Search, Link as LinkIcon, FileText, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink, Loader2, ShieldAlert, HelpCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const NewsVerifier = () => {
    const [activeTab, setActiveTab] = useState('text'); // 'text' or 'url'
    const [inputText, setInputText] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [trendingNews, setTrendingNews] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);

    // Fetch trending news on mount
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/trending`);
                if (response.ok) {
                    const data = await response.json();
                    const claimsList = data.claims || (Array.isArray(data) ? data : []);
                    if (claimsList && claimsList.length > 0) {
                        setTrendingNews(claimsList);
                    } else {
                        setTrendingNews(getFallbackTrending());
                    }
                } else {
                    setTrendingNews(getFallbackTrending());
                }
            } catch (error) {
                console.error('Failed to fetch trending news:', error);
                setTrendingNews(getFallbackTrending());
            } finally {
                setTrendingLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const getFallbackTrending = () => [
        {
            claim_text: "AI-generated images of politicians causing market crash",
            verification_status: "false",
            explanation: "No evidence supports this claim. Market movements were unrelated to deepfakes.",
            source_title: "Reuters Fact Check"
        },
        {
            claim_text: "New deepfake detection tool achieves 99% accuracy",
            verification_status: "unverified",
            explanation: "Multiple startups claim this, but independent verification is pending.",
            source_title: "TechCrunch"
        },
        {
            claim_text: "Viral video of celebrity endorsing crypto scam is deepfake",
            verification_status: "true",
            explanation: "Visual artifacts and voice analysis confirm manipulation.",
            source_title: "DeepCheck Analysis"
        }
    ];

    const handleVerify = async () => {
        if ((activeTab === 'text' && !inputText) || (activeTab === 'url' && !inputUrl)) return;

        setLoading(true);
        setVerificationResult(null);

        try {
            const textToVerify = activeTab === 'text'
                ? inputText
                : `Verify this article URL: ${inputUrl}`;

            const payload = {
                text: textToVerify,
                audience_level: 'general'
            };

            const response = await fetch(`${API_BASE_URL}/api/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                const v = (data.verdict || '').toLowerCase();
                let rating = 'Unverified';
                if (v === 'true' || v === 'authentic' || v === 'verified') rating = 'True';
                else if (v === 'false' || v === 'fake' || v === 'debunked') rating = 'False';
                else if (v === 'misleading') rating = 'Misleading';

                setVerificationResult({
                    rating,
                    verdict: data.verdict || rating,
                    confidence: data.confidence ? Math.round(data.confidence * 100) : null,
                    credibility_score: data.credibility_score ? Math.round(data.credibility_score * 100) : null,
                    summary: data.explanation?.summary || 'Verification completed.',
                    detailed: data.explanation?.detailed || data.explanation?.summary,
                    what_to_do: data.explanation?.what_to_do || [],
                    what_to_avoid: data.explanation?.what_to_avoid || [],
                    sources: data.explanation?.citations || []
                });
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error(error);
            setVerificationResult({
                rating: 'Error',
                summary: 'Failed to verify content. Please try again later.',
                sources: []
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">

            {/* Header & Input Section */}
            <div className="text-center space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">News Verifier</h1>
                    <p className="text-gray-400 text-lg">Verify articles, claims, and URLs against trusted global sources.</p>
                </div>

                <div className="max-w-3xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-2">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 p-1 bg-black/20 rounded-xl">
                        <button
                            onClick={() => setActiveTab('text')}
                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" /> Verify Text
                        </button>
                        <button
                            onClick={() => setActiveTab('url')}
                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'url' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" /> Verify URL
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="relative">
                        {activeTab === 'text' ? (
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste the news text or claim here..."
                                className="w-full h-40 bg-transparent text-white p-4 rounded-xl resize-none focus:outline-none placeholder:text-gray-600"
                            />
                        ) : (
                            <div className="flex items-center px-4 h-40">
                                <input
                                    type="url"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="https://example.com/news-article"
                                    className="w-full bg-transparent text-white text-lg focus:outline-none placeholder:text-gray-600"
                                />
                            </div>
                        )}

                        {/* Verify Button */}
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={handleVerify}
                                disabled={loading || (activeTab === 'text' ? !inputText.trim() : !inputUrl.trim())}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                {loading ? 'Verifying...' : 'Verify Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Result */}
            <AnimatePresence>
                {verificationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8"
                    >
                        <div className="flex items-start gap-6">
                            <div className={`p-4 rounded-full ${verificationResult.rating === 'True' ? 'bg-green-500/20 text-green-500' :
                                    verificationResult.rating === 'False' ? 'bg-red-500/20 text-red-500' :
                                        verificationResult.rating === 'Misleading' ? 'bg-yellow-500/20 text-yellow-500' :
                                            'bg-gray-500/20 text-gray-400'
                                }`}>
                                {verificationResult.rating === 'True' ? <CheckCircle className="w-8 h-8" /> :
                                    verificationResult.rating === 'False' ? <AlertTriangle className="w-8 h-8" /> :
                                        <HelpCircle className="w-8 h-8" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-2xl font-bold text-white">
                                        Verdict: <span className={
                                            verificationResult.rating === 'True' ? 'text-green-500' :
                                                verificationResult.rating === 'False' ? 'text-red-500' :
                                                    verificationResult.rating === 'Misleading' ? 'text-yellow-500' :
                                                        'text-gray-400'
                                        }>{verificationResult.rating}</span>
                                    </h3>
                                    {verificationResult.confidence && (
                                        <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-white">
                                            {verificationResult.confidence}% Confidence
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-300 leading-relaxed mb-6">{verificationResult.summary}</p>

                                {verificationResult.detailed && verificationResult.detailed !== verificationResult.summary && (
                                    <div className="mb-6 p-4 bg-black/20 rounded-xl border border-white/5">
                                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Analysis</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{verificationResult.detailed}</p>
                                    </div>
                                )}

                                {verificationResult.what_to_do && verificationResult.what_to_do.length > 0 && (
                                    <div className="mb-6 grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                                            <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2 mb-2">
                                                <Check className="w-4 h-4" /> What to Do
                                            </h4>
                                            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                                                {verificationResult.what_to_do.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {verificationResult.what_to_avoid && verificationResult.what_to_avoid.length > 0 && (
                                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                                <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-2">
                                                    <X className="w-4 h-4" /> What to Avoid
                                                </h4>
                                                <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                                                    {verificationResult.what_to_avoid.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {verificationResult.sources && verificationResult.sources.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sources & Citations</h4>
                                        <div className="space-y-2">
                                            {verificationResult.sources.map((source, idx) => (
                                                <a key={idx} href={typeof source === 'string' ? source : source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm">
                                                    <ExternalLink className="w-4 h-4" />
                                                    {typeof source === 'string' ? source : source.domain || source.url}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trending News Section */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-secondary" />
                        Trending Verification Requests
                    </h2>
                </div>

                {trendingLoading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {trendingNews.length > 0 ? (
                            trendingNews.map((news, index) => (
                                <NewsCard key={index} news={news} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No trending news available at the moment.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const NewsCard = ({ news }) => {
    const status = (news.verification_status || news.rating || 'unverified').toLowerCase();
    const isFalse = status === 'false' || status === 'debunked' || status === 'fake';
    const isTrue = status === 'true' || status === 'authentic' || status === 'verified';

    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isFalse ? 'bg-red-500/10 text-red-500' :
                            isTrue ? 'bg-green-500/10 text-green-500' :
                                'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {isFalse ? 'False' : isTrue ? 'Verified' : 'Unverified'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Recent
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.claim_text || news.text}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {news.explanation || news.summary || 'No explanation available.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">Source: {news.source_title || news.source || 'Global Feeds'}</span>
                </div>
            </div>
        </div>
    );
};

export default NewsVerifier;
