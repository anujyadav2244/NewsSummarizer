import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import API_BASE_URL from "../services/api";

interface Summary {
  brief: string;
}

function SummarizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get("url");

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      navigate("/");
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first");

        const response = await fetch(`${API_BASE_URL}/api/summarize/url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
          throw new Error(data?.message || "Failed to summarize");
        }

        const summaryText = data?.summary || data;

        if (!summaryText) {
          throw new Error("Summary not available");
        }

        setSummary({ brief: summaryText });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [url, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft />
          Back
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
            <p className="mt-4">Analyzing article...</p>
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {summary && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText />
              AI Summary
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {summary.brief}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default SummarizePage;
