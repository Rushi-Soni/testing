import React from 'react';
import { ChevronRight, Clock, Target, Zap } from 'lucide-react';

interface TopicCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Professor';
  estimatedTime: string;
  concepts: string[];
  isActive: boolean;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  description,
  difficulty,
  estimatedTime,
  concepts,
  isActive,
  onClick
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
      case 'Professor': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl' 
          : 'hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <ChevronRight className={`h-5 w-5 transition-transform ${
            isActive ? 'rotate-90 text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
          }`} />
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor()}`}>
            {difficulty}
          </span>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="h-3 w-3" />
            <span>{estimatedTime}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Target className="h-4 w-4 text-blue-600" />
            <span>Python Concepts:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {concepts.slice(0, 4).map((concept, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
              >
                {concept}
              </span>
            ))}
            {concepts.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium">
                +{concepts.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        {isActive && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Zap className="h-4 w-4" />
              <span>Currently Active - Ready for Deep Python Learning!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;