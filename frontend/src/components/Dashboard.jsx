import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAnalysisResult, user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed."); return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB."); return;
    }
    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) { setError("Please upload a resume and enter a job description."); return; }
    if (jobDesc.trim().length < 20) { setError("Job description is too short."); return; }
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDesc);
      const res = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnalysisResult(res.data);
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    "Use keywords from the job description",
    "Quantify your achievements with numbers",
    "Keep resume to 1-2 pages max",
    "Tailor each resume to the specific role",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Analyze Your Resume
          </h1>
          <p className="text-slate-500 mt-1">Upload your PDF and paste a job description to get your AI match score.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-slide-up">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Upload Resume</h2>
                  <p className="text-xs text-slate-500">PDF only, max 5MB</p>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver ? "border-blue-500 bg-blue-50" :
                  file ? "border-green-400 bg-green-50" :
                  "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => handleFileChange(e.target.files[0])} className="hidden" />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-slate-700 font-medium text-sm">Drop your PDF here or click to browse</p>
                    <p className="text-xs text-slate-400 mt-1">Text-based PDFs only (not scanned)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Card */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Job Description</h2>
                  <p className="text-xs text-slate-500">Paste from LinkedIn, Naukri, Indeed, etc.</p>
                </div>
                {jobDesc.length > 0 && (
                  <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${
                    jobDesc.length >= 100 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {jobDesc.length} chars
                  </span>
                )}
              </div>
              <textarea
                rows="9"
                placeholder="Paste the full job description here...

Example:
We are looking for a Senior React Developer with 3+ years of experience. 
Required: React, TypeScript, Node.js, REST APIs...
Nice to have: Docker, AWS, GraphQL..."
                value={jobDesc}
                onChange={(e) => { setJobDesc(e.target.value); setError(""); }}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all bg-slate-50 focus:bg-white text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl transition-all shadow-blue hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 animate-slide-up animate-pulse-ring"
              style={{ animationDelay: "200ms" }}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Analyze Resume with AI
                </>
              )}
            </button>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg>
                Pro Tips
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white animate-slide-up" style={{ animationDelay: "250ms" }}>
              <h3 className="font-semibold mb-2">How the score works</h3>
              <div className="space-y-2 text-sm text-blue-100">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full" />75–100% — Strong match</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-400 rounded-full" />50–74% — Moderate match</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-400 rounded-full" />0–49% — Needs improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
