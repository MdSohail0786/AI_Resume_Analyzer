import React, { useEffect, useState } from "react";
import axios from "axios";

const ScoreBadge = ({ score }) => {
  const cfg = score >= 75 ? { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" }
             : score >= 50 ? { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-500" }
             : { bg: "bg-red-100", text: "text-red-600", bar: "bg-red-500" };
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 bg-slate-200 rounded-full h-1.5">
        <div className={`${cfg.bar} h-1.5 rounded-full progress-bar`} style={{ width: `${score}%` }} />
      </div>
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>{score}%</span>
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setHistory(res.data);
      } catch { setError("Failed to load history."); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`/api/history/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHistory(prev => prev.filter(i => i._id !== id));
    } catch { alert("Failed to delete."); }
  };

  const avgScore = history.length ? Math.round(history.reduce((a, i) => a + i.score, 0) / history.length) : 0;
  const bestScore = history.length ? Math.max(...history.map(i => i.score)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Analysis History</h1>
          <p className="text-slate-500 mt-1">Track your resume performance over time.</p>
        </div>

        {/* Stats cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            {[
              { label: "Total Analyses", value: history.length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Average Score", value: `${avgScore}%`, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Best Score", value: `${bestScore}%`, color: "text-green-600", bg: "bg-green-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-5 text-center border border-white`}>
                <div className={`text-3xl font-black ${color}`}>{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center">
            <svg className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            <p className="text-slate-500">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-16 text-center animate-fade-in">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No analyses yet</h3>
            <p className="text-slate-500 text-sm">Upload your first resume to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Resume / Job Role</div>
              <div className="col-span-3">Match Score</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {/* Table rows */}
            {history.map((item, idx) => (
              <div key={item._id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 animate-slide-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="col-span-4">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.jobRole || "Unknown Role"}</p>
                  <a href={`http://localhost:8000${item.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Resume
                  </a>
                </div>
                <div className="col-span-3">
                  <ScoreBadge score={item.score} />
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-slate-600">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
