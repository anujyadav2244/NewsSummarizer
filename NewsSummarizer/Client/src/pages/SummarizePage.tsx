// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// import { 
//   ArrowLeft, FileText, Copy, Share2, Clock, User, Calendar, ExternalLink, 
//   Loader2, CheckCircle, AlertCircle, Download, BookOpen, MessageSquare, 
//   List, Eye, Bookmark, LogIn
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// interface Article {
//   url: string;
//   title: string;
//   author: string;
//   publishDate: string;
//   readTime: string;
//   content: string;
//   imageUrl?: string;
//   source: string;
// }

// interface Summary {
//   brief: string;
//   detailed: string;
//   keyPoints: string[];
//   questions: string[];
// }

// function SummarizePage() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const url = searchParams.get('url');
  
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [article, setArticle] = useState<Article | null>(null);
//   const [summary, setSummary] = useState<Summary | null>(null);
//   const [selectedSummaryType, setSelectedSummaryType] = useState<'brief' | 'detailed' | 'keyPoints' | 'questions'>('brief');
//   const [copied, setCopied] = useState(false);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!url) {
//       navigate('/');
//       return;
//     }

//     // Simulate loading progress
//     const progressInterval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(progressInterval);
//           return 90;
//         }
//         return prev + Math.random() * 15;
//       });
//     }, 200);

//     // Simulate API call with realistic loading time
//     setTimeout(() => {
//       const mockArticle: Article = {
//         url,
//         title: "Revolutionary AI Technology Transforms Content Creation Industry with Unprecedented Capabilities",
//         author: "Dr. Sarah Johnson",
//         publishDate: "2025-01-01",
//         readTime: "8 min read",
//         source: "TechCrunch",
//         imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
//         content: "The latest developments in artificial intelligence are reshaping how we create and consume content across industries..."
//       };

//       const mockSummary: Summary = {
//         brief: "A groundbreaking AI technology is revolutionizing content creation by automating the writing process while maintaining human-like quality and creativity. The innovation promises to increase productivity by 300% and reduce operational costs significantly, marking a pivotal moment in the digital transformation of content industries.",
//         detailed: "Revolutionary artificial intelligence technology has emerged as a transformative force in the content creation industry, fundamentally changing how businesses approach digital communication and marketing. This breakthrough system combines advanced natural language processing with sophisticated machine learning algorithms to produce high-quality written content that rivals human creativity and expertise. Early adopters across various sectors report productivity increases of up to 300%, while simultaneously maintaining editorial standards and brand consistency. The technology addresses critical challenges in content scalability, consistency, and cost-effectiveness that have long plagued organizations seeking to maintain robust digital presences. Industry experts predict this innovation will fundamentally transform how businesses approach content strategy and execution in the digital age, potentially reshaping entire marketing departments and content workflows. The implications extend beyond mere efficiency gains, suggesting a new paradigm where human creativity is augmented rather than replaced by artificial intelligence.",
//         keyPoints: [
//           "AI technology automates content creation while preserving human-like quality and creativity",
//           "Early adopters report productivity increases of up to 300% across various use cases",
//           "Advanced NLP and machine learning algorithms enable sophisticated content generation",
//           "Technology addresses critical scalability and cost-effectiveness challenges in content marketing",
//           "Industry transformation expected to reshape content strategies and organizational workflows",
//           "Human creativity is augmented rather than replaced, creating new collaborative possibilities"
//         ],
//         questions: [
//           "How does this AI technology maintain human-like writing quality while scaling production?",
//           "What are the long-term cost implications for traditional content creation teams?",
//           "How will this innovation impact employment opportunities in the writing and marketing industries?",
//           "What ethical considerations should businesses evaluate when implementing AI content generation?",
//           "How can organizations effectively integrate this technology into existing content workflows?",
//           "What quality control measures are necessary to ensure brand consistency with AI-generated content?"
//         ]
//       };

