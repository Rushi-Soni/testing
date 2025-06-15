import React, { useState } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import PythonTopicContent from './components/PythonTopicContent';
import { pythonTopics } from './data/pythonTopics';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const selectedTopic = pythonTopics.find(topic => topic.id === selectedTopicId);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId === selectedTopicId ? null : topicId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!selectedTopic ? (
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Master Python Programming - Beginner to Professor Level
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive Python education with interactive code execution, real terminal access, 
              and step-by-step guidance. Execute real Python code and commands in a full development environment!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pythonTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                title={topic.title}
                description={topic.description}
                difficulty={topic.difficulty}
                estimatedTime={topic.estimatedTime}
                concepts={topic.concepts}
                isActive={selectedTopicId === topic.id}
                onClick={() => handleTopicSelect(topic.id)}
              />
            ))}
          </div>
          
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🐍 Complete Python Mastery with Real Development Environment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real Terminal Access</h4>
                  <p className="text-gray-600 text-sm">Execute actual Python commands and see real outputs in a virtual environment</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Code Editor</h4>
                  <p className="text-gray-600 text-sm">Write, edit, and execute Python code with full library support</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professor-Level Teaching</h4>
                  <p className="text-gray-600 text-sm">Deep theoretical foundations with practical examples and memory analysis</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">CUDA GPU Support</h4>
                  <p className="text-gray-600 text-sm">GPU acceleration for machine learning and AI development</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div>
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-6">
              <button
                onClick={() => setSelectedTopicId(null)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                ← Back to Python Topics
              </button>
            </div>
          </div>
          <PythonTopicContent topic={selectedTopic} />
        </div>
      )}
    </div>
  );
}

export default App;