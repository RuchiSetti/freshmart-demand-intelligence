"""
Configuration management using Pydantic Settings.
Loads environment variables and provides centralized config access.
"""
from pydantic_settings import BaseSettings
from pathlib import Path
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    MODELS_CACHE_DIR: Path = BASE_DIR / "models_cache"
    LOGS_DIR: Path = BASE_DIR / "logs"
    
    # Model Configuration
    MODEL_TYPE: str = "xgboost"  # baseline, prophet, or xgboost
    FORECAST_HORIZON_DAYS: int = 7
    
    # GenAI Configuration
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-3.5-turbo"  # or gpt-4, llama-3, etc.
    LLM_TEMPERATURE: float = 0.3  # Low temp for consistent explanations
    LLM_MAX_TOKENS: int = 200
    
    # API Settings
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    API_KEY: str = "demo_api_key_12345"  # Legacy API key (kept for backward compatibility)
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # JWT Authentication Settings
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production-use-env-var"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application Settings
    APP_NAME: str = "FreshMart Demand Forecasting API"
    APP_VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    def create_directories(self):
        """Create necessary directories if they don't exist."""
        self.DATA_DIR.mkdir(exist_ok=True)
        self.MODELS_CACHE_DIR.mkdir(exist_ok=True)
        self.LOGS_DIR.mkdir(exist_ok=True)


# Global settings instance
settings = Settings()
settings.create_directories()