//       setProgress(100);
//       setTimeout(() => {
//         setArticle(mockArticle);
//         setSummary(mockSummary);
//         setIsLoading(false);
//       }, 500);
//     }, 3000);

//     return () => clearInterval(progressInterval);
//   }, [url, navigate]);

//   const handleCopy = async () => {
//     if (!summary) return;
    
//     let textToCopy = '';
//     switch (selectedSummaryType) {
//       case 'brief':
//         textToCopy = summary.brief;
//         break;
//       case 'detailed':
//         textToCopy = summary.detailed;
//         break;
//       case 'keyPoints':
//         textToCopy = summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n');
//         break;
//       case 'questions':
//         textToCopy = summary.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
//         break;
//     }

//     await navigator.clipboard.writeText(textToCopy);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleShare = async () => {
//     if (navigator.share && article) {
//       try {
//         await navigator.share({
//           title: `Summary: ${article.title}`,
//           text: summary?.brief || '',
//           url: window.location.href,
//         });
//       } catch (err) {
//         // Fallback to copying URL
//         await navigator.clipboard.writeText(window.location.href);
//       }
//     }
//   };

//   const getSummaryContent = () => {
//     if (!summary) return null;
    
//     switch (selectedSummaryType) {
//       case 'brief':
//         return (
//           <div className="prose prose-lg max-w-none">
//             <p className="text-gray-700 leading-relaxed text-lg">{summary.brief}</p>
//           </div>
//         );
//       case 'detailed':
//         return (
//           <div className="prose prose-lg max-w-none">
//             <p className="text-gray-700 leading-relaxed text-lg">{summary.detailed}</p>
//           </div>
//         );
//       case 'keyPoints':
//         return (
//           <div className="space-y-4">
//             {summary.keyPoints.map((point, index) => (
//               <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
//                 <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
//                   {index + 1}
//                 </div>
//                 <span className="text-gray-700 text-lg leading-relaxed">{point}</span>
//               </div>
//             ))}
//           </div>
//         );
//       case 'questions':
//         return (
//           <div className="space-y-5">
//             {summary.questions.map((question, index) => (
//               <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
//                 <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
//                   Q{index + 1}
//                 </div>
//                 <span className="text-gray-700 text-lg leading-relaxed font-medium">{question}</span>
//               </div>
//             ))}
//           </div>
//         );
//     }
//   };

//   const getSummaryTypeInfo = () => {
//     switch (selectedSummaryType) {
//       case 'brief':
//         return { icon: Eye, label: 'Brief Summary', description: 'Quick overview of the main points' };
//       case 'detailed':
//         return { icon: BookOpen, label: 'Detailed Analysis', description: 'Comprehensive breakdown and insights' };
//       case 'keyPoints':
//         return { icon: List, label: 'Key Points', description: 'Essential takeaways in bullet format' };
//       case 'questions':
//         return { icon: MessageSquare, label: 'Discussion Questions', description: 'Thought-provoking questions for deeper analysis' };
//     }
//   };

//   if (!url) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
//       {/* Header */}
//       <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/')}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 <span className="font-medium">Back</span>
//               </button>
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
//                   <FileText className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">ArticleAI</span>
//               </div>
//             </div>
            
//             {/* {!isLoading && (
//               <div className="flex items-center gap-2">
//                 {!user && (
//                   <Link
//                     to="/login"
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <LogIn className="w-4 h-4" />
//                     Sign In to Save
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleCopy}
//                   className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
//                   {copied ? 'Copied!' : 'Copy'}
//                 </button>
//                 <button
//                   onClick={handleShare}
//                   className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <Share2 className="w-4 h-4" />
//                   Share
//                 </button>
//                 <button
//                   disabled={!user}
//                   className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   title={!user ? "Sign in to save articles" : "Save article"}
//                 >
//                   <Bookmark className="w-4 h-4" />
//                   Save
//                 </button>
//               </div>
//             )} */}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Loading State */}
//         {isLoading && (
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Loader2 className="w-10 h-10 text-white animate-spin" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Article</h3>
//                 <p className="text-gray-600 mb-8 text-lg">Our AI is reading and processing the content...</p>
                
