import React, { useState } from 'react';
import { Book, Clock, TrendingUp, Lightbulb } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { Topic } from '../data/topics';

interface TopicContentProps {
  topic: Topic;
}

const TopicContent: React.FC<TopicContentProps> = ({ topic }) => {
  const [executingCode, setExecutingCode] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  const executeCode = async (exampleId: string, code: string) => {
    setExecutingCode(exampleId);
    
    // Simulate code execution with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Create a mock console object to capture output
      const mockConsole = {
        log: (...args: any[]) => args.join(' '),
        error: (...args: any[]) => `Error: ${args.join(' ')}`
      };
      
      // This is a simplified simulation - in a real implementation, 
      // you'd use a secure sandboxed environment
      let output = '';
      const originalConsole = console;
      
      // Mock console.log to capture output
      (global as any).console = {
        log: (...args: any[]) => {
          output += args.join(' ') + '\n';
        }
      };
      
      // For demonstration, we'll use the expected output from the topic data
      const example = topic.examples.find(ex => ex.id === exampleId);
      if (example) {
        output = example.expectedOutput;
      }
      
      setOutputs(prev => ({ ...prev, [exampleId]: output }));
    } catch (error) {
      setOutputs(prev => ({ ...prev, [exampleId]: `Execution Error: ${error}` }));
    }
    
    setExecutingCode(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Topic Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
              <p className="text-blue-700 text-lg font-medium mt-2">{topic.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              topic.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
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
              Learning Objectives
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
              Professor's Note
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              This topic builds upon fundamental programming concepts and introduces advanced patterns 
              that are essential for professional software development. Pay close attention to the 
              line-by-line explanations and try to understand the underlying mechanisms.
            </p>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
          Interactive Code Examples
        </h2>
        
        {topic.examples.map((example, index) => (
          <div key={example.id}>
            {/* Theory Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                📚 Theoretical Foundation
              </h3>
              <p className="text-amber-800 leading-relaxed">{example.theory}</p>
            </div>
            
            {/* Code Block */}
            <CodeBlock
              title={`${index + 1}. ${example.title}`}
              code={example.code}
              explanation={example.explanation}
              expectedOutput={example.expectedOutput}
              concepts={example.concepts}
              onExecute={() => executeCode(example.id, example.code)}
              isExecuting={executingCode === example.id}
              output={outputs[example.id] || ''}
            />
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Topic Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-emerald-800">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Understanding the fundamental concepts is crucial for advanced programming
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Real-world applications demonstrate practical implementation
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Performance considerations and best practices matter in production code
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Next Steps</h3>
            <p className="text-emerald-800 leading-relaxed">
              Practice implementing these concepts in your own projects. Experiment with variations 
              and edge cases to deepen your understanding. Consider how these patterns apply to 
              larger software architectures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;