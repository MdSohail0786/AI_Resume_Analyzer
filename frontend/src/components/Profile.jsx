import React, { useEffect, useState } from "react";
import axios from "axios";

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className={`${bg} rounded-2xl p-5 border border-white animate-slide-up`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

const Profile = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setHistory(res.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const avgScore = history.length ? Math.round(history.reduce((a, i) => a + i.score, 0) / history.length) : 0;
  const bestScore = history.length ? Math.max(...history.map(i => i.score)) : 0;
  const strongMatches = history.filter(i => i.score >= 75).length;
  const initials = (user?.name || user?.email || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Score distribution
  const strong = history.filter(i => i.score >= 75).length;
  const moderate = history.filter(i => i.score >= 50 && i.score < 75).length;
  const weak = history.filter(i => i.score < 50).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-slide-up">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600" />
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-lg">
                {initials}
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{user?.name || "User"}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Performance</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Analyses" value={history.length} icon="📊" color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Average Score" value={history.length ? `${avgScore}%` : "—"} icon="🎯" color="text-purple-600" bg="bg-purple-50" />
              <StatCard label="Best Score" value={history.length ? `${bestScore}%` : "—"} icon="🏆" color="text-green-600" bg="bg-green-50" />
              <StatCard label="Strong Matches" value={strongMatches} icon="⚡" color="text-orange-600" bg="bg-orange-50" />
            </div>
          )}
        </div>

        {/* Score Distribution */}
        {!loading && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up">
            <h2 className="font-semibold text-slate-900 mb-5">Score Distribution</h2>
            <div className="space-y-4">
              {[
                { label: "Strong Match (75–100%)", count: strong, color: "bg-green-500", textColor: "text-green-700" },
                { label: "Moderate Match (50–74%)", count: moderate, color: "bg-yellow-500", textColor: "text-yellow-700" },
                { label: "Needs Work (0–49%)", count: weak, color: "bg-red-500", textColor: "text-red-600" },
              ].map(({ label, count, color, textColor }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">{label}</span>
                    <span className={`font-semibold ${textColor}`}>{count} analysis{count !== 1 ? "es" : ""}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full progress-bar`}
                      style={{ width: history.length > 0 ? `${(count / history.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {!loading && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slide-up">
            <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, idx) => {
                const scoreColor = item.score >= 75 ? "text-green-600" : item.score >= 50 ? "text-yellow-600" : "text-red-600";
                const scoreBg = item.score >= 75 ? "bg-green-100" : item.score >= 50 ? "bg-yellow-100" : "bg-red-100";
                return (
                  <div key={item._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.jobRole || "Unknown Role"}</p>
                      <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}>
                      {item.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No data yet</h3>
            <p className="text-slate-500 text-sm">Analyze your first resume to see stats here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