//                 {/* Progress Bar */}
//                 <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
//                   <div 
//                     className="bg-gradient-to-r from-blue-600 to-teal-600 h-3 rounded-full transition-all duration-300 ease-out"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
                
//                 {/* Processing Steps */}
//                 <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
//                   {[
//                     { step: "Fetching article content", completed: progress > 20 },
//                     { step: "Analyzing text structure", completed: progress > 40 },
//                     { step: "Extracting key information", completed: progress > 60 },
//                     { step: "Generating summaries", completed: progress > 80 },
//                     { step: "Finalizing results", completed: progress > 95 }
//                   ].map((item, index) => (
//                     <div key={index} className="flex items-center gap-3">
//                       {item.completed ? (
//                         <CheckCircle className="w-5 h-5 text-green-500" />
//                       ) : (
//                         <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
//                       )}
//                       <span className={`${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
//                         {item.step}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results */}
//         {article && summary && !isLoading && (
//           <div className="space-y-8">
//             {/* Article Header */}
//             {/* <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
//               {article.imageUrl && (
//                 <div className="h-64 sm:h-80 bg-gray-200 overflow-hidden">
//                   <img 
//                     src={article.imageUrl} 
//                     alt={article.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
              
//               <div className="p-6 sm:p-8">
//                 <div className="flex items-start justify-between gap-4 mb-6">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {article.source}
//                       </span>
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                         Analyzed
//                       </span>
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
//                       {article.title}
//                     </h1>
//                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <User className="w-4 h-4" />
//                         {article.author}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-4 h-4" />
//                         {new Date(article.publishDate).toLocaleDateString('en-US', { 
//                           year: 'numeric', 
//                           month: 'long', 
//                           day: 'numeric' 
//                         })}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         {article.readTime}
//                       </div>
//                     </div>
//                   </div>
//                   <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                     <span className="font-medium">Read Original</span>
//                   </a>
//                 </div>
//               </div>
//             </div> */}

//             {/* Summary Section */}
//             <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
//               {/* Summary Header */}
//               <div className="border-b border-gray-200 px-6 sm:px-8 py-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Summary</h2>
//                     {/* <p className="text-gray-600">Choose your preferred summary format below</p> */}
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//                       <Download className="w-4 h-4" />
//                       Export
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Summary Type Tabs */}
//                 <div className="flex flex-wrap gap-3">
//                   {[
//                     { key: 'brief' as const, icon: Eye, label: 'Brief', description: 'Quick overview' },
//                     { key: 'detailed' as const, icon: BookOpen, label: 'Detailed', description: 'Full analysis' },
//                     { key: 'keyPoints' as const, icon: List, label: 'Key Points', description: 'Main takeaways' },
//                     { key: 'questions' as const, icon: MessageSquare, label: 'Questions', description: 'Discussion topics' }
//                   ].map(({ key, icon: Icon, label, description }) => (
//                     <button
//                       key={key}
//                       onClick={() => setSelectedSummaryType(key)}
//                       className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
//                         selectedSummaryType === key
//                           ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
//                           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-2 border-gray-200'
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       <div className="text-left">
//                         <div className="font-semibold">{label}</div>
//                         <div className={`text-xs ${selectedSummaryType === key ? 'text-blue-100' : 'text-gray-500'}`}>
//                           {description}
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Summary Content */}
//               <div className="p-6 sm:p-8">
//                 <div className="mb-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     {(() => {
//                       const { icon: Icon, label, description } = getSummaryTypeInfo();
//                       return (
//                         <>
//                           <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
//                             <Icon className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="font-bold text-lg text-gray-900">{label}</h3>
//                             <p className="text-sm text-gray-600">{description}</p>
//                           </div>
//                         </>
//                       );
//                     })()}
//                   </div>
//                 </div>
                
//                 <div className="prose max-w-none">
//                   {getSummaryContent()}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default SummarizePage;

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
