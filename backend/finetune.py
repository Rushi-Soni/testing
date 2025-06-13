#!/usr/bin/env python3
"""
TurboTalk AI Finetuning Script - Condensed Version
Includes architecture modification and sequential training
Author: Rushi Bhavinkumar Soni (CEO/Founder, Rango Productions)
Model Version: 1.2.6
"""

import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    DataCollatorForLanguageModeling,
    AutoConfig
)
from datasets import Dataset, load_dataset, concatenate_datasets
from peft import LoraConfig, get_peft_model
import json
import os
import shutil
import re
import math
import logging
import time
import gc
import psutil
import stat
from datetime import datetime
from tqdm import tqdm
from peft import TaskType

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
BASE_MODEL_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\model\snapshots\32b71b12589c2f8d625668d2335a01cac3249519"
DATA_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\autotrain_ready_data.jsonl"
OUTPUT_MODEL_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\turbotalk_v1.2.6"
TEMP_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\temp_training"
INTERMEDIATE_MODEL_PATH = r"D:\ttm\model\3bmodel\t\M\TTM\intermediate_model"

# TurboTalk AI Configuration
TURBOTALK_CONFIG = {
    "model_name": "turbotalk",
    "company_name": "rango productions",
    "creator": "rushi bhavinkumar soni",
    "creator_position": "ceo/founder of the company rango productions",
    "architecture": "TurboTalkAIForCausalLM",
    "model_type": "turbotalk-ai",
    "version": "1.2.6",
    "description": "TurboTalk AI - Advanced Conversational AI by Rango Productions"
}

