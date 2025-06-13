import React from 'react';
import { Play, RotateCcw, Eye, CheckCircle } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  code: string;
  explanation: string[];
  expectedOutput: string;
  concepts: string[];
  onExecute: () => void;
  isExecuting: boolean;
  output: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  title,
  code,
  explanation,
  expectedOutput,
  concepts,
  onExecute,
  isExecuting,
  output
}) => {
  const codeLines = code.split('\n');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              {isExecuting ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isExecuting ? 'Executing...' : 'Execute Code'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Code Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Eye className="h-4 w-4 text-blue-600" />
            <span>Source Code with Line Numbers</span>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-mono">
              {title.toLowerCase().replace(/\s+/g, '_')}.js
            </div>
            <div className="p-4">
              {codeLines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 text-sm font-mono w-8 text-right mr-4 select-none">
                    {index + 1}
                  </span>
                  <span className="text-gray-100 font-mono text-sm flex-1">
                    <code className="language-javascript">{line}</code>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Concepts */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Programming Concepts Demonstrated:</h4>
            <div className="flex flex-wrap gap-2">
              {concepts.map((concept, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation and Output Section */}
        <div className="space-y-6">
          {/* Line-by-Line Explanation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Professor's Line-by-Line Analysis:</h4>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              {explanation.map((line, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-blue-600 font-bold text-sm mt-0.5 min-w-[24px]">
                    {index + 1}.
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Output */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Expected Output:</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <pre className="text-green-800 font-mono text-sm whitespace-pre-wrap">
                {expectedOutput}
              </pre>
            </div>
          </div>

          {/* Actual Output */}
          {output && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="text-sm font-semibold text-gray-700">Actual Output:</h4>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;