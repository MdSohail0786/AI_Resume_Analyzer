import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section */}
        <p className="text-sm">
          © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
        </p>

        {/* Center Links */}
        <div className="flex gap-6 text-sm">
          <a href="/privacy" className="hover:text-blue-600 transition">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-blue-600 transition">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-blue-600 transition">
            Contact Us
          </a>
        </div>

        {/* Right Social Icons */}
        <div className="flex gap-4 text-lg">
          <a href="#" className="hover:text-blue-600">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-blue-600">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-600">
            <FaLinkedin />
          </a>
          <a href="#" className="hover:text-blue-600">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
