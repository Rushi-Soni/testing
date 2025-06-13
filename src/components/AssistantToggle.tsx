import React from 'react';
import { Bot, BotMessageSquare } from 'lucide-react';

interface AssistantToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const AssistantToggle: React.FC<AssistantToggleProps> = ({ isVisible, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 left-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        isVisible 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white animate-bounce'
      }`}
      title={isVisible ? 'Hide AI Assistant' : 'Show AI Assistant'}
    >
      {isVisible ? (
        <BotMessageSquare className="h-6 w-6" />
      ) : (
        <Bot className="h-6 w-6" />
      )}
      
      {!isVisible && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
        </div>
      )}
    </button>
  );
};

export default AssistantToggle;