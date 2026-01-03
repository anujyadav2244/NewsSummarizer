import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Link as LinkIcon,
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../services/api";

function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to summarize articles.");
      }

      const response = await fetch(`${API_BASE_URL}/api/summarize/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const text = await response.text(); // ✅ SAFE
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to summarize article");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ArticleAI</h1>
              <p className="text-sm text-gray-600">
                AI-Powered News Summarizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={logout}
                className="text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI Technology
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform News Articles into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 block">
              Actionable Insights
            </span>
          </h2>
        </div>

        {/* URL Input Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="url"
                  className="block text-lg font-semibold text-gray-800 mb-4"
                >
                  Enter Article URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/news-article"
                    className="w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? "Analyzing..." : "Analyze Article"}
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            {error && (
              <p className="mt-6 text-red-600 text-center font-medium">
                {error}
              </p>
            )}

            {summary && (
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Summary
                </h3>
                <p className="whitespace-pre-wrap text-gray-700">
                  {JSON.stringify(summary, null, 2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