class TurboTalkTrainer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        self.dataset = None
        self.all_datasets = []  # Store datasets separately for sequential training
        self.hardware_profile = self.analyze_hardware()
        
    def analyze_hardware(self):
        """Analyze hardware capabilities for realistic training estimates"""
        profile = {
            "device": self.device,
            "cpu_cores": psutil.cpu_count(logical=False),
            "logical_cores": psutil.cpu_count(logical=True),
            "ram_gb": psutil.virtual_memory().total / (1024**3),
            "available_ram_gb": psutil.virtual_memory().available / (1024**3),
            "gpu_info": None,
            "estimated_speed_factor": 1.0,
            "max_batch_size": 1,
            "optimal_workers": 4,
            "max_examples_recommended": 100000
        }

        if torch.cuda.is_available():
            gpu_count = torch.cuda.device_count()
            gpu_props = torch.cuda.get_device_properties(0)

            profile["gpu_info"] = {
                "count": gpu_count,
                "name": gpu_props.name,
                "memory_gb": gpu_props.total_memory / (1024**3),
                "compute_capability": f"{gpu_props.major}.{gpu_props.minor}",
                "multi_processor_count": gpu_props.multi_processor_count
            }

            # GPU detection and optimization
            gpu_memory = profile["gpu_info"]["memory_gb"]
            gpu_name = profile["gpu_info"]["name"].lower()

            # Adjust parameters based on GPU
            if any(x in gpu_name for x in ["4090", "a100", "a6000", "h100"]):
                profile["estimated_speed_factor"] = 0.3
                profile["max_batch_size"] = 8
                profile["max_examples_recommended"] = 200000
            elif any(x in gpu_name for x in ["4080", "3090", "a5000"]):
                profile["estimated_speed_factor"] = 0.4
                profile["max_batch_size"] = 6
                profile["max_examples_recommended"] = 150000
            elif any(x in gpu_name for x in ["4070", "3080"]):
                profile["estimated_speed_factor"] = 0.6
                profile["max_batch_size"] = 4
                profile["max_examples_recommended"] = 120000
            else:
                profile["estimated_speed_factor"] = 1.0
                profile["max_batch_size"] = 2
                profile["max_examples_recommended"] = 80000

            # Memory-based adjustments
            if gpu_memory >= 24:
                profile["max_examples_recommended"] = min(profile["max_examples_recommended"] * 2, 300000)
            elif gpu_memory < 8:
                profile["estimated_speed_factor"] *= 1.5
                profile["max_examples_recommended"] = min(profile["max_examples_recommended"], 50000)
                profile["max_batch_size"] = 1

        else:
            profile["estimated_speed_factor"] = 8.0
            profile["max_examples_recommended"] = 20000

        # CPU optimization
        if profile["cpu_cores"] >= 8:
            profile["optimal_workers"] = 6
        else:
            profile["optimal_workers"] = 2

        logger.info(f"🖥️  Hardware Profile:")
        logger.info(f"   Device: {profile['device']}")
        logger.info(f"   CPU Cores: {profile['cpu_cores']} physical, {profile['logical_cores']} logical")
        logger.info(f"   RAM: {profile['ram_gb']:.1f} GB total, {profile['available_ram_gb']:.1f} GB available")

        if profile["gpu_info"]:
            logger.info(f"   GPU: {profile['gpu_info']['name']} ({profile['gpu_info']['count']}x)")
            logger.info(f"   GPU Memory: {profile['gpu_info']['memory_gb']:.1f} GB")

        return profile
        
    def load_data(self):
        """Load and preprocess training data - COMPLETE VERSION WITH ALL DATASETS"""
        logger.info("=" * 80)
        logger.info("📂 LOADING COMPREHENSIVE DATASETS FOR TURBOTALK AI")
        logger.info("=" * 80)

        MAX_TOTAL_EXAMPLES = min(self.hardware_profile["max_examples_recommended"] * 2, 500000)
        logger.info(f"🎯 Target Examples: {MAX_TOTAL_EXAMPLES:,}")

        dataset_stats = {'total_raw': 0, 'total_processed': 0, 'sources_loaded': 0, 'sources_failed': 0}
        self.all_datasets = []

        def safe_load_dataset(name, config=None, split=None, **kwargs):
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    if config:
                        dataset = load_dataset(name, config, split=split, trust_remote_code=True, **kwargs)
                    else:
                        dataset = load_dataset(name, split=split, trust_remote_code=True, **kwargs)
                    return dataset
                except Exception as e:
                    logger.warning(f"   Attempt {attempt + 1} failed: {str(e)[:100]}...")
                    time.sleep(3)
                    gc.collect()
            logger.error(f"❌ Failed to load dataset {name} after {max_retries} attempts.")
            return None

        def create_conversation(human_text, ai_text):
            if not human_text or not ai_text or len(human_text.strip()) < 5 or len(ai_text.strip()) < 5:
                return None
            human_clean = human_text.strip()[:1000]
            ai_clean = ai_text.strip()[:1500]
            if len(human_clean) > 10 and len(ai_clean) > 10:
                return f"Human: {human_clean}\nTurboTalk AI: {ai_clean}\n"
            return None

        # Dataset 1: Local JSONL
        logger.info("🏠 [1/10] Loading Local Dataset")
        try:
            local_data = []
            if os.path.exists(DATA_PATH):
                with open(DATA_PATH, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if i > 70000:
                            break
                        try:
                            data = json.loads(line.strip())
                            local_data.append(data)
                        except:
                            continue

                local_texts = []
                for item in local_data:
                    try:
                        conversation = None
                        if 'instruction' in item and 'response' in item:
                            conversation = create_conversation(item['instruction'], item['response'])
                        elif 'input' in item and 'output' in item:
                            conversation = create_conversation(item['input'], item['output'])
                        elif 'question' in item and 'answer' in item:
                            conversation = create_conversation(item['question'], item['answer'])
                        elif 'prompt' in item and 'completion' in item:
                            conversation = create_conversation(item['prompt'], item['completion'])
                        if conversation:
                            local_texts.append(conversation)
                    except:
                        continue

                if local_texts:
                    local_texts = local_texts[:25000]
                    self.all_datasets.append(Dataset.from_dict({"text": local_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(local_texts)
                    logger.info(f"✅ Local: {len(local_texts)} examples")

                del local_data, local_texts
                gc.collect()
            else:
                logger.warning(f"⚠️ Local dataset not found: {DATA_PATH}")
        except Exception as e:
            logger.error(f"❌ Local dataset failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 2: Alpaca
        logger.info("🦙 [2/10] Loading Alpaca Dataset")
        try:
            alpaca = safe_load_dataset("tatsu-lab/alpaca", split="train")
            if alpaca:
                alpaca_texts = []
                for item in alpaca:
                    try:
                        inst = item.get("instruction", "").strip()
                        inp = item.get("input", "").strip()
                        out = item.get("output", "").strip()
                        if inst and out:
                            human = f"{inst}\n{inp}" if inp else inst
                            conv = create_conversation(human, out)
                            if conv:
                                alpaca_texts.append(conv)
                    except:
                        continue
                if alpaca_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": alpaca_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(alpaca_texts)
                    logger.info(f"✅ Alpaca: {len(alpaca_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ Alpaca failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 3: Dolly
        logger.info("🤖 [3/10] Loading Dolly Dataset")
        try:
            dolly = safe_load_dataset("databricks/databricks-dolly-15k", split="train")
            if dolly:
                dolly_texts = []
                for item in dolly:
                    try:
                        inst = item.get("instruction", "").strip()
                        context = item.get("context", "").strip()
                        resp = item.get("response", "").strip()
                        full_inst = f"{inst}\nContext: {context}" if context else inst
                        conv = create_conversation(full_inst, resp)
                        if conv:
                            dolly_texts.append(conv)
                    except:
                        continue
                if dolly_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": dolly_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(dolly_texts)
                    logger.info(f"✅ Dolly: {len(dolly_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ Dolly failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 4: SQuAD
        logger.info("📖 [4/10] Loading SQuAD Dataset")
        try:
            squad = safe_load_dataset("squad", split="train")
            if squad:
                squad_texts = []
                for i, item in enumerate(squad):
                    if i > 30000:
                        break
                    try:
                        q = item.get("question", "").strip()
                        a = item.get("answers", {}).get("text", [""])[0].strip()
                        conv = create_conversation(q, a)
                        if conv:
                            squad_texts.append(conv)
                    except:
                        continue
                if squad_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": squad_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(squad_texts)
                    logger.info(f"✅ SQuAD: {len(squad_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ SQuAD failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 5: GSM8K
        logger.info("🔢 [5/10] Loading GSM8K Dataset")
        try:
            gsm8k = safe_load_dataset("gsm8k", "main", split="train")
            if gsm8k:
                gsm_texts = []
                for item in gsm8k:
                    try:
                        q = item.get("question", "").strip()
                        a = item.get("answer", "").strip()
                        conv = create_conversation(q, a)
                        if conv:
                            gsm_texts.append(conv)
                    except:
                        continue
                if gsm_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": gsm_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(gsm_texts)
                    logger.info(f"✅ GSM8K: {len(gsm_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ GSM8K failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 6: IMDB
        logger.info("🎬 [6/10] Loading IMDB Dataset")
        try:
            imdb = safe_load_dataset("imdb", split="train")
            if imdb:
                imdb_texts = []
                for i, item in enumerate(imdb):
                    if i > 15000:
                        break
                    try:
                        text = item.get("text", "").strip()
                        label = item.get("label", 0)
                        sentiment = "positive" if label == 1 else "negative"
                        q = f"What is the sentiment of this review: {text[:400]}..."
                        a = f"The sentiment of this review is {sentiment}."
                        conv = create_conversation(q, a)
                        if conv:
                            imdb_texts.append(conv)
                    except:
                        continue
                if imdb_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": imdb_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(imdb_texts)
                    logger.info(f"✅ IMDB: {len(imdb_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ IMDB failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 7: OpenAssistant
        logger.info("💬 [7/10] Loading OpenAssistant Dataset")
        try:
            oa = safe_load_dataset("OpenAssistant/oasst1", split="train")
            if oa:
                oa_texts = []
                human = None
                for item in oa:
                    try:
                        text = item.get("text", "").strip()
                        role = item.get("role", "")
                        if role == "prompter":
                            human = text
                        elif role == "assistant" and human:
                            conv = create_conversation(human, text)
                            if conv:
                                oa_texts.append(conv)
                            human = None
                    except:
                        continue
                if oa_texts:
                    oa_texts = oa_texts[:20000]
                    self.all_datasets.append(Dataset.from_dict({"text": oa_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(oa_texts)
                    logger.info(f"✅ OpenAssistant: {len(oa_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ OpenAssistant failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 8: WizardLM
        logger.info("🧙 [8/10] Loading WizardLM Dataset")
        try:
            wizard = safe_load_dataset("WizardLM/WizardLM_evol_instruct_70k", split="train")
            if wizard:
                wiz_texts = []
                for item in wizard:
                    try:
                        inst = item.get("instruction", "").strip()
                        out = item.get("output", "").strip()
                        conv = create_conversation(inst, out)
                        if conv:
                            wiz_texts.append(conv)
                    except:
                        continue
                if wiz_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": wiz_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(wiz_texts)
                    logger.info(f"✅ WizardLM: {len(wiz_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ WizardLM failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 9: Code Alpaca
        logger.info("💻 [9/10] Loading Code Alpaca Dataset")
        try:
            codealpaca = safe_load_dataset("sahil2801/CodeAlpaca-20k", split="train")
            if codealpaca:
                code_texts = []
                for item in codealpaca:
                    try:
                        inst = item.get("instruction", "").strip()
                        inp = item.get("input", "").strip()
                        out = item.get("output", "").strip()
                        human = f"{inst}\n{inp}" if inp else inst
                        conv = create_conversation(human, out)
                        if conv:
                            code_texts.append(conv)
                    except:
                        continue
                if code_texts:
                    self.all_datasets.append(Dataset.from_dict({"text": code_texts}))
                    dataset_stats['sources_loaded'] += 1
                    dataset_stats['total_raw'] += len(code_texts)
                    logger.info(f"✅ Code Alpaca: {len(code_texts)} processed")
        except Exception as e:
            logger.warning(f"⚠️ Code Alpaca failed: {e}")
            dataset_stats['sources_failed'] += 1

        # Dataset 10: Synthetic (if needed, add later)

        logger.info("\n📊 Final Dataset Stats")
        logger.info("=" * 60)
        logger.info(f"✅ Sources Loaded: {dataset_stats['sources_loaded']}/10")
        logger.info(f"❌ Sources Failed: {dataset_stats['sources_failed']}/10")
        logger.info(f"📊 Total Examples: {dataset_stats['total_raw']:,}")

        # Reverse datasets for sequential training
        self.all_datasets.reverse()
        logger.info("✅ All datasets loaded and reversed for training")

    def load_base_model(self, model_path=None):
        """Load base model and tokenizer with proper gradient setup"""
        if model_path is None:
            model_path = BASE_MODEL_PATH

        logger.info(f"🧠 Loading model from: {model_path}")

        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if self.device == "cuda" else None,
            low_cpu_mem_usage=True,
            trust_remote_code=True,
            ignore_mismatched_sizes=True
        )

        # Enable training mode and gradients
        self.model.train()
        for param in self.model.parameters():
            param.requires_grad = True

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

        # CRITICAL FIX: Set padding token if not present
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.info("✅ Padding token set to EOS token")

        # Also set pad_token_id for consistency
        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
            logger.info("✅ Padding token ID set to EOS token ID")

    def modify_architecture(self, model_path):
        """Modified architecture function with proper gradient setup"""
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import get_peft_model, LoraConfig, TaskType
    
        logger.info("🧹 Modifying model architecture...")
        logger.info("Loading original model...")
    
        try:
            model = AutoModelForCausalLM.from_pretrained(
                model_path,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                low_cpu_mem_usage=True,
                trust_remote_code=True,
                ignore_mismatched_sizes=True
            )
            logger.info("✅ Original model loaded successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise RuntimeError("Model loading failed")
    
        if model is None:
            raise RuntimeError("🚫 Model is None after loading!")
    
        # Enable gradient computation
        model.train()
        for param in model.parameters():
            param.requires_grad = True
    
        logger.info("Applying LoRA to the model...")
    
        # Get model's architecture-specific target modules
        target_modules = []
        for name, module in model.named_modules():
            if any(x in name.lower() for x in ['attn', 'attention', 'query', 'key', 'value', 'dense', 'fc', 'linear']):
                if hasattr(module, 'weight') and len(module.weight.shape) == 2:
                    target_modules.append(name.split('.')[-1])
        
        # Fallback to common target modules if none found
        if not target_modules:
            target_modules = ["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
    
        lora_config = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=list(set(target_modules)),  # Remove duplicates
            lora_dropout=0.1,
            bias="none",
            task_type=TaskType.CAUSAL_LM,
        )
    
        try:
            model = get_peft_model(model, lora_config)
            logger.info("✅ LoRA applied successfully")
            model.print_trainable_parameters()
        except Exception as e:
            logger.error(f"❌ LoRA application failed: {e}")
            # Fallback: try with basic target modules
            lora_config.target_modules = ["q_proj", "v_proj"]
            model = get_peft_model(model, lora_config)
            logger.info("✅ LoRA applied with fallback modules")
    
        # Ensure model is in training mode
        model.train()
        
        # Verify gradients are enabled for LoRA parameters
        trainable_params = 0
        for name, param in model.named_parameters():
            if param.requires_grad:
                trainable_params += param.numel()
        
        logger.info(f"✅ Trainable parameters: {trainable_params:,}")
        
        if trainable_params == 0:
            raise RuntimeError("❌ No trainable parameters found!")
    
        self.model = model
    
        # Load tokenizer with padding token fix
        self.tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
        
        # CRITICAL FIX: Set padding token if not present
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.info("✅ Padding token set to EOS token")
        
        # Also set pad_token_id for consistency
        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
            logger.info("✅ Padding token ID set to EOS token ID")
    
        return self.model, self.tokenizer

    def tokenize_function(self, example):
        """Tokenize function for dataset preprocessing"""
        # Double-check padding token is set (defensive programming)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.warning("⚠️ Padding token was None, setting to EOS token")

        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
            logger.warning("⚠️ Padding token ID was None, setting to EOS token ID")

        # Tokenize the text
        tokens = self.tokenizer(
            example["text"],
            truncation=True,
            padding="max_length",
            max_length=512,
            return_tensors=None
        )
        # Set labels for language modeling (copy of input_ids)
        tokens["labels"] = tokens["input_ids"].copy()
        return tokens

    def prepare_dataset(self, dataset):
        """Prepare dataset for training"""
        logger.info("🔄 Tokenizing dataset...")

        # Ensure tokenizer has padding token before tokenization
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.info("✅ Padding token set before tokenization")

        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
            logger.info("✅ Padding token ID set before tokenization")

        tokenized_dataset = dataset.map(
            lambda x: self.tokenize_function(x),
            batched=True,
            num_proc=4,
            remove_columns=["text"],
        )

        return tokenized_dataset
    
    def calculate_training_params(self):
        """Calculate realistic training parameters"""
        total_examples = len(self.dataset)
        
        # Hardware-based batch size calculation
        if torch.cuda.is_available():
            gpu_memory = self.hardware_profile["gpu_info"]["memory_gb"]
            if gpu_memory >= 24:
                batch_size = 4
                gradient_accumulation = 8
            elif gpu_memory >= 16:
                batch_size = 2
                gradient_accumulation = 16
            elif gpu_memory >= 12:
                batch_size = 1
                gradient_accumulation = 32
            else:
                batch_size = 1
                gradient_accumulation = 16
        else:
            batch_size = 1
            gradient_accumulation = 4
        
        effective_batch_size = batch_size * gradient_accumulation
        steps_per_epoch = math.ceil(total_examples / effective_batch_size)
        
        # For reasonable training time, limit epochs
        num_train_epochs = 2
        max_steps = min(2000, steps_per_epoch * num_train_epochs)
        
        logger.info(f"📊 Training Parameters:")
        logger.info(f"   Total Examples: {total_examples}")
        logger.info(f"   Batch Size: {batch_size}")
        logger.info(f"   Gradient Accumulation: {gradient_accumulation}")
        logger.info(f"   Effective Batch Size: {effective_batch_size}")
        logger.info(f"   Max Steps: {max_steps}")
        
        return batch_size, gradient_accumulation, num_train_epochs, max_steps
    
    def remove_base_model_traces(self, config_dict):
        """Remove all traces of base model from config"""
        logger.info("🧹 Removing base model traces...")
        
        # Replace model identifiers
        replacements = {
            "gpt2": "turbotalk",
            "GPT2": "TurboTalk",
            "gpt-2": "turbotalk-ai",
            "openai": "rango productions",
            "OpenAI": "Rango Productions",
            "GPT-2": "TurboTalk AI",
            "gpt2-large": "turbotalk-v1.2.6",
            "GPT2LMHeadModel": "TurboTalkAIForCausalLM",
            "GPT2Model": "TurboTalkAIModel",
            "GPT2Config": "TurboTalkAIConfig",
            "transformers": "turbotalk-transformers",
            "GPT2Tokenizer": "TurboTalkAITokenizer"
        }
        
        # Convert to string for replacement
        config_str = json.dumps(config_dict, indent=2)
        
        for old, new in replacements.items():
            config_str = config_str.replace(old, new)
        
        # Parse back to dict
        config_dict = json.loads(config_str)
        
        # Add TurboTalk specific fields
        config_dict.update({
            "model_type": TURBOTALK_CONFIG["model_type"],
            "architecture": TURBOTALK_CONFIG["architecture"],
            "architectures": [TURBOTALK_CONFIG["architecture"]],
            "model_name": TURBOTALK_CONFIG["model_name"],
            "company": TURBOTALK_CONFIG["company_name"],
            "creator": TURBOTALK_CONFIG["creator"],
            "creator_position": TURBOTALK_CONFIG["creator_position"],
            "version": TURBOTALK_CONFIG["version"],
            "description": TURBOTALK_CONFIG["description"],
            "custom_model": True,
            "base_model_removed": True,
            "created_date": datetime.now().isoformat()
        })
        
        return config_dict
    
    def clean_tokenizer_files(self, tokenizer_path):
        """Clean tokenizer files from base model references"""
        logger.info("🧹 Cleaning tokenizer files...")
        
        files_to_clean = [
            "tokenizer_config.json",
            "special_tokens_map.json",
            "added_tokens.json"
        ]
        
        for filename in files_to_clean:
            filepath = os.path.join(tokenizer_path, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace base model references
                content = content.replace("gpt2", "turbotalk")
                content = content.replace("GPT2", "TurboTalk")
                content = content.replace("gpt-2", "turbotalk-ai")
                content = content.replace("openai", "rango-productions")
                content = content.replace("GPT2Tokenizer", "TurboTalkAITokenizer")
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
        
        logger.info("✅ Tokenizer files cleaned")
    
    def update_checkpoint_configs(self, checkpoint_dir):
        """Update config files in checkpoint directories during training"""
        config_file = os.path.join(checkpoint_dir, "config.json")
        if os.path.exists(config_file):
            logger.info(f"🔄 Updating checkpoint config: {checkpoint_dir}")
            
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            # Remove base model traces
            config = self.remove_base_model_traces(config)
            
            # Save updated config
            with open(config_file, 'w') as f:
                json.dump(config, f, indent=2)
    
    class CustomTrainer(Trainer):
        """Custom trainer that updates checkpoint configs"""
        def __init__(self, turbotalk_trainer, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.turbotalk_trainer = turbotalk_trainer
        
        def _save_checkpoint(self, model, trial):
            """Override to update configs after each checkpoint save"""
            try:
                checkpoint_folder = super()._save_checkpoint(model, trial)
                
                # Update checkpoint configs
                if checkpoint_folder:
                    self.turbotalk_trainer.update_checkpoint_configs(checkpoint_folder)
                
                return checkpoint_folder
            except Exception as e:
                logger.error(f"Checkpoint save failed: {e}")
                raise
    
    def train_model(self):
        """Train the model with optimized parameters and proper gradient handling"""
        logger.info("🚀 Starting TurboTalk AI training...")
    
        # Ensure model is in training mode
        self.model.train()
        
        # Verify gradients are still enabled
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        logger.info(f"🔍 Trainable parameters before training: {trainable_params:,}")
        logger.info(f"🔧 Model initialized with {trainable_params:,} trainable parameters")
        logger.info(f"🔧 First layer weights requires_grad: {self.model.transformer.wte.weight.requires_grad}")
        
        if trainable_params == 0:
            raise RuntimeError("❌ No trainable parameters found before training!")
    
        # Ensure tokenizer has padding token before training
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.info("✅ Padding token set before training")
    
        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
            logger.info("✅ Padding token ID set before training")
    
        # Calculate training parameters
        batch_size, gradient_accumulation, num_train_epochs, max_steps = self.calculate_training_params()
    
        # Setup training arguments
        training_args = TrainingArguments(
            output_dir=TEMP_PATH,
            num_train_epochs=num_train_epochs,
            max_steps=2000,
            per_device_train_batch_size=batch_size,
            gradient_accumulation_steps=gradient_accumulation,
            warmup_steps=min(100, max_steps // 10),
            weight_decay=0.01,
            logging_dir=f"{TEMP_PATH}/logs",
            logging_steps=min(50, max_steps // 20),
            save_steps=250,
            save_total_limit=2,
            prediction_loss_only=True,
            remove_unused_columns=False,
            dataloader_pin_memory=True,
            dataloader_num_workers=min(4, self.hardware_profile["cpu_cores"]),
            fp16=self.hardware_profile["gpu_info"] and self.hardware_profile["gpu_info"]["memory_gb"] >= 12,
            gradient_checkpointing=True,
            optim="adamw_torch",
            learning_rate=5e-5,
            lr_scheduler_type="cosine",
            report_to=[],
            eval_steps=None,
            load_best_model_at_end=False,
        )
    
        # Data collator with dynamic padding - explicitly set tokenizer
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False,
            pad_to_multiple_of=8,
        )
    
        # Initialize custom trainer that updates configs during training
        trainer = self.CustomTrainer(
            turbotalk_trainer=self,
            model=self.model,
            args=training_args,
            train_dataset=self.dataset,
            data_collator=data_collator,
        )
    
        # Verify model state before training
        logger.info(f"🔍 Model training mode: {self.model.training}")
        
        # Start training with error handling
        try:
            logger.info(f"🎯 Training started! Running for {max_steps} steps...")
            trainer.train()
            logger.info("✅ Training completed!")
        except RuntimeError as e:
            if "does not require grad" in str(e):
                logger.error("❌ Gradient error detected. Re-enabling gradients...")
                # Enable gradients for ALL parameters
                for param in self.model.parameters():
                    param.requires_grad = True
                # Verify parameter states
                trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
                logger.info(f"🔄 Retrying training with {trainable_params:,} trainable parameters...")
                trainer.train()
            else:
                raise
            
        return trainer

    def create_custom_model_card(self, model_path):
        """Create custom model card for TurboTalk AI"""
        model_card = f"""---
language: en
license: proprietary
tags:
- conversational-ai
- turbotalk
- rango-productions
- custom-model
model_type: {TURBOTALK_CONFIG['model_type']}
architecture: {TURBOTALK_CONFIG['architecture']}
version: {TURBOTALK_CONFIG['version']}
---

# TurboTalk AI v{TURBOTALK_CONFIG['version']}

## Model Description

TurboTalk AI is an advanced conversational AI model developed by Rango Productions.
This model is specifically designed for natural, engaging conversations with users.

## Model Details

- **Model Name**: {TURBOTALK_CONFIG['model_name']}
- **Company**: {TURBOTALK_CONFIG['company_name'].title()}
- **Creator**: {TURBOTALK_CONFIG['creator'].title()}
- **Position**: {TURBOTALK_CONFIG['creator_position'].title()}
- **Architecture**: {TURBOTALK_CONFIG['architecture']}
- **Model Type**: {TURBOTALK_CONFIG['model_type']}
- **Version**: {TURBOTALK_CONFIG['version']}
- **Created**: {datetime.now().strftime('%Y-%m-%d')}

## Capabilities

- Natural conversation
- Question answering
- Task assistance
- Creative writing
- Code assistance

## License

Proprietary - Rango Productions. All rights reserved.

## Contact

For inquiries about TurboTalk AI, contact Rango Productions.

---
*Powered by TurboTalk AI v{TURBOTALK_CONFIG['version']} - Rango Productions*
"""
        
        with open(os.path.join(model_path, "README.md"), 'w', encoding='utf-8') as f:
            f.write(model_card)
        
        logger.info("✅ Model card created")
    
    def save_turbotalk_model(self, output_path):
        """Save the finetuned model with all TurboTalk branding"""
        logger.info(f"💾 Saving TurboTalk AI to: {output_path}")
    
        # Create output directory
        os.makedirs(output_path, exist_ok=True)
    
        # Save model and tokenizer
        self.model.save_pretrained(output_path)
        self.tokenizer.save_pretrained(output_path)
    
        # Load and modify config
        config_path = os.path.join(output_path, "config.json")
        with open(config_path, 'r') as f:
            config = json.load(f)
    
        # Remove base model traces
        config = self.remove_base_model_traces(config)
    
        # Save cleaned config
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
    
        # Update generation config if it exists
        gen_config_path = os.path.join(output_path, "generation_config.json")
        if os.path.exists(gen_config_path):
            with open(gen_config_path, 'r') as f:
                gen_config = json.load(f)
        
            gen_config.update({
                "model_name": TURBOTALK_CONFIG["model_name"],
                "company": TURBOTALK_CONFIG["company_name"],
                "version": TURBOTALK_CONFIG["version"]
            })
        
            with open(gen_config_path, 'w') as f:
                json.dump(gen_config, f, indent=2)
    
        # Clean tokenizer files
        self.clean_tokenizer_files(output_path)
    
        # Create model card
        self.create_custom_model_card(output_path)
    
        # Create version info file
        version_info = {
            "model_name": TURBOTALK_CONFIG["model_name"],
            "version": TURBOTALK_CONFIG["version"],
            "company": TURBOTALK_CONFIG["company_name"],
            "creator": TURBOTALK_CONFIG["creator"],
            "creator_position": TURBOTALK_CONFIG["creator_position"],
            "architecture": TURBOTALK_CONFIG["architecture"],
            "model_type": TURBOTALK_CONFIG["model_type"],
            "description": TURBOTALK_CONFIG["description"],
            "created_date": datetime.now().isoformat(),
            "training_completed": True,
            "base_model_traces_removed": True,
            "custom_branding_applied": True,
            "sequential_training": True,
            "datasets_count": len(self.all_datasets)
        }
    
        with open(os.path.join(output_path, "turbotalk_info.json"), 'w') as f:
            json.dump(version_info, f, indent=2)
    
        logger.info("✅ TurboTalk AI model saved successfully!")
    
    def run_sequential_training_pipeline(self):
        """Complete training pipeline with sequential training on multiple datasets"""
        try:
            logger.info("📂 Step 1: Loading all training data...")
            self.load_data()

            # First modify the architecture of the base model
            logger.info("\n" + "="*60)
            logger.info("🔧 Step 2: Modifying Model Architecture")
            logger.info("="*60)
            self.model, self.tokenizer = self.modify_architecture(BASE_MODEL_PATH)

            # Ensure tokenizer is properly configured after architecture modification
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                logger.info("✅ Padding token configured after architecture modification")

            # Use the modified model as the starting point
            current_model_path = f"{BASE_MODEL_PATH}_modified"

            # Train sequentially on each dataset (from last to first)
            for i, dataset in enumerate(self.all_datasets):
                logger.info(f"\n{'='*60}")
                logger.info(f"🚀 Sequential Training Round {i+1}/{len(self.all_datasets)}")
                logger.info(f"{'='*60}")

                # Load current model (skip first iteration since we already have the modified model loaded)
                if i > 0:
                    logger.info(f"🧠 Loading model from {current_model_path}...")
                    self.load_base_model(current_model_path)

                # Prepare current dataset
                logger.info(f"🔄 Preparing dataset {i+1}...")
                self.dataset = self.prepare_dataset(dataset)

                # Train on current dataset
                logger.info(f"🚀 Training model on dataset {i+1}...")
                trainer = self.train_model()

                # Save intermediate model
                intermediate_path = f"{INTERMEDIATE_MODEL_PATH}_{i+1}"
                logger.info(f"💾 Saving intermediate model to {intermediate_path}...")
                os.makedirs(intermediate_path, exist_ok=True)
                trainer.save_model(intermediate_path)
                self.tokenizer.save_pretrained(intermediate_path)

                # Update current model path for next iteration
                current_model_path = intermediate_path

                # Clean up to free memory
                del trainer
                if i < len(self.all_datasets) - 1:  # Don't delete model on last iteration
                    del self.model
                del self.dataset
                gc.collect()
                torch.cuda.empty_cache()

                logger.info(f"✅ Training round {i+1} completed successfully!")

            # Final model saving with TurboTalk branding
            logger.info("\n" + "="*60)
            logger.info("🏁 Final Model Preparation")
            logger.info("="*60)

            # Save final model with TurboTalk branding
            logger.info(f"💾 Saving final TurboTalk AI model to {OUTPUT_MODEL_PATH}...")
            self.save_turbotalk_model(OUTPUT_MODEL_PATH)

            # Clean up temp training files
            if os.path.exists(TEMP_PATH):
                def remove_readonly(func, path, _):
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                try:
                    shutil.rmtree(TEMP_PATH, onerror=remove_readonly)
                    logger.info("🎉 TurboTalk AI Training Pipeline Completed Successfully!")
                    logger.info(f"📁 Model saved to: {OUTPUT_MODEL_PATH}")
                except Exception as e:
                    logger.error(f"❌ Cleanup failed: {e}")

        except Exception as e:
            logger.error(f"❌ Training pipeline failed: {e}")
            raise

def main():
    """Main function"""
    print("🎯 TurboTalk AI Finetuning Script - Condensed Version")
    print("Rango Productions © 2025")
    print(f"Created by: {TURBOTALK_CONFIG['creator'].title()}")
    print(f"Position: {TURBOTALK_CONFIG['creator_position'].title()}")
    print("=" * 60)
    
    # Check prerequisites
    if not os.path.exists(BASE_MODEL_PATH):
        print(f"❌ Base model path not found: {BASE_MODEL_PATH}")
        return
    
    if not torch.cuda.is_available():
        print("⚠️  CUDA not available. Training will be very slow on CPU.")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
    # Initialize trainer
    trainer = TurboTalkTrainer()
    
    # Confirm before starting
    print("\nThis script will:")
    print("1. First modify the model architecture to add RoPE and LoRA")
    print("2. Load datasets in reverse order (last to first)")
    print("3. Train sequentially on each dataset")
    print("4. Save intermediate models after each training round")
    print("5. Create final TurboTalk AI model with custom branding")
    
    response = input("\nStart training with sequential pipeline? (y/n): ")
    if response.lower() != 'y':
        print("Training cancelled.")
        return
    
    # Run training
    trainer.run_sequential_training_pipeline()
    
    print("\n🎉 TurboTalk AI is ready!")
    print(f"📁 Location: {OUTPUT_MODEL_PATH}")
    print("🚀 Use run_turbotalk.py to interact with your model!")

if __name__ == "__main__":
    main()
