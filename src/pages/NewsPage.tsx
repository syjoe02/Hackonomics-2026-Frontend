import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBackground from "@/components/layouts/AppBackground";
import Button from "@/components/ui/Button";
import { api } from "@/api/client";
import { raiseAppError } from "@/common/errors/raiseAppError";
import { Newspaper, RefreshCw, TrendingUp } from "lucide-react";
import type { NewsItem } from "@/api/types";

export default function NewsPage() {
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    type BusinessNewsResponse = {
        news: NewsItem[];
    };

    const loadNews = async () => {
        try {
            setLoading(true);

            const res = await api.get<BusinessNewsResponse>(
                "/news/business-news/"
            );

            setNews(res.data.news ?? []);
        } catch (err: unknown) {
            raiseAppError(err, navigate, "Failed to load business news");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    return (
        <AppBackground>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-6 sm:p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Newspaper className="w-6 h-6 text-indigo-600" />
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Business News
                                </h1>
                            </div>

                            <Button
                                onClick={loadNews}
                                loading={loading}
                                size="sm"
                                variant="outline"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""
                                        }`}
                                />
                                Refresh
                            </Button>
                        </div>

                        {/* Subtitle */}
                        <p className="text-sm text-gray-500 mb-8">
                            Key global & local economic developments from the last 3 days.
                        </p>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-xl bg-gray-200 h-24"
                                    />
                                ))}
                            </div>
                        )}

                        {/* News Cards */}
                        {!loading && news.length > 0 && (
                            <div className="space-y-4">
                                {news.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="
                                            p-5 rounded-2xl border border-gray-200
                                            shadow-sm hover:shadow-md transition
                                            bg-white
                                        "
                                    >
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-indigo-600 mt-1" />

                                            <div>
                                                <h2 className="font-semibold text-gray-900">
                                                    {item.title}
                                                </h2>

                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && news.length === 0 && (
                            <p className="text-gray-500 text-center">
                                No recent business news.
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </AppBackground>
    );
}