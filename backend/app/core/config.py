import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings


dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env')
load_dotenv(dotenv_path)


if not os.environ.get("DOCKER_ENVIRONMENT") and not os.environ.get("RAILWAY_ENVIRONMENT"):
    os.environ["DATABASE_URL"] = "sqlite:///./sql_app.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Plataforma de Solicitação de Serviços Municipais")
    API_PREFIX: str = os.getenv("API_PREFIX", "/api")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # Redis settings
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    REDIS_CACHE_ENABLED: bool = os.getenv("REDIS_CACHE_ENABLED", "True").lower() == "true"
    REDIS_CACHE_EXPIRE: int = int(os.getenv("REDIS_CACHE_EXPIRE", "300"))  # Default 5 minutos
    
    # CORS
    ALLOWED_ORIGINS_STR: str = os.getenv("ALLOWED_ORIGINS", '["http://localhost:3000"]')
    
    @property
    def ALLOWED_ORIGINS(self) -> list:
        try:
            import ast
            origins = ast.literal_eval(self.ALLOWED_ORIGINS_STR)

            if os.getenv("FRONTEND_URL"):
                origins.append(os.getenv("FRONTEND_URL"))

            if self.ENVIRONMENT != "production":
                origins.append("*")

            if os.getenv("RAILWAY_ENVIRONMENT"):
                origins.extend([
                    "https://*.up.railway.app", 
                    "https://*.railway.app",
                    "https://railway.app"
                ])
            
            return origins
        except:
            return ["http://localhost:3000", "*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

print(f"Ambiente: {settings.ENVIRONMENT}")
print(f"Configurações carregadas: DATABASE_URL={settings.DATABASE_URL}")
print(f"Redis Cache: {'Enabled' if settings.REDIS_CACHE_ENABLED else 'Disabled'}, URL={settings.REDIS_URL}")
print(f"CORS permitido para: {settings.ALLOWED_ORIGINS}")
