#!/usr/bin/env python3
"""
Enhanced TurboTalk AI Runner v1.3.0 - Clean Output Edition
Model: TurboTalk AI v1.3.0 with Enhanced Search and Clean Responses
Company: Rango Productions
Created by: Rushi Bhavinkumar Soni (CEO/Founder)
Nationality: Indian
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, GPT2LMHeadModel, GPT2Tokenizer
import json
import os
from datetime import datetime
import time
import random
import wikipedia
import warnings
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

warnings.filterwarnings("ignore")
wikipedia.set_lang("en")

MODEL_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\turbotalk_v1.2.6_backup_20250608_172624"
TEMPLATES_PATH = "templates.json"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

class SearchDecision(Enum):
    NO_SEARCH = "no_search"
    WIKI_ONLY = "wiki_only"
    WEB_ONLY = "web_only"
    BOTH = "both"

class ThinkingMode(Enum):
    ANALYTICAL = "analytical"
    CREATIVE = "creative"
    STRATEGIC = "strategic"
    EMPATHETIC = "empathetic"
    CRITICAL = "critical"
    SYNTHESIS = "synthesis"

@dataclass
class SourceInfo:
    source_type: str
    title: str
    content: str
    url: Optional[str] = None
    reliability_score: float = 0.8
    relevance_score: float = 0.0

@dataclass
class ThoughtProcess:
    thinking_mode: ThinkingMode
    search_decision: SearchDecision
    sources_used: List[SourceInfo]
    confidence_level: float
    reasoning_steps: List[str]
    temperature: float = 0.7

class EnhancedSearchEngine:
    """Enhanced search engine with better content filtering"""
    
    def __init__(self):
        self.search_triggers = {
            "factual": ["what is", "who is", "when", "where", "define", "explain", "how does", "tell me about"],
            "current": ["latest", "recent", "current", "new", "today", "2024", "2025", "now", "breaking"],
            "research": ["compare", "analysis", "study", "research", "data", "statistics", "findings"],
            "complex": ["relationship", "implications", "impact", "effects", "consequences", "why"],
            "technical": ["quantum", "AI", "technology", "science", "engineering", "medical", "algorithm"]
        }
        
        self.quality_keywords = [
            "official", "research", "study", "analysis", "report", "data", "statistics",
            "expert", "professor", "scientist", "university", "institute", "journal"
        ]
    
    def should_search(self, query: str) -> Tuple[SearchDecision, str]:
        """Enhanced search decision logic"""
        query_lower = query.lower()
        
        # Skip search only for very basic interactions
        basic_patterns = ["hello", "hi", "thanks", "goodbye", "how are you", "good morning", "good evening"]
        if any(pattern == query_lower.strip() for pattern in basic_patterns):
            return SearchDecision.NO_SEARCH, "Basic greeting"
        
        # Always search for factual questions
        factual_triggers = [
            "who is", "who was", "what is", "what was", "where is", "where was", 
            "when did", "when was", "how did", "how does", "tell me about",
            "explain", "describe", "define", "meaning of"
        ]
        
        if any(trigger in query_lower for trigger in factual_triggers):
            if any(word in query_lower for word in ["latest", "recent", "current", "today", "now", "2024", "2025"]):
                return SearchDecision.BOTH, "Current factual information needed"
            else:
                return SearchDecision.BOTH, "Comprehensive factual information needed"
        
        # Enhanced current events detection
        current_indicators = ["latest", "recent", "current", "new", "today", "now", "breaking", "update"]
        if any(word in query_lower for word in current_indicators):
            return SearchDecision.WEB_ONLY, "Current information needed"
        
        # Research and analysis queries
        if any(word in query_lower for word in ["compare", "analysis", "difference", "versus", "vs", "research"]):
            return SearchDecision.BOTH, "Comprehensive research needed"
        
        # Default to search for substantial queries
        if len(query.split()) >= 3:
            return SearchDecision.WIKI_ONLY, "General information search"
        
        return SearchDecision.NO_SEARCH, "Simple query"

class EnhancedResearcher:
    """Enhanced researcher with better content quality"""
    
    def __init__(self):
        self.search_engine = EnhancedSearchEngine()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def calculate_relevance_score(self, content: str, query: str) -> float:
        """Calculate content relevance to query"""
        query_words = set(query.lower().split())
        content_words = set(content.lower().split())
        
        # Basic word overlap
        overlap = len(query_words.intersection(content_words))
        relevance = overlap / len(query_words) if query_words else 0
        
        # Boost for quality indicators
        quality_boost = 0
        for keyword in self.search_engine.quality_keywords:
            if keyword in content.lower():
                quality_boost += 0.1
        
        return min(1.0, relevance + quality_boost)
    
    def search_wikipedia(self, query: str, max_sources: int = 3) -> List[SourceInfo]:
        """Enhanced Wikipedia search with relevance scoring"""
        sources = []
        try:
            print(f"📖 Searching Wikipedia for best sources...", end=" ")
            search_results = wikipedia.search(query, results=max_sources * 2)  # Get more to filter
            
            candidates = []
            for title in search_results:
                try:
                    summary = wikipedia.summary(title, sentences=4, auto_suggest=True)
                    if summary and len(summary) > 100:
                        relevance = self.calculate_relevance_score(summary, query)
                        candidates.append({
                            'title': title,
                            'content': summary.replace('\n', ' ').strip(),
                            'relevance': relevance
                        })
                except:
                    continue
            
            # Sort by relevance and take best ones
            candidates.sort(key=lambda x: x['relevance'], reverse=True)
            
            for candidate in candidates[:max_sources]:
                sources.append(SourceInfo(
                    source_type="wikipedia",
                    title=candidate['title'],
                    content=candidate['content'],
                    url=f"https://en.wikipedia.org/wiki/{candidate['title'].replace(' ', '_')}",
                    reliability_score=0.9,
                    relevance_score=candidate['relevance']
                ))
            
            print(f"✓ Found {len(sources)} high-quality sources")
            return sources
        except Exception as e:
            print(f"✗ Error: {str(e)[:30]}")
            return []
    
    def search_web_enhanced(self, query: str, max_sources: int = 3) -> List[SourceInfo]:
        """Enhanced web search with better content extraction"""
        sources = []
        try:
            print(f"🌐 Searching web for latest information...", end=" ")
            
            # Multiple search strategies
            search_queries = [
                query,
                f"{query} 2024 2025",
                f"{query} latest research",
                f"{query} official report"
            ]
            
            all_candidates = []
            
            for search_query in search_queries[:2]:  # Limit to avoid rate limiting
                try:
                    search_url = f"https://www.google.com/search?q={quote(search_query)}&num=10"
                    response = self.session.get(search_url, timeout=8)
                    
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Enhanced content extraction
                        content_selectors = [
                            'div[data-content-feature="1"]',
                            'div.BNeawe.aCOpRe',
                            'div.BNeawe.s3v9rd',
                            'span.aCOpRe',
                            'div.VwiC3b'
                        ]
                        
                        for selector in content_selectors:
                            elements = soup.select(selector)
                            for element in elements:
                                text = element.get_text().strip()
                                if 150 < len(text) < 500 and not any(skip in text.lower() for skip in ['cookie', 'privacy', 'sign in']):
                                    relevance = self.calculate_relevance_score(text, query)
                                    if relevance > 0.2:  # Only keep relevant content
                                        all_candidates.append({
                                            'content': text,
                                            'relevance': relevance,
                                            'query': search_query
                                        })
                    
                    time.sleep(1)  # Rate limiting
                except:
                    continue
            
            # Sort by relevance and remove duplicates
            seen_content = set()
            unique_candidates = []
            
            for candidate in sorted(all_candidates, key=lambda x: x['relevance'], reverse=True):
                content_hash = hash(candidate['content'][:100])
                if content_hash not in seen_content:
                    seen_content.add(content_hash)
                    unique_candidates.append(candidate)
            
            # Take best candidates
            for candidate in unique_candidates[:max_sources]:
                sources.append(SourceInfo(
                    source_type="web",
                    title=f"Web Source ({candidate['query']})",
                    content=candidate['content'],
                    reliability_score=0.75,
                    relevance_score=candidate['relevance']
                ))
            
            print(f"✓ Found {len(sources)} relevant sources")
            return sources
            
        except Exception as e:
            print(f"✗ Error: {str(e)[:30]}")
            return []
    
    def research(self, query: str) -> Tuple[List[SourceInfo], SearchDecision]:
        """Enhanced research with parallel processing"""
        search_decision, reason = self.search_engine.should_search(query)
        print(f"🤔 Search Decision: {search_decision.value} ({reason})")
        
        sources = []
        
        if search_decision == SearchDecision.NO_SEARCH:
            return sources, search_decision
        
        # Use parallel processing for faster research
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = []
            
            if search_decision in [SearchDecision.WIKI_ONLY, SearchDecision.BOTH]:
                futures.append(executor.submit(self.search_wikipedia, query, 3))
            
            if search_decision in [SearchDecision.WEB_ONLY, SearchDecision.BOTH]:
                futures.append(executor.submit(self.search_web_enhanced, query, 3))
            
            for future in as_completed(futures):
                try:
                    result = future.result(timeout=15)
                    sources.extend(result)
                except:
                    continue
        
        # Sort all sources by relevance
        sources.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return sources[:5], search_decision  # Limit to top 5 sources

class TurboTalkAI:
    """Enhanced TurboTalk AI with clean output"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.researcher = EnhancedResearcher()
        self.conversation_history = []
        self.thinking_history = []
        self.research_enabled = True
        self.advanced_thinking = True
        
        # AI Identity
        self.ai_identity = {
            "name": "TurboTalk AI",
            "version": "1.3.0",
            "company": "Rango Productions",
            "creator": "Rushi Bhavinkumar Soni",
            "nationality": "Indian"
        }
    
    def load_model(self):
        """Load model efficiently"""
        print("🚀 Loading Enhanced TurboTalk AI...")
        print(f"📱 Device: {DEVICE}")
        
        if not os.path.exists(MODEL_PATH):
            print(f"❌ Model path not found: {MODEL_PATH}")
            return False
        
        try:
            # Load tokenizer
            print("📝 Loading tokenizer...")
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
            except:
                self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
            
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model
            print("🧠 Loading model...")
            try:
                self.model = AutoModelForCausalLM.from_pretrained(
                    MODEL_PATH, 
                    local_files_only=True, 
                    torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32
                )
            except:
                self.model = GPT2LMHeadModel.from_pretrained(
                    MODEL_PATH, 
                    local_files_only=True, 
                    torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32
                )
            
            self.model.to(DEVICE)
            self.model.eval()
            
            print("✅ Enhanced TurboTalk AI loaded successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Loading failed: {e}")
            return False
    
    def generate_response(self, prompt: str, temperature: float = 0.7) -> str:
        """Generate enhanced response with clean output"""
        try:
            # Research phase
            sources = []
            search_decision = SearchDecision.NO_SEARCH
            
            if self.research_enabled:
                sources, search_decision = self.researcher.research(prompt)
            
            # Build enhanced prompt with research
            system_parts = [
                f"You are {self.ai_identity['name']} v{self.ai_identity['version']}, an advanced AI assistant.",
                "Provide clear, accurate, and comprehensive responses."
            ]
            
            if sources:
                system_parts.append("Use the following research information to enhance your response:")
                for i, source in enumerate(sources[:3], 1):
                    system_parts.append(f"Source {i} [{source.source_type}]: {source.content}")
            
            system_parts.append("Provide a well-structured, informative response.")
            
            system_prompt = " ".join(system_parts)
            full_prompt = f"{system_prompt}\n\nUser: {prompt}\nTurboTalk AI:"
            
            # Generate response
            inputs = self.tokenizer.encode(full_prompt, return_tensors="pt", max_length=1000, truncation=True)
            inputs = inputs.to(DEVICE)
            
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=inputs.shape[1] + 250,
                    temperature=temperature,
                    top_p=0.9,
                    top_k=50,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    repetition_penalty=1.1
                )
            
            # Extract and clean response
            full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            if "TurboTalk AI:" in full_response:
                response = full_response.split("TurboTalk AI:")[-1].strip()
            else:
                input_text = self.tokenizer.decode(inputs[0], skip_special_tokens=True)
                response = full_response[len(input_text):].strip()
            
            # Clean response
            response = self.clean_response(response)
            
            # Format final output with metadata
            final_output = self.format_final_response(response, sources, temperature, search_decision)
            
            return final_output
            
        except Exception as e:
            print(f"❌ Generation error: {e}")
            return "TurboTalk AI: I apologize, but I encountered an error. Please try rephrasing your question."
    
    def clean_response(self, response: str) -> str:
        """Enhanced response cleaning"""
        if not response or len(response) < 10:
            return "I understand your question and will provide a comprehensive response based on available information."
        
        # Remove AI self-references and redundant phrases
        patterns_to_remove = [
            r'\b(I\'m TurboTalk AI|As an AI|TurboTalk AI:|As TurboTalk AI)\b',
            r'\b(I am an AI|I\'m an artificial intelligence)\b',
            r'\b(Based on my training|In my knowledge base)\b'
        ]
        
        for pattern in patterns_to_remove:
            response = re.sub(pattern, '', response, flags=re.IGNORECASE)
        
        # Clean whitespace and formatting
        response = re.sub(r'\s+', ' ', response).strip()
        
        # Ensure proper sentence ending
        if response and not response.endswith(('.', '!', '?')):
            sentences = re.split(r'[.!?]+', response)
            if len(sentences) > 1:
                response = '. '.join(sentences[:-1]) + '.'
            else:
                response += '.'
        
        # Capitalize first letter
        if response and response[0].islower():
            response = response[0].upper() + response[1:]
        
        return response
    
    def format_final_response(self, response: str, sources: List[SourceInfo], temperature: float, search_decision: SearchDecision) -> str:
        """Format the final response with metadata"""
        output = f"TurboTalk AI: {response}"
        
        # Add metadata section
        if sources or search_decision != SearchDecision.NO_SEARCH:
            output += "\n\n" + "─" * 50
            output += f"\n📊 Response Metadata:"
            output += f"\n🌡️  Temperature: {temperature}"
            output += f"\n🔍 Search Strategy: {search_decision.value.replace('_', ' ').title()}"
            
            if sources:
                output += f"\n📚 Sources Found: {len(sources)}"
                output += f"\n🎯 Best Sources Used:"
                
                for i, source in enumerate(sources[:3], 1):
                    relevance_bar = "█" * int(source.relevance_score * 10) + "░" * (10 - int(source.relevance_score * 10))
                    output += f"\n   {i}. [{source.source_type.upper()}] {source.title}"
                    output += f"\n      Relevance: {relevance_bar} {source.relevance_score:.1%}"
                    if source.url:
                        output += f"\n      URL: {source.url}"
                
                # Show content quality summary
                avg_relevance = sum(s.relevance_score for s in sources) / len(sources)
                quality_rating = "⭐" * min(5, int(avg_relevance * 5) + 1)
                output += f"\n📈 Content Quality: {quality_rating} ({avg_relevance:.1%})"
            else:
                output += f"\n📚 Sources: Using internal knowledge base"
        
        return output
    
    def interactive_chat(self):
        """Enhanced interactive chat with clean output"""
        print(f"\n🎯 {self.ai_identity['name']} v{self.ai_identity['version']} - Enhanced Chat")
        print("=" * 60)
        print("🧠 Features: Enhanced Web Scraping + Clean Output + Best Source Selection")
        print(f"🏢 {self.ai_identity['company']} - Created by {self.ai_identity['creator']}")
        print("\nCommands:")
        print("• 'quit' - Exit chat")
        print("• 'temp X' - Set temperature (0.1-1.0)")
        print("• 'research on/off' - Toggle research")
        print("• 'clear' - Reset conversation")
        print("=" * 60)
        
        current_temperature = 0.7
        
        while True:
            try:
                user_input = input("\n👤 You: ").strip()
                
                if user_input.lower() in ['quit', 'exit']:
                    print("👋 Thanks for using Enhanced TurboTalk AI!")
                    break
                
                if user_input.lower().startswith('temp '):
                    try:
                        temp_value = float(user_input.split()[1])
                        if 0.1 <= temp_value <= 1.0:
                            current_temperature = temp_value
                            print(f"🌡️ Temperature set to {current_temperature}")
                        else:
                            print("❌ Temperature must be between 0.1 and 1.0")
                    except:
                        print("❌ Invalid temperature format. Use: temp 0.7")
                    continue
                
                if user_input.lower() in ['research on']:
                    self.research_enabled = True
                    print("🔍 Enhanced research enabled!")
                    continue
                
                if user_input.lower() in ['research off']:
                    self.research_enabled = False
                    print("🔍 Research disabled!")
                    continue
                
                if user_input.lower() == 'clear':
                    self.conversation_history = []
                    print("🧹 Conversation cleared!")
                    continue
                
                if not user_input:
                    continue
                
                # Generate response
                start_time = time.time()
                response = self.generate_response(user_input, current_temperature)
                end_time = time.time()
                
                # Display response (already formatted with "TurboTalk AI:" prefix)
                print(f"\n{response}")
                print(f"\n⏱️ Response time: {end_time - start_time:.2f}s")
                
                # Store in history
                self.conversation_history.append({
                    "user": user_input,
                    "assistant": response,
                    "temperature": current_temperature,
                    "timestamp": datetime.now().isoformat()
                })
                
            except KeyboardInterrupt:
                print("\n👋 Chat interrupted. Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")

