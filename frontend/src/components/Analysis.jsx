import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Animated circular score ring — the signature element
const ScoreRing = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  const bgColor = score >= 75 ? "#ECFDF5" : score >= 50 ? "#FFFBEB" : "#FEF2F2";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work";

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animated) return;
    let start = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayScore(score); clearInterval(interval); }
      else setDisplayScore(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [animated, score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
          {/* Animated progress circle */}
          <circle
            cx="90" cy="90" r={radius} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>{displayScore}</span>
          <span className="text-xs font-medium text-slate-500">out of 100</span>
        </div>
      </div>
      <span className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: bgColor, color }}>{label}</span>
    </div>
  );
};

const SkillBadge = ({ skill, type }) => (
  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
    type === "match" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
  }`}>
    {type === "missing" ? "✕ " : "✓ "}{skill}
  </span>
);

const Analysis = ({ result }) => {
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-card p-12 max-w-md w-full">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No analysis yet</h2>
          <p className="text-slate-500 text-sm mb-6">Upload a resume and job description to see your results.</p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      // Use browser print as PDF
      const printWindow = window.open("", "_blank");
      const scoreColor = result.score >= 75 ? "#10B981" : result.score >= 50 ? "#F59E0B" : "#EF4444";
      printWindow.document.write(`
        <!DOCTYPE html><html><head>
        <title>Resume Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
          h1 { color: #1e40af; font-size: 24px; margin-bottom: 8px; }
          .score { font-size: 64px; font-weight: 900; color: ${scoreColor}; }
          .section { margin: 24px 0; }
          .section h2 { font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 3px; }
          .match { background: #dcfce7; color: #15803d; }
          .missing { background: #fee2e2; color: #dc2626; }
          .suggestions { background: #f8fafc; padding: 16px; border-radius: 12px; line-height: 1.7; font-size: 14px; }
          .header { background: #eff6ff; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center; }
          .meta { font-size: 13px; color: #64748b; margin-top: 4px; }
        </style></head><body>
        <div class="header">
          <h1>Resume Analysis Report</h1>
          <div class="score">${result.score}%</div>
          <div class="meta">Job Role: ${result.jobRole || "N/A"} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString("en-IN")}</div>
        </div>
        <div class="section">
          <h2>Matched Skills (${result.extractedSkills?.length || 0})</h2>
          ${(result.extractedSkills || []).map(s => `<span class="badge match">✓ ${s}</span>`).join("")}
        </div>
        <div class="section">
          <h2>Missing Skills (${result.missingSkills?.length || 0})</h2>
          ${(result.missingSkills || []).map(s => `<span class="badge missing">✕ ${s}</span>`).join("")}
        </div>
        <div class="section">
          <h2>AI Suggestions</h2>
          <div class="suggestions">${result.suggestions?.replace(/\n/g, "<br>") || "No suggestions."}</div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
        </body></html>`);
      printWindow.document.close();
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-5xl mx-auto" ref={printRef}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Analysis Results</h1>
            {result.jobRole && <p className="text-slate-500 mt-1">{result.jobRole}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard")} className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              New Analysis
            </button>
            <button onClick={handleDownloadPDF} disabled={pdfLoading} className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-blue flex items-center gap-2 disabled:opacity-60">
              {pdfLoading ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              Download PDF
            </button>
          </div>
        </div>

        {/* Score + Quick Stats */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={result.score} />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {[
                { label: "Matched Skills", value: result.extractedSkills?.length || 0, color: "text-green-600", bg: "bg-green-50", icon: "✓" },
                { label: "Missing Skills", value: result.missingSkills?.length || 0, color: "text-red-600", bg: "bg-red-50", icon: "✕" },
                { label: "Suggestions", value: result.suggestions ? "✓" : "—", color: "text-blue-600", bg: "bg-blue-50", icon: "💡" },
              ].map(({ label, value, color, bg, icon }) => (
                <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Matched */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-bold">✓</span>
              Matched Skills
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{result.extractedSkills?.length || 0}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills?.length > 0
                ? result.extractedSkills.map((s, i) => <SkillBadge key={i} skill={s} type="match" />)
                : <p className="text-slate-400 text-sm">No matched skills found.</p>}
            </div>
          </div>
          {/* Missing */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">✕</span>
              Missing Skills
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{result.missingSkills?.length || 0}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills?.length > 0
                ? result.missingSkills.map((s, i) => <SkillBadge key={i} skill={s} type="missing" />)
                : <p className="text-slate-400 text-sm">No missing skills — great match!</p>}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 mb-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-lg">💡</span>
            AI Improvement Suggestions
          </h2>
          <div className="bg-blue-50 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-blue-100">
            {result.suggestions || "No suggestions available."}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
          {result.pdfUrl && (
            <a href={`http://localhost:8000${result.pdfUrl}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 text-center text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              View Resume PDF
            </a>
          )}
          <button onClick={() => navigate("/history")}
            className="flex-1 py-3 text-center text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            View History
          </button>
          <button onClick={handleDownloadPDF} disabled={pdfLoading}
            className="flex-1 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-blue">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download Report PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
