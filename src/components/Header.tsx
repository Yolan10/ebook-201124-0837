import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              eBook Creator
            </span>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Get Started
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}