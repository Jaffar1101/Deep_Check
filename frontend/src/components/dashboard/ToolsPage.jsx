import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Link as LinkIcon, Youtube, Search, ArrowRight, Loader2, CheckCircle, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const ToolsPage = () => {
    const { toolType } = useParams();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const tools = {
        text: {
            title: 'Text Verifier',
            description: 'Analyze text for AI generation patterns and factual accuracy.',
            icon: <FileText className="w-6 h-6 text-primary" />,
            placeholder: 'Paste the text you want to verify here...',
            inputType: 'textarea'
        },
        article: {
            title: 'Article Verifier',
            description: 'Verify the credibility and bias of news articles.',
            icon: <Search className="w-6 h-6 text-secondary" />,
            placeholder: 'Paste article URL...',
            inputType: 'url'
        },
        url: {
            title: 'URL Verifier',
            description: 'Check if a website is a known source of misinformation.',
            icon: <LinkIcon className="w-6 h-6 text-accent" />,
            placeholder: 'https://example.com',
            inputType: 'url'
        },
        youtube: {
            title: 'YouTube Checker',
            description: 'Analyze YouTube videos for deepfakes and misleading content.',
            icon: <Youtube className="w-6 h-6 text-red-500" />,
            placeholder: 'https://youtube.com/watch?v=...',
            inputType: 'url'
        }
    };

    const currentTool = tools[toolType] || tools.text;

    const handleVerify = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            let textToVerify = input;
            if (toolType === 'article') textToVerify = `Verify this article: ${input}`;
            else if (toolType === 'url') textToVerify = `Verify this website: ${input}`;
            else if (toolType === 'youtube') textToVerify = `Verify this YouTube video: ${input}`;

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
                let status = 'Uncertain';
                if (v === 'true' || v === 'authentic' || v === 'verified') status = 'Verified';
                else if (v === 'false' || v === 'fake' || v === 'debunked' || v === 'misleading') status = 'False / Misleading';

                setResult({
                    status,
                    rawVerdict: data.verdict,
                    score: data.credibility_score ? Math.round(data.credibility_score * 100) : 85,
                    confidence: data.confidence ? Math.round(data.confidence * 100) : null,
                    summary: data.explanation?.summary || 'Analysis complete.',
                    detailed: data.explanation?.detailed,
                    sources: data.explanation?.citations || []
                });
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error(error);
            setResult({
                status: 'Error',
                summary: 'Failed to verify. Please try again.',
                sources: []
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                    {currentTool.icon}
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{currentTool.title}</h1>
                    <p className="text-gray-400 text-sm sm:text-base">{currentTool.description}</p>
                </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
                <div className="relative">
                    {currentTool.inputType === 'textarea' ? (
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={currentTool.placeholder}
                            className="w-full h-40 sm:h-48 bg-black/20 border border-white/10 rounded-xl p-3 sm:p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none text-sm sm:text-base"
                        />
                    ) : (
                        <div className="relative">
                            <input
                                type="url"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={currentTool.placeholder}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 sm:py-4 pl-4 pr-4 sm:pr-32 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm sm:text-base"
                            />
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleVerify}
                            disabled={loading || !input.trim()}
                            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            <div className={`p-4 rounded-full shrink-0 ${result.status === 'Verified' ? 'bg-green-500/20 text-green-500' :
                                    result.status.includes('False') ? 'bg-red-500/20 text-red-500' :
                                        'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {result.status === 'Verified' ? <CheckCircle className="w-8 h-8" /> :
                                    result.status.includes('False') ? <AlertTriangle className="w-8 h-8" /> :
                                        <HelpCircle className="w-8 h-8" />}
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        Verdict: <span className={
                                            result.status === 'Verified' ? 'text-green-500' :
                                                result.status.includes('False') ? 'text-red-500' :
                                                    'text-yellow-500'
                                        }>{result.status}</span>
                                    </h3>
                                    {result.confidence && (
                                        <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium w-fit mx-auto sm:mx-0">
                                            {result.confidence}% Confidence
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">{result.summary}</p>

                                {result.detailed && (
                                    <p className="text-gray-400 text-xs sm:text-sm mb-4 p-3 bg-black/20 rounded-xl border border-white/5 text-left">
                                        {result.detailed}
                                    </p>
                                )}

                                {result.sources && result.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/10 text-left">
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h4>
                                        <div className="space-y-1">
                                            {result.sources.map((src, i) => (
                                                <a key={i} href={typeof src === 'string' ? src : src.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" />
                                                    {typeof src === 'string' ? src : src.domain || src.url}
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
        </div>
    );
};

export default ToolsPage;
