import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isLoggedIn
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/history", label: "History" },
        { to: "/profile", label: "Profile" },
      ]
    : [];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-white border-b border-slate-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-blue">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm leading-none">AI Resume</span>
            <span className="block text-xs text-slate-400 leading-none mt-0.5">Analyzer</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/") ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}>Home</Link>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(to) ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}>{label}</Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-blue">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden lg:block">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
              </div>
              <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">{label}</Link>
          ))}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {!isLoggedIn ? (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 px-4 py-2 text-center text-sm font-medium border border-slate-200 rounded-lg text-slate-700">Sign in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 px-4 py-2 text-center text-sm font-semibold bg-blue-600 text-white rounded-lg">Get Started</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg">Sign out</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