def main():
    """Enhanced main function"""
    print("🎯 Enhanced TurboTalk AI v1.3.0 - Clean Output Edition")
    print("Rango Productions © 2025")
    print("Created by: Rushi Bhavinkumar Soni (CEO/Founder)")
    print("🇮🇳 Made in India")
    print("🚀 New Features: Clean Output + Enhanced Web Scraping + Best Source Selection")
    print("=" * 70)
    
    # Check dependencies
    required_libs = {
        'wikipedia': 'Wikipedia search',
        'requests': 'Web scraping',
        'bs4': 'HTML parsing',
        'torch': 'PyTorch',
        'transformers': 'Transformers'
    }
    
    for lib, desc in required_libs.items():
        try:
            __import__(lib)
            print(f"✅ {desc} library available")
        except ImportError:
            print(f"❌ {desc} library not found!")
    
    turbotalk = TurboTalkAI()
    
    if not turbotalk.load_model():
        print("\n❌ Failed to load TurboTalk AI")
        return
    
    print(f"\n🎯 Enhanced TurboTalk AI v1.3.0 Ready!")
    print("🔥 Key Improvements:")
    print("   • Clean output with 'TurboTalk AI:' prefix only")
    print("   • Enhanced web scraping with relevance scoring")
    print("   • Best source selection and quality rating")
    print("   • Temperature display and control")
    print("   • Parallel research processing")
    
    turbotalk.interactive_chat()

if __name__ == "__main__":
    main()