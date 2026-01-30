"""
LLM Client abstraction for GenAI explanations.
Supports OpenAI API (easily switchable to LLaMA/Ollama).
"""
import os
from typing import Optional
from ..config import settings

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("[WARNING] OpenAI library not installed. Install with: pip install openai")


class LLMClient:
    """
    LLM client for generating text explanations.
    Currently uses OpenAI API, but designed to be easily switchable to LLaMA/Ollama.
    """
    
    def __init__(self):
        """Initialize LLM client."""
        self.model = settings.LLM_MODEL
        self.temperature = settings.LLM_TEMPERATURE
        self.max_tokens = settings.LLM_MAX_TOKENS
        
        if OPENAI_AVAILABLE and settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.available = True
        else:
            self.client = None
            self.available = False
            if not settings.OPENAI_API_KEY:
                print("[WARNING] OPENAI_API_KEY not set in environment")
    
    def generate_text(
        self, 
        prompt: str, 
        system_message: Optional[str] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate text using LLM.
        
        Args:
            prompt: User prompt for text generation
            system_message: Optional system instruction
            max_tokens: Optional override for max tokens
            
        Returns:
            Generated text or fallback message
        """
        if not self.available:
            return "[GenAI unavailable - API key not configured]"
        
        try:
            messages = []
            
            if system_message:
                messages.append({"role": "system", "content": system_message})
            
            messages.append({"role": "user", "content": prompt})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=max_tokens or self.max_tokens
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"[ERROR] LLM generation failed: {e}")
            return f"[GenAI error: {str(e)[:100]}]"
    
    def is_available(self) -> bool:
        """Check if LLM client is available."""
        return self.available


# Global singleton instance
_llm_client_instance = None

def get_llm_client() -> LLMClient:
    """Get the global LLM client instance."""
    global _llm_client_instance
    if _llm_client_instance is None:
        _llm_client_instance = LLMClient()
    return _llm_client_instance
