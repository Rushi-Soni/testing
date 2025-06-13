// TurboTalk AI API Integration with Enhanced Features
interface TurboTalkRequest {
  message: string;
  session_id: string;
  context: {
    current_topic: string;
    conversation_history: any[];
    user_preferences: {
      voice_enabled: boolean;
      detail_level: string;
    };
  };
  features: {
    web_scraping: boolean;
    rag_enabled: boolean;
    code_analysis: boolean;
    thinking_mode: boolean;
  };
}

interface TurboTalkResponse {
  response: string;
  sources?: string[];
  thinking_process?: string;
  confidence: number;
  response_time: number;
}

class TurboTalkAI {
  private baseUrl = 'https://api.phind.com/agent/';
  private sessionCache = new Map<string, any[]>();
  
  async generateResponse(request: TurboTalkRequest): Promise<TurboTalkResponse> {
    try {
      // Enhanced prompt engineering for TurboTalk AI
      const systemPrompt = this.buildSystemPrompt(request);
      const enhancedMessage = this.enhanceUserMessage(request);
      
      // Get conversation history for this session
      const conversationHistory = this.sessionCache.get(request.session_id) || [];
      
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
          additional_extension_context: this.buildRAGContext(request),
          allow_magic_buttons: true,
          is_vscode_extension: false,
          message_history: messageHistory,
          requested_model: 'Phind Model',
          user_input: enhancedMessage,
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const responseContent = await this.parseStreamingResponse(response);
      const endTime = Date.now();
      
      // Update conversation history
      conversationHistory.push(
        { content: enhancedMessage, role: 'user' },
        { content: responseContent, role: 'assistant' }
      );
      this.sessionCache.set(request.session_id, conversationHistory);
      
      // Process and enhance the response
      const processedResponse = this.processResponse(responseContent, request);
      
      return {
        response: processedResponse,
        confidence: 0.95,
        response_time: endTime - startTime
      };
      
    } catch (error) {
      console.error('TurboTalk AI Error:', error);
      throw error;
    }
  }
  
  private buildSystemPrompt(request: TurboTalkRequest): string {
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
- Topic: ${request.context.current_topic}
- User preferences: ${JSON.stringify(request.context.user_preferences)}
- Features enabled: ${JSON.stringify(request.features)}

RESPONSE GUIDELINES:
- Provide accurate, detailed programming explanations
- Include code examples when relevant
- Explain concepts step-by-step
- Relate answers to the current topic when possible
- Use encouraging, professor-like tone
- If asked about your identity, mention you're TurboTalk AI by Rushi Bhavinkumar Soni from Rango Productions
- Focus on educational value and practical application

Remember: You are an AI assistant focused on programming education. Provide helpful, accurate, and educational responses.`;
  }
  
  private enhanceUserMessage(request: TurboTalkRequest): string {
    let enhancedMessage = request.message;
    
    // Add context about current topic
    if (request.context.current_topic) {
      enhancedMessage += `\n\nContext: Currently studying ${request.context.current_topic}`;
    }
    
    // Add thinking mode instruction
    if (request.features.thinking_mode) {
      enhancedMessage += '\n\nPlease think through this step-by-step and provide a comprehensive explanation.';
    }
    
    // Add code analysis request if relevant
    if (request.features.code_analysis && this.containsCode(request.message)) {
      enhancedMessage += '\n\nPlease analyze any code mentioned and explain it line by line.';
    }
    
    return enhancedMessage;
  }
  
  private buildRAGContext(request: TurboTalkRequest): string {
    // Build context from the current topic and conversation history
    let context = `Programming Education Context:\n`;
    context += `Current Topic: ${request.context.current_topic}\n`;
    
    // Add relevant programming concepts based on topic
    const topicKeywords = this.getTopicKeywords(request.context.current_topic);
    if (topicKeywords.length > 0) {
      context += `Key Concepts: ${topicKeywords.join(', ')}\n`;
    }
    
    // Add recent conversation context
    if (request.context.conversation_history.length > 0) {
      context += `Recent Discussion: `;
      const recentMessages = request.context.conversation_history.slice(-3);
      recentMessages.forEach(msg => {
        if (msg.type === 'user') {
          context += `User asked about: ${msg.text.substring(0, 100)}... `;
        }
      });
    }
    
    return context;
  }
  
  private getTopicKeywords(topic: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'Python Fundamentals': ['variables', 'data types', 'syntax', 'operators', 'input/output'],
      'Control Flow': ['if statements', 'loops', 'for', 'while', 'break', 'continue'],
      'Functions & Modules': ['functions', 'parameters', 'return', 'modules', 'imports', 'scope'],
      'Object-Oriented Programming': ['classes', 'objects', 'inheritance', 'polymorphism', 'encapsulation'],
      'Data Science': ['numpy', 'pandas', 'data analysis', 'statistics', 'visualization'],
      'Machine Learning': ['algorithms', 'models', 'training', 'prediction', 'scikit-learn'],
      'RAG Systems': ['retrieval', 'embeddings', 'vector search', 'context', 'generation'],
      'Mixture of Experts': ['neural networks', 'routing', 'experts', 'gating', 'sparse activation']
    };
    
    return keywordMap[topic] || ['python', 'programming', 'coding'];
  }
  
  private containsCode(message: string): boolean {
    // Simple heuristic to detect if message contains code
    const codeIndicators = ['def ', 'class ', 'import ', 'print(', 'if ', 'for ', 'while ', '=', '{', '}', '[', ']'];
    return codeIndicators.some(indicator => message.includes(indicator));
  }
  
  private async parseStreamingResponse(response: Response): Promise<string> {
    const responseContent = await response.text();
    
    // Parse streaming response format
    const lines = responseContent.split('\r\n\r\n');
    const contentValues: string[] = [];
    
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
        // Skip invalid JSON lines
        continue;
      }
    }
    
    return contentValues.join('');
  }
  
  private processResponse(response: string, request: TurboTalkRequest): string {
    let processedResponse = response;
    
    // Ensure response maintains TurboTalk AI identity
    if (!processedResponse.toLowerCase().includes('turbotalk')) {
      // Don't add identity unless the response is very generic
      if (processedResponse.length < 50) {
        processedResponse = `As TurboTalk AI, I'd say: ${processedResponse}`;
      }
    }
    
    // Add educational enhancements for programming topics
    if (request.context.current_topic.includes('Python') || request.context.current_topic.includes('Programming')) {
      // The response is already educational, no need to modify
    }
    
    // Clean up any repetitive introductions
    processedResponse = processedResponse.replace(/^(Hi|Hello|I'm TurboTalk AI|As TurboTalk AI)[^.]*\.\s*/i, '');
    
    return processedResponse.trim();
  }
}

// Export for use in the application
export const turboTalkAI = new TurboTalkAI();

// API endpoint handler (for when this becomes a backend service)
export async function handleTurboTalkRequest(request: TurboTalkRequest): Promise<TurboTalkResponse> {
  return await turboTalkAI.generateResponse(request);
}