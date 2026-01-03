import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Link as LinkIcon,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function HomePage() {
  const [url, setUrl] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // ✅ ONLY redirect
    navigate(`/summarize?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ArticleAI</h1>
              <p className="text-sm text-gray-600">AI News Summarizer</p>
            </div>
          </div>

          {user ? (
            <button
              onClick={logout}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">Sign In</Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>
          <h2 className="text-5xl font-bold mb-4">
            Summarize Any News Article
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl">
          <label className="block mb-4 font-semibold">Enter Article URL</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl"
              placeholder="https://example.com/article"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl flex justify-center items-center gap-2"
          >
            Analyze Article
            <ArrowRight />
          </button>
        </form>
      </main>
    </div>
  );
}

export default HomePage;
