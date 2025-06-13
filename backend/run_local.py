#!/usr/bin/env python3
"""
Script to run the base GPT-2 Large model locally
Author: Rushi Bhavinkumar Soni
Company: Rango Productions
"""

import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    GenerationConfig,
    pipeline
)
import json
import os
from datetime import datetime

# Model configuration
MODEL_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\model\snapshots\32b71b12589c2f8d625668d2335a01cac3249519"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def load_model_and_tokenizer():
    """Load the model and tokenizer from local path"""
    print(f"🚀 Loading model from: {MODEL_PATH}")
    print(f"📱 Using device: {DEVICE}")
    
    try:
        # Load tokenizer
        print("📝 Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        
        # Load model
        print("🧠 Loading model...")
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_PATH,
            torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
            device_map="auto" if DEVICE == "cuda" else None,
            trust_remote_code=True
        )
        
        if DEVICE == "cpu":
            model = model.to(DEVICE)
        
        print("✅ Model and tokenizer loaded successfully!")
        return model, tokenizer
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None

def generate_response(model, tokenizer, prompt, max_length=150, temperature=0.7, top_p=0.9):
    """Generate response using the model"""
    try:
        # Encode input
        inputs = tokenizer.encode(prompt, return_tensors="pt").to(DEVICE)
        
        # Generate
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_length=max_length,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                num_return_sequences=1
            )
        
        # Decode response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response[len(prompt):].strip()
        
    except Exception as e:
        print(f"❌ Error generating response: {e}")
        return None

def interactive_chat(model, tokenizer):
    """Interactive chat interface"""
    print("\n🎯 TurboTalk AI Interactive Chat")
    print("=" * 50)
    print("Type 'quit' or 'exit' to end the conversation")
    print("Type 'clear' to clear conversation history")
    print("=" * 50)
    
    conversation_history = []
    
    while True:
        try:
            user_input = input("\n👤 You: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("👋 Goodbye!")
                break
            
            if user_input.lower() == 'clear':
                conversation_history = []
                print("🧹 Conversation history cleared!")
                continue
            
            if not user_input:
                continue
            
            # Build context with conversation history
            context = ""
            for turn in conversation_history[-5:]:  # Keep last 5 turns
                context += f"Human: {turn['human']}\nAssistant: {turn['assistant']}\n"
            
            prompt = f"{context}Human: {user_input}\nAssistant:"
            
            print("🤖 TurboTalk AI: ", end="", flush=True)
            response = generate_response(model, tokenizer, prompt, max_length=200)
            
            if response:
                print(response)
                conversation_history.append({
                    "human": user_input,
                    "assistant": response,
                    "timestamp": datetime.now().isoformat()
                })
            else:
                print("Sorry, I couldn't generate a response.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")

def benchmark_model(model, tokenizer):
    """Run some benchmark tests"""
    print("\n🏃‍♂️ Running benchmark tests...")
    
    test_prompts = [
        "Hello, how are you?",
        "What is artificial intelligence?",
        "Tell me a short story about",
        "Explain quantum computing in simple terms:",
        "Write a haiku about technology:"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📝 Test {i}: {prompt}")
        response = generate_response(model, tokenizer, prompt, max_length=100)
        if response:
            print(f"🤖 Response: {response}")
        else:
            print("❌ Failed to generate response")
        print("-" * 50)

def main():
    """Main function"""
    print("🎯 TurboTalk AI - Base Model Runner")
    print("Rango Productions © 2025")
    print("Created by: Rushi Bhavinkumar Soni")
    print("=" * 50)
    
    # Check if model path exists
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model path not found: {MODEL_PATH}")
        print("Please check the path and try again.")
        return
    
    # Load model
    model, tokenizer = load_model_and_tokenizer()
    if model is None or tokenizer is None:
        print("❌ Failed to load model. Exiting...")
        return
    
    # Print model info
    print(f"\n📊 Model Information:")
    print(f"Model Type: {model.config.model_type}")
    print(f"Vocab Size: {model.config.vocab_size}")
    print(f"Parameters: ~{sum(p.numel() for p in model.parameters()) / 1e6:.1f}M")
    print(f"Device: {next(model.parameters()).device}")
    
    while True:
        print("\n🎯 Choose an option:")
        print("1. Interactive Chat")
        print("2. Run Benchmarks")
        print("3. Single Generation")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            interactive_chat(model, tokenizer)
        elif choice == "2":
            benchmark_model(model, tokenizer)
        elif choice == "3":
            prompt = input("Enter your prompt: ")
            response = generate_response(model, tokenizer, prompt)
            if response:
                print(f"\n🤖 Response: {response}")
            else:
                print("❌ Failed to generate response")
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()