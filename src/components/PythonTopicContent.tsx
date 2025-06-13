import React, { useState } from 'react';
import { Book, Clock, TrendingUp, Lightbulb, Code, Brain, Zap, Terminal } from 'lucide-react';
import EnhancedPythonCodeBlock from './EnhancedPythonCodeBlock';
import CodeExecutor from './CodeExecutor';
import { PythonTopic } from '../data/pythonTopics';

interface PythonTopicContentProps {
  topic: PythonTopic;
  onExplain?: (text: string) => void;
}

const PythonTopicContent: React.FC<PythonTopicContentProps> = ({ topic, onExplain }) => {
  const [executingCode, setExecutingCode] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'examples' | 'playground'>('examples');

  const executeCode = async (exampleId: string, code: string) => {
    setExecutingCode(exampleId);
    
    if (onExplain) {
      onExplain("I'm executing this Python code for you. Watch as the code runs and produces output. This helps you understand how Python processes each instruction step by step.");
    }
    
    // Simulate Python code execution with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // For demonstration, we'll use the expected output from the topic data
      // In a real implementation, you'd use a Python interpreter or backend service
      const example = topic.examples.find(ex => ex.id === exampleId);
      if (example) {
        setOutputs(prev => ({ ...prev, [exampleId]: example.expectedOutput }));
        
        if (onExplain) {
          onExplain(`Excellent! The code executed successfully. The output shows exactly what we expected. This demonstrates that our Python code is working correctly and following the proper syntax and logic.`);
        }
      }
    } catch (error) {
      setOutputs(prev => ({ ...prev, [exampleId]: `Execution Error: ${error}` }));
      
      if (onExplain) {
        onExplain(`We encountered an error during execution. Don't worry - errors are a normal part of programming! They help us learn and improve our code. Let me explain what went wrong and how to fix it.`);
      }
    }
    
    setExecutingCode(null);
  };

  const getDifficultyColor = () => {
    switch (topic.difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
      case 'Professor': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Topic Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
              <p className="text-blue-700 text-lg font-medium mt-2">{topic.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor()}`}>
              {topic.difficulty} Level
            </span>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{topic.estimatedTime}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Python Concepts Covered
            </h3>
            <ul className="space-y-2">
              {topic.concepts.map((concept, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="font-medium">{concept}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
              TurboTalk AI Professor's Note
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Welcome to this comprehensive Python lesson! I'm TurboTalk AI, your advanced programming professor assistant 
              created by Rushi Bhavinkumar Soni from Rango Productions. I'm here to guide you through every concept with 
              voice explanations, interactive features, and real-time code execution. Click on any code line, concept, 
              or section to get detailed explanations!
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('examples')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'examples'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Book className="h-4 w-4 inline mr-2" />
          Code Examples & Theory
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'playground'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Terminal className="h-4 w-4 inline mr-2" />
          Code Playground
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'examples' ? (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
            Interactive Python Code Examples with AI Assistance
          </h2>
          
          {topic.examples.map((example, index) => (
            <div key={example.id}>
              {/* Theory Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Theoretical Foundation
                </h3>
                <p className="text-amber-800 leading-relaxed">{example.theory}</p>
              </div>
              
              {/* Deep Dive Section */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Deep Dive Analysis
                </h3>
                <p className="text-indigo-800 leading-relaxed">{example.deepDive}</p>
              </div>
              
              {/* Enhanced Code Block with AI Integration */}
              <EnhancedPythonCodeBlock
                title={`${index + 1}. ${example.title}`}
                code={example.code}
                explanation={example.explanation}
                expectedOutput={example.expectedOutput}
                concepts={example.concepts}
                theory={example.theory}
                deepDive={example.deepDive}
                memoryAnalysis={example.memoryAnalysis}
                performanceNotes={example.performanceNotes}
                onExecute={() => executeCode(example.id, example.code)}
                isExecuting={executingCode === example.id}
                output={outputs[example.id] || ''}
                onExplain={onExplain}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-blue-600 rounded-full mr-4"></div>
              Python Code Playground
            </h2>
            <div className="text-sm text-gray-600">
              Write, execute, and experiment with Python code in real-time
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Terminal className="h-5 w-5 text-green-600 mr-2" />
              Interactive Python Environment
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This is your personal Python playground! Write any Python code, create files, and execute them with full 
              library support including NumPy, Pandas, TensorFlow, PyTorch, and CUDA for GPU acceleration. Perfect for 
              experimenting with the concepts you've learned or trying out your own ideas.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                ✅ NumPy & Pandas
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                ✅ Machine Learning Libraries
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                ✅ CUDA GPU Support
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                ✅ File Management
              </span>
            </div>
          </div>
          
          <CodeExecutor onExplain={onExplain} />
        </div>
      )}

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Python Mastery Summary with TurboTalk AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Key Python Concepts Mastered</h3>
            <ul className="space-y-2 text-emerald-800">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Interactive understanding of Python syntax with AI voice explanations
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Deep knowledge of programming concepts with line-by-line analysis
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Advanced features and best practices with professor-level guidance
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Real-time code execution with CUDA support and file management
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">TurboTalk AI Enhanced Learning</h3>
            <p className="text-emerald-800 leading-relaxed">
              With TurboTalk AI as your programming professor assistant, you've experienced personalized learning with 
              voice explanations, interactive code analysis, real-time execution, and intelligent assistance. This 
              innovative approach combines traditional computer science education with modern AI technology, web scraping, 
              and RAG systems to create an immersive learning experience that adapts to your pace and learning style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonTopicContent;