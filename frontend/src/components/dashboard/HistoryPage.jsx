import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, FileText, Video, Link as LinkIcon, Search, ArrowRight, Loader2 } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch claims and deepfake results in parallel
                const [claimsRes, deepfakeRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/claims`),
                    fetch(`${API_BASE_URL}/api/deepfake/results`)
                ]);

                let combinedHistory = [];

                // Process Claims
                if (claimsRes.ok) {
                    const claims = await claimsRes.json();
                    const formattedClaims = claims.map(claim => ({
                        id: `claim-${claim.id}`,
                        type: claim.source_url ? 'URL/News' : 'Text',
                        name: claim.text,
                        date: new Date(claim.detected_at),
                        result: claim.verification_status === 'true' ? 'Authentic' :
                            claim.verification_status === 'false' ? 'Fake/Misleading' : 'Uncertain',
                        confidence: Math.round(claim.credibility_score * 100) + '%',
                        icon: claim.source_url ? <LinkIcon className="w-5 h-5 text-orange-400" /> : <FileText className="w-5 h-5 text-purple-400" />,
                        rawDate: claim.detected_at
                    }));
                    combinedHistory = [...combinedHistory, ...formattedClaims];
                }

                // Process Deepfakes
                if (deepfakeRes.ok) {
                    const data = await deepfakeRes.json();
                    const deepfakes = data.results || [];
                    const formattedDeepfakes = deepfakes.map(item => ({
                        id: `media-${item.media_id}`,
                        type: item.file_type === 'video' ? 'Video Deepfake' : 'Image Deepfake',
                        name: item.filename,
                        date: new Date(item.uploaded_at),
                        result: item.is_deepfake ? 'Deepfake Detected' : 'Authentic',
                        confidence: Math.round(item.confidence) + '%',
                        icon: <Video className="w-5 h-5 text-blue-400" />,
                        rawDate: item.uploaded_at
                    }));
                    combinedHistory = [...combinedHistory, ...formattedDeepfakes];
                }

                // Sort by date (newest first)
                combinedHistory.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

                setHistory(combinedHistory);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateObj) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - dateObj) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const handleClearHistory = async () => {
        if (!confirm('Are you sure you want to clear all verification history? This cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/history`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setHistory([]);
                // Force reload to ensure clean state
                window.location.reload();
            } else {
                console.error('Failed to clear history');
                alert('Failed to clear history. Please try again.');
            }
        } catch (error) {
            console.error('Error clearing history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Verification History</h1>
                    <p className="text-gray-400 text-sm sm:text-base">View and manage your past verification results.</p>
                </div>
                <button
                    onClick={handleClearHistory}
                    className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-500/30"
                >
                    Clear History
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-sm sm:text-base">
                    No verification history found.
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 hover:border-white/20 transition-all group">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg shrink-0">
                                    {item.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                        <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{item.type}</span>
                                        <span className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {formatDate(item.date)}
                                        </span>
                                    </div>
                                    <h3 className="text-white text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors" title={item.name}>
                                        {item.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 w-full sm:w-auto">
                                <div className="text-left sm:text-right">
                                    <div className={`text-xs sm:text-sm font-bold ${item.result === 'Authentic' ? 'text-green-500' :
                                        item.result === 'Deepfake Detected' || item.result === 'Fake/Misleading' ? 'text-red-500' :
                                            'text-yellow-500'
                                        }`}>
                                        {item.result}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-500">{item.confidence} Confidence</div>
                                </div>

                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
