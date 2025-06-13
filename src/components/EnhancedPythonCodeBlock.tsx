import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Eye, CheckCircle, Brain, Zap, Database, Clock, Volume2, BookOpen } from 'lucide-react';

interface EnhancedPythonCodeBlockProps {
  title: string;
  code: string;
  explanation: string[];
  expectedOutput: string;
  concepts: string[];
  theory: string;
  deepDive: string;
  memoryAnalysis?: string;
  performanceNotes?: string;
  onExecute: () => void;
  isExecuting: boolean;
  output: string;
  onExplain?: (text: string) => void;
}

const EnhancedPythonCodeBlock: React.FC<EnhancedPythonCodeBlockProps> = ({
  title,
  code,
  explanation,
  expectedOutput,
  concepts,
  theory,
  deepDive,
  memoryAnalysis,
  performanceNotes,
  onExecute,
  isExecuting,
  output,
  onExplain
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'theory' | 'deep' | 'memory' | 'performance'>('code');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const codeLines = code.split('\n');

  const handleLineClick = (lineIndex: number, line: string) => {
    setHighlightedLine(lineIndex);
    
    if (onExplain) {
      const explanationText = `Let me explain line ${lineIndex + 1}: "${line.trim()}". ${
        explanation[lineIndex] || 'This line performs a specific operation in our Python program.'
      }`;
      onExplain(explanationText);
    }
  };

  const handleConceptClick = (concept: string) => {
    if (onExplain) {
      const conceptExplanation = `The concept "${concept}" is fundamental in Python programming. This represents a core programming principle that you'll use throughout your Python journey. Understanding this concept deeply will help you write better, more efficient code.`;
      onExplain(conceptExplanation);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    
    if (onExplain) {
      let tabExplanation = '';
      switch (tab) {
        case 'theory':
          tabExplanation = 'Now we\'re exploring the theoretical foundation. This section explains the computer science principles behind the code. Understanding theory helps you become a better programmer!';
          break;
        case 'deep':
          tabExplanation = 'Welcome to the deep dive analysis! Here we explore advanced concepts and implementation details that professional developers need to know.';
          break;
        case 'memory':
          tabExplanation = 'This is the memory management section. Understanding how Python handles memory is crucial for writing efficient programs, especially when working with large datasets.';
          break;
        case 'performance':
          tabExplanation = 'Performance analysis helps you understand how fast your code runs and how to optimize it. This is essential knowledge for professional Python development.';
          break;
        default:
          tabExplanation = 'Back to the code analysis section. Here you can see the Python source code with detailed line-by-line explanations.';
      }
      onExplain(tabExplanation);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {onExplain && (
              <button
                onClick={() => onExplain(`Let me introduce this topic: ${title}. This example demonstrates important Python concepts with detailed explanations and interactive features.`)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Explain this topic"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            )}
          </div>
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
              {isExecuting ? 'Executing...' : 'Execute Python'}
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleTabChange('code')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'code' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Code Analysis
          </button>
          <button
            onClick={() => handleTabChange('theory')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'theory' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-1" />
            Theory
          </button>
          <button
            onClick={() => handleTabChange('deep')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'deep' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-1" />
            Deep Dive
          </button>
          {memoryAnalysis && (
            <button
              onClick={() => handleTabChange('memory')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'memory' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Database className="h-4 w-4 inline mr-1" />
              Memory
            </button>
          )}
          {performanceNotes && (
            <button
              onClick={() => handleTabChange('performance')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'performance' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-1" />
              Performance
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Eye className="h-4 w-4 text-blue-600" />
                <span>Interactive Python Source Code</span>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-mono">
                  {title.toLowerCase().replace(/\s+/g, '_')}.py
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {codeLines.map((line, index) => (
                    <div 
                      key={index} 
                      className={`flex cursor-pointer hover:bg-gray-800 transition-colors rounded ${
                        highlightedLine === index ? 'bg-blue-900/50 border-l-4 border-blue-400' : ''
                      }`}
                      onClick={() => handleLineClick(index, line)}
                      title="Click to explain this line"
                    >
                      <span className="text-gray-500 text-sm font-mono w-10 text-right mr-4 select-none">
                        {index + 1}
                      </span>
                      <span className="text-gray-100 font-mono text-sm flex-1">
                        <code className="language-python">{line}</code>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Concepts */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Python Concepts (Click to learn):</h4>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((concept, index) => (
                    <button
                      key={index}
                      onClick={() => handleConceptClick(concept)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-full font-medium transition-colors cursor-pointer"
                      title={`Click to learn about ${concept}`}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explanation and Output Section */}
            <div className="space-y-6">
              {/* Line-by-Line Explanation */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Professor's Line-by-Line Analysis:</h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                  {explanation.map((line, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-3 p-2 rounded transition-colors ${
                        highlightedLine === index ? 'bg-blue-200 border-l-4 border-blue-600' : ''
                      }`}
                    >
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-48 overflow-y-auto">
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
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-purple-700">
              <Brain className="h-5 w-5" />
              <span>Theoretical Foundation</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-purple-800 leading-relaxed text-base">{theory}</p>
            </div>
          </div>
        )}

        {activeTab === 'deep' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
              <Zap className="h-5 w-5" />
              <span>Deep Dive Analysis</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-indigo-800 leading-relaxed text-base">{deepDive}</p>
            </div>
          </div>
        )}

        {activeTab === 'memory' && memoryAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
              <Database className="h-5 w-5" />
              <span>Memory Management Analysis</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <p className="text-emerald-800 leading-relaxed text-base">{memoryAnalysis}</p>
            </div>
          </div>
        )}

        {activeTab === 'performance' && performanceNotes && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-orange-700">
              <Clock className="h-5 w-5" />
              <span>Performance Analysis</span>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-orange-800 leading-relaxed text-base">{performanceNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPythonCodeBlock;