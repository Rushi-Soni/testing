import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, MessageCircle, X, Minimize2, Maximize2, Send, Mic, MicOff } from 'lucide-react';

interface AIAssistantProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  isTyping?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isVisible, onToggle }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [animationState, setAnimationState] = useState<'idle' | 'speaking' | 'thinking' | 'excited'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Generate unique session ID for this user/tab
  const sessionId = useRef(Math.random().toString(36).substring(2, 15));

  // Initialize voices and speech recognition
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      setSelectedVoice(preferredVoice);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      const welcomeMessage = "Hello! I'm TurboTalk AI, your advanced programming professor assistant created by Rushi Bhavinkumar Soni from Rango Productions. I'm here to help you master Python programming with detailed explanations, code analysis, and real-time assistance. Ask me anything about the topics you're studying!";
      addMessage(welcomeMessage, 'assistant');
      if (voiceEnabled) {
        speakText(welcomeMessage);
      }
    }
  }, [isVisible]);

  const addMessage = (text: string, type: 'user' | 'assistant', isTyping = false) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text,
      timestamp: new Date(),
      type,
      isTyping
    };
    setMessages(prev => [...prev.slice(-9), newMessage]); // Keep last 10 messages
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !selectedVoice) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAnimationState('speaking');
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAnimationState('idle');
      setCurrentText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAnimationState('idle');
      setCurrentText('');
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setAnimationState('idle');
    setCurrentText('');
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  // Enhanced AI response with web scraping and RAG
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setAnimationState('thinking');
      
      // Simulate API call to TurboTalk AI with enhanced features
      const response = await fetch('/api/turbotalk-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId.current,
          context: {
            current_topic: getCurrentTopic(),
            conversation_history: messages.slice(-5),
            user_preferences: {
              voice_enabled: voiceEnabled,
              detail_level: 'comprehensive'
            }
          },
          features: {
            web_scraping: true,
            rag_enabled: true,
            code_analysis: true,
            thinking_mode: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response || generateFallbackResponse(userMessage);
    } catch (error) {
      console.error('AI API Error:', error);
      return generateFallbackResponse(userMessage);
    }
  };

  const getCurrentTopic = () => {
    // Extract current topic from URL or page context
    const path = window.location.pathname;
    if (path.includes('python-basics')) return 'Python Fundamentals';
    if (path.includes('control-structures')) return 'Control Flow';
    if (path.includes('functions-modules')) return 'Functions & Modules';
    if (path.includes('oop-advanced')) return 'Object-Oriented Programming';
    if (path.includes('data-science')) return 'Data Science';
    if (path.includes('machine-learning')) return 'Machine Learning';
    if (path.includes('rag-systems')) return 'RAG Systems';
    if (path.includes('moe-architecture')) return 'Mixture of Experts';
    return 'General Python Programming';
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Enhanced fallback responses with more intelligence
    if (message.includes('python') || message.includes('code')) {
      return "I'm TurboTalk AI, and I'd be happy to help you with Python programming! As your AI professor assistant, I can explain concepts, analyze code, and provide detailed guidance. What specific Python topic would you like to explore?";
    }
    
    if (message.includes('explain') || message.includes('how')) {
      return "I excel at providing detailed explanations! I can break down complex programming concepts into easy-to-understand steps, analyze code line by line, and help you understand the theoretical foundations. What would you like me to explain?";
    }
    
    if (message.includes('help') || message.includes('assist')) {
      return "I'm here to provide comprehensive assistance with your Python learning journey! I can help with code analysis, concept explanations, debugging, best practices, and advanced topics like machine learning and AI. How can I assist you today?";
    }
    
    if (message.includes('error') || message.includes('bug')) {
      return "I can help you debug and fix errors! Share your code with me, and I'll analyze it step by step, identify the issue, and provide a solution with detailed explanations of why the error occurred and how to prevent it in the future.";
    }
    
    return "I'm TurboTalk AI, your advanced programming professor assistant. I'm equipped with web scraping capabilities, RAG (Retrieval-Augmented Generation) technology, and comprehensive Python knowledge. I can help you with any programming question, from basic syntax to advanced AI concepts. What would you like to learn about?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    addMessage(userMessage, 'user');
    
    // Show typing indicator
    setIsLoading(true);
    const typingMessage = addMessage('Thinking...', 'assistant', true);
    
    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage);
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage(aiResponse, 'assistant');
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakText(aiResponse);
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage("I apologize, but I'm having trouble processing your request right now. Please try again.", 'assistant');
    } finally {
      setIsLoading(false);
      setAnimationState('idle');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Listen for clicks on code blocks and explanations
  useEffect(() => {
    const handleElementClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      if (target.closest('.bg-gray-900') || target.closest('.bg-blue-50') || target.closest('.bg-purple-50')) {
        setAnimationState('thinking');
        
        setTimeout(() => {
          let explanationText = '';
          
          if (target.closest('.bg-gray-900')) {
            explanationText = "I see you're looking at a code block! This is Python source code. Let me explain what each line does and the concepts involved. Would you like me to analyze this code step by step?";
          } else if (target.closest('.bg-blue-50')) {
            explanationText = "Great! You're reading the line-by-line analysis. This detailed breakdown helps you understand exactly what each Python statement accomplishes. Do you have questions about any specific line?";
          } else if (target.closest('.bg-purple-50')) {
            explanationText = "Excellent! You're exploring the theoretical foundation. Understanding the computer science principles behind the code makes you a better programmer. Would you like me to dive deeper into any concept?";
          }
          
          if (explanationText) {
            addMessage(explanationText, 'assistant');
            if (voiceEnabled) {
              speakText(explanationText);
            }
          }
        }, 1000);
      }
    };

    document.addEventListener('click', handleElementClick);
    return () => document.removeEventListener('click', handleElementClick);
  }, [voiceEnabled]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'}`}>
      {/* Main Assistant Container */}
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Animated Avatar */}
            <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ${
              animationState === 'speaking' ? 'animate-pulse scale-110' :
              animationState === 'thinking' ? 'animate-bounce' :
              animationState === 'excited' ? 'animate-spin' : ''
            }`}>
              <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                animationState === 'speaking' ? 'bg-green-400' :
                animationState === 'thinking' ? 'bg-yellow-400' :
                animationState === 'excited' ? 'bg-purple-400' : 'bg-blue-400'
              }`}>
                <div className="flex justify-center items-center h-full">
                  <div className={`flex gap-1 transition-all duration-200 ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm">TurboTalk AI</h3>
              <p className="text-xs opacity-90">
                {animationState === 'speaking' ? 'Speaking...' :
                 animationState === 'thinking' ? 'Analyzing...' :
                 animationState === 'excited' ? 'Excited to help!' : 'Ready to assist'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleVoice}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Stop speaking"
              >
                <Pause className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {currentText && (
                <div className="bg-blue-100 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-700">Currently speaking...</span>
                  </div>
                  <p className="text-sm text-blue-800">{currentText}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about Python programming..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    disabled={isLoading}
                  />
                  {recognitionRef.current && (
                    <button
                      onClick={toggleListening}
                      className={`absolute right-2 top-2 p-1 rounded transition-colors ${
                        isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  {isLoading ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {availableVoices.length > 1 && (
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice || null);
                  }}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button when minimized */}
      {isMinimized && (
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ${
            animationState === 'speaking' ? 'animate-pulse' : ''
          }`}>
            <div className={`w-4 h-4 rounded-full ${
              animationState === 'speaking' ? 'bg-green-400' :
              animationState === 'thinking' ? 'bg-yellow-400' :
              'bg-blue-400'
            }`}>
              <div className="flex justify-center items-center h-full">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;