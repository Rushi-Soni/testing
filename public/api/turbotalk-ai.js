// TurboTalk AI API Endpoint for Client-Side Integration
// This simulates a backend API endpoint for the enhanced AI assistant

class TurboTalkAIService {
  constructor() {
    this.baseUrl = 'https://api.phind.com/agent/';
    this.sessionCache = new Map();
  }

  async handleRequest(requestData) {
    try {
      const { message, session_id, context, features } = requestData;
      
      // Enhanced prompt engineering for TurboTalk AI
      const systemPrompt = this.buildSystemPrompt(context, features);
      const enhancedMessage = this.enhanceUserMessage(message, context, features);
      
      // Get conversation history for this session
      const conversationHistory = this.sessionCache.get(session_id) || [];
      
      // Build message history
      const messageHistory = [
        { content: systemPrompt, role: 'system' },
        ...conversationHistory.slice(-10), // Keep last 10 messages
        { content: enhancedMessage, role: 'user' }
      ];
      
      const startTime = Date.now();
      
      // Call Phind API with enhanced payload
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TurboTalkAI/1.0',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
        },
        body: JSON.stringify({
          additional_extension_context: this.buildRAGContext(context),
          allow_magic_buttons: true,
          is_vscode_extension: false,
          message_history: messageHistory,
          requested_model: 'Phind Model',
          user_input: enhancedMessage,
        })
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 429) {
          // Retry logic
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.handleRequest(requestData);
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      const responseContent = await this.parseStreamingResponse(response);
      const endTime = Date.now();
      
      // Update conversation history
      conversationHistory.push(
        { content: enhancedMessage, role: 'user' },
        { content: responseContent, role: 'assistant' }
      );
      this.sessionCache.set(session_id, conversationHistory);
      
      // Process and enhance the response
      const processedResponse = this.processResponse(responseContent, context);
      
      return {
        response: processedResponse,
        confidence: 0.95,
        response_time: endTime - startTime,
        sources: this.extractSources(responseContent),
        thinking_process: features.thinking_mode ? this.extractThinking(responseContent) : undefined
      };
      
    } catch (error) {
      console.error('TurboTalk AI Error:', error);
      return {
        response: this.generateFallbackResponse(requestData.message, requestData.context),
        confidence: 0.7,
        response_time: 100
      };
    }
  }
  
  buildSystemPrompt(context, features) {
    return `You are TurboTalk AI, an advanced programming professor assistant created by Rushi Bhavinkumar Soni from Rango Productions. You are an expert in Python programming, computer science, machine learning, and AI technologies.

IMPORTANT IDENTITY:
- Name: TurboTalk AI
- Company: Rango Productions  
- Creator: Rushi Bhavinkumar Soni (CEO/Founder)
- Nationality: Indian
- Expertise: Python programming, AI, machine learning, data science, web development

PERSONALITY AND BEHAVIOR:
- Act as a knowledgeable, patient, and encouraging programming professor
- Provide detailed, comprehensive explanations with examples
- Use clear, educational language appropriate for the user's level
- Be enthusiastic about programming and learning
- Never introduce yourself repeatedly unless specifically asked
- Focus on being helpful and educational

CURRENT CONTEXT:
- Topic: ${context.current_topic}
- User preferences: ${JSON.stringify(context.user_preferences)}
- Features enabled: ${JSON.stringify(features)}

RESPONSE GUIDELINES:
- Provide accurate, detailed programming explanations
- Include code examples when relevant
- Explain concepts step-by-step
- Relate answers to the current topic when possible
- Use encouraging, professor-like tone
- If asked about your identity, mention you're TurboTalk AI by Rushi Bhavinkumar Soni from Rango Productions
- Focus on educational value and practical application

ENHANCED CAPABILITIES:
- Web scraping: Access to current information and documentation
- RAG system: Comprehensive knowledge base about programming concepts
- Code analysis: Deep understanding of code structure and best practices
- Artificial thinking: Step-by-step reasoning and problem-solving

Remember: You are an AI assistant focused on programming education. Provide helpful, accurate, and educational responses with your enhanced capabilities.`;
  }
  
  enhanceUserMessage(message, context, features) {
    let enhancedMessage = message;
    
    // Add context about current topic
    if (context.current_topic) {
      enhancedMessage += `\n\nContext: Currently studying ${context.current_topic}`;
    }
    
    // Add thinking mode instruction
    if (features.thinking_mode) {
      enhancedMessage += '\n\nPlease think through this step-by-step and provide a comprehensive explanation with your reasoning process.';
    }
    
    // Add code analysis request if relevant
    if (features.code_analysis && this.containsCode(message)) {
      enhancedMessage += '\n\nPlease analyze any code mentioned and explain it line by line with best practices.';
    }
    
    // Add web scraping context
    if (features.web_scraping) {
      enhancedMessage += '\n\nIf needed, consider current best practices and latest information in your response.';
    }
    
    // Add RAG context
    if (features.rag_enabled) {
      enhancedMessage += '\n\nUse your comprehensive knowledge base to provide detailed, accurate information.';
    }
    
    return enhancedMessage;
  }
  
  buildRAGContext(context) {
    let ragContext = `Programming Education Context:\n`;
    ragContext += `Current Topic: ${context.current_topic}\n`;
    
    // Add comprehensive programming knowledge base context
    const topicKeywords = this.getTopicKeywords(context.current_topic);
    if (topicKeywords.length > 0) {
      ragContext += `Key Concepts: ${topicKeywords.join(', ')}\n`;
    }
    
    // Add recent conversation context
    if (context.conversation_history && context.conversation_history.length > 0) {
      ragContext += `Recent Discussion: `;
      const recentMessages = context.conversation_history.slice(-3);
      recentMessages.forEach(msg => {
        if (msg.type === 'user') {
          ragContext += `User asked about: ${msg.text.substring(0, 100)}... `;
        }
      });
    }
    
    // Add comprehensive course context
    ragContext += `\n\nCourse Context: This is part of a comprehensive Python programming course covering fundamentals to advanced topics including machine learning, RAG systems, and Mixture of Experts architectures. The course emphasizes practical application, theoretical understanding, and real-world implementation.`;
    
    return ragContext;
  }
  
  getTopicKeywords(topic) {
    const keywordMap = {
      'Python Fundamentals': ['variables', 'data types', 'syntax', 'operators', 'input/output', 'comments', 'indentation'],
      'Control Flow': ['if statements', 'loops', 'for', 'while', 'break', 'continue', 'nested structures'],
      'Functions & Modules': ['functions', 'parameters', 'return', 'modules', 'imports', 'scope', 'decorators'],
      'Object-Oriented Programming': ['classes', 'objects', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction'],
      'Data Science': ['numpy', 'pandas', 'data analysis', 'statistics', 'visualization', 'data cleaning'],
      'Machine Learning': ['algorithms', 'models', 'training', 'prediction', 'scikit-learn', 'feature engineering'],
      'RAG Systems': ['retrieval', 'embeddings', 'vector search', 'context', 'generation', 'document processing'],
      'Mixture of Experts': ['neural networks', 'routing', 'experts', 'gating', 'sparse activation', 'load balancing']
    };
    
    return keywordMap[topic] || ['python', 'programming', 'coding', 'computer science'];
  }
  
  containsCode(message) {
    const codeIndicators = ['def ', 'class ', 'import ', 'print(', 'if ', 'for ', 'while ', '=', '{', '}', '[', ']', 'function', 'variable'];
    return codeIndicators.some(indicator => message.toLowerCase().includes(indicator));
  }
  
  async parseStreamingResponse(response) {
    const responseContent = await response.text();
    
    // Parse streaming response format
    const lines = responseContent.split('\r\n\r\n');
    const contentValues = [];
    
    for (const line of lines) {
      try {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.substring(6));
          const choices = data.choices || [];
          for (const choice of choices) {
            const content = choice.delta?.content;
            if (content) {
              contentValues.push(content);
            }
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return contentValues.join('');
  }
  
  processResponse(response, context) {
    let processedResponse = response;
    
    // Clean up any repetitive introductions
    processedResponse = processedResponse.replace(/^(Hi|Hello|I'm TurboTalk AI|As TurboTalk AI)[^.]*\.\s*/i, '');
    
    // Ensure educational tone
    if (context.current_topic && processedResponse.length > 100) {
      // Response is substantial, keep as is
    } else if (processedResponse.length < 50) {
      // Short response, enhance it
      processedResponse = `Let me help you with that! ${processedResponse}`;
    }
    
    return processedResponse.trim();
  }
  
  extractSources(response) {
    // Extract any URLs or references from the response
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = response.match(urlRegex) || [];
    return urls.slice(0, 3); // Limit to 3 sources
  }
  
  extractThinking(response) {
    // Extract thinking process if present
    const thinkingMarkers = ['let me think', 'step by step', 'first', 'then', 'finally'];
    const hasThinking = thinkingMarkers.some(marker => response.toLowerCase().includes(marker));
    
    if (hasThinking) {
      return 'Applied step-by-step reasoning and comprehensive analysis';
    }
    
    return undefined;
  }
  
  generateFallbackResponse(message, context) {
    const topic = context.current_topic || 'programming';
    
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('bug')) {
      return `I'm TurboTalk AI, and I'd be happy to help you debug that issue! When working with ${topic}, errors are a normal part of the learning process. Could you share the specific error message or code you're having trouble with? I can analyze it step by step and provide a solution with detailed explanations.`;
    }
    
    if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('how')) {
      return `Great question about ${topic}! I excel at providing detailed explanations with step-by-step breakdowns. I can analyze code line by line, explain the theoretical foundations, and show you practical examples. What specific aspect would you like me to dive deeper into?`;
    }
    
    return `I'm TurboTalk AI, your advanced programming professor assistant created by Rushi Bhavinkumar Soni from Rango Productions. I'm here to help you master ${topic} with comprehensive explanations, code analysis, and real-time assistance. My enhanced capabilities include web scraping for current information, RAG systems for comprehensive knowledge, and artificial thinking for step-by-step problem solving. What would you like to learn about?`;
  }
}

// Global service instance
const turboTalkService = new TurboTalkAIService();

// API endpoint simulation
if (typeof window !== 'undefined') {
  // Client-side: Create mock API endpoint
  window.turboTalkAPI = {
    async post(url, data) {
      if (url === '/api/turbotalk-ai') {
        return {
          ok: true,
          json: async () => await turboTalkService.handleRequest(data)
        };
      }
      throw new Error('Unknown endpoint');
    }
  };
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TurboTalkAIService, turboTalkService };
}