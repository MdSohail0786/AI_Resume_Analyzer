import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const StatCard = ({ number, label, delay }) => (
  <div className={`text-center animate-slide-up`} style={{ animationDelay: delay }}>
    <div className="text-3xl font-black text-blue-600">{number}</div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, color, delay }) => (
  <div className="bg-white rounded-2xl p-6 shadow-card card-hover animate-slide-up border border-slate-100" style={{ animationDelay: delay }}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc, delay }) => (
  <div className="flex gap-4 animate-slide-up" style={{ animationDelay: delay }}>
    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-blue">
      {step}
    </div>
    <div className="pt-1">
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </div>
  </div>
);

const Home = ({ isLoggedIn }) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float-delay2" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-200 text-xs font-medium">Powered by Google Gemini AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            Get your resume<br />
            <span className="gradient-text">job-ready</span> in seconds
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, paste a job description, and get AI-powered feedback on your match score, skill gaps, and exactly what to improve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoggedIn ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-blue hover:shadow-lg hover:-translate-y-0.5">
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-blue hover:shadow-lg hover:-translate-y-0.5">
                  Start for free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Floating mock cards */}
          <div className="relative max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Analysis Complete</div>
                  <div className="text-xs text-slate-500">Senior Frontend Developer</div>
                </div>
                <div className="ml-auto text-2xl font-black text-green-600">87%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full progress-bar" style={{ width: "87%" }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["React", "TypeScript", "Node.js", "GraphQL"].map(s => (
                  <span key={s} className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{s}</span>
                ))}
                {["Docker", "AWS"].map(s => (
                  <span key={s} className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">✕ {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8">
          <StatCard number="10K+" label="Resumes Analyzed" delay="0ms" />
          <StatCard number="94%" label="Match Accuracy" delay="100ms" />
          <StatCard number="3x" label="Interview Rate Boost" delay="200ms" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Everything you need to land the job</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} title="Match Score" desc="See exactly how well your resume matches the job description with a 0–100 score." color="bg-blue-50" delay="0ms" />
            <FeatureCard icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="Skill Gap Analysis" desc="Instantly know which skills you have, which are missing, and how critical they are." color="bg-purple-50" delay="100ms" />
            <FeatureCard icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} title="AI Suggestions" desc="Get personalized, actionable tips from Gemini AI on how to improve your resume." color="bg-green-50" delay="200ms" />
            <FeatureCard icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} title="PDF Export" desc="Download your full analysis as a polished PDF to share or keep for reference." color="bg-orange-50" delay="300ms" />
            <FeatureCard icon={<svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Analysis History" desc="Track your progress over time. See every analysis you've run and compare scores." color="bg-cyan-50" delay="400ms" />
            <FeatureCard icon={<svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} title="Profile & Stats" desc="Your personalized dashboard with performance stats and career progress over time." color="bg-rose-50" delay="500ms" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">Three steps to a better resume</h2>
          </div>
          <div className="space-y-8 max-w-md mx-auto">
            <StepCard step="1" title="Upload your resume" desc="Upload your resume as a PDF. We'll extract all the text and skills automatically." delay="0ms" />
            <StepCard step="2" title="Paste job description" desc="Copy and paste the job description from any job board — LinkedIn, Naukri, Indeed." delay="150ms" />
            <StepCard step="3" title="Get your AI analysis" desc="In seconds, see your match score, skill gaps, and exactly what to fix to get the interview." delay="300ms" />
          </div>
          <div className="text-center mt-12">
            {isLoggedIn ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-blue">
                Analyze my resume now →
              </Link>
            ) : (
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-blue">
                Try it free — no credit card →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-white font-semibold text-sm">AI Resume Analyzer</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} AI Resume Analyzer. Built with MERN Stack + Gemini AI.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
