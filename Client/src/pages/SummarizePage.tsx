
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Loader2, CheckCircle, Download, Copy 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Article {
  url: string;
  title: string;
  author: string;
  publishDate: string;
  readTime: string;
  content: string;
  imageUrl?: string;
  source: string;
}

interface Summary {
  brief: string;
  detailed: string;
  keyPoints: string[];
  questions: string[];
}

function SummarizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');
  
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!url) {
      navigate('/');
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      const mockArticle: Article = {
        url,
        title: "Revolutionary AI Technology Transforms Content Creation Industry with Unprecedented Capabilities",
        author: "Dr. Sarah Johnson",
        publishDate: "2025-01-01",
        readTime: "8 min read",
        source: "TechCrunch",
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
        content: "The latest developments in artificial intelligence are reshaping how we create and consume content across industries..."
      };

      const mockSummary: Summary = {
        brief: "A groundbreaking AI technology is revolutionizing content creation by automating the writing process while maintaining human-like quality and creativity. The innovation promises to increase productivity by 300% and reduce operational costs significantly, marking a pivotal moment in the digital transformation of content industries.",
        detailed: "",
        keyPoints: [],
        questions: []
      };

      setProgress(100);
      setTimeout(() => {
        setArticle(mockArticle);
        setSummary(mockSummary);
        setIsLoading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(progressInterval);
  }, [url, navigate]);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary.brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ArticleAI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Article</h3>
                <p className="text-gray-600 mb-8 text-lg">Our AI is reading and processing the content...</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Display */}
        {!isLoading && article && summary && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Summary</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{summary.brief}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SummarizePage;
