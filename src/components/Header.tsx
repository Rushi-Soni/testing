import React from 'react';
import { BookOpen, Lightbulb, Code2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">
                Python Programming Professor
              </h1>
              <p className="text-blue-200 text-lg font-medium">
                Complete Python Mastery • Line-by-Line Analysis • Professor-Level Explanations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-blue-800/30 px-4 py-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span className="text-blue-200 font-medium">Deep Learning</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-800/30 px-4 py-2 rounded-full">
              <Code2 className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-200 font-medium">Python Mastery</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;