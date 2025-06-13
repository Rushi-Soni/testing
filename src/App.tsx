import React, { useState } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import PythonTopicContent from './components/PythonTopicContent';
import AIAssistant from './components/AIAssistant';
import AssistantToggle from './components/AssistantToggle';
import { pythonTopics } from './data/pythonTopics';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);

  const selectedTopic = pythonTopics.find(topic => topic.id === selectedTopicId);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId === selectedTopicId ? null : topicId);
    
    // Show assistant when a topic is selected
    if (topicId !== selectedTopicId) {
      setIsAssistantVisible(true);
    }
  };

  const handleAssistantToggle = () => {
    setIsAssistantVisible(!isAssistantVisible);
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
              Comprehensive Python education with an AI Professor Assistant that provides voice explanations, 
              interactive code analysis, and step-by-step guidance. Click the AI assistant button to get 
              personalized help with every concept!
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
                🐍 Complete Python Mastery with AI Professor Assistant
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Voice Assistant</h4>
                  <p className="text-gray-600 text-sm">Interactive AI professor that explains concepts with voice output and animations</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Code Analysis</h4>
                  <p className="text-gray-600 text-sm">Click on any line of code to get detailed explanations and voice guidance</p>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Real-time Execution</h4>
                  <p className="text-gray-600 text-sm">Execute Python code with performance analysis and optimization tips</p>
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
          <PythonTopicContent 
            topic={selectedTopic} 
            onExplain={(text: string) => {
              // This will be handled by the AI assistant
              console.log('Explanation requested:', text);
            }}
          />
        </div>
      )}

      {/* AI Assistant Toggle Button */}
      <AssistantToggle 
        isVisible={isAssistantVisible}
        onToggle={handleAssistantToggle}
      />

      {/* AI Assistant */}
      <AIAssistant 
        isVisible={isAssistantVisible}
        onToggle={handleAssistantToggle}
      />
    </div>
  );
}

export default App;