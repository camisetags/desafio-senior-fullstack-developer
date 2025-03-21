import json
import redis
from functools import wraps
from typing import Any, Callable, Dict, List, Type, TypeVar

from .config import settings


redis_client = None
fake_cache = {}

try:
    if settings.REDIS_CACHE_ENABLED:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

        redis_client.ping()
        print("Conexão com Redis estabelecida com sucesso.")
except Exception as e:
    print(f"Erro ao conectar ao Redis: {e}")
    print("Usando cache local em memória como fallback.")
    redis_client = None

def serialize_json(obj: Any) -> str:
    """Serializa objeto Python para JSON string"""
    return json.dumps(obj, default=str)

def deserialize_json(json_str: str) -> Any:
    """Deserializa JSON string para objeto Python"""
    return json.loads(json_str)

def get_cache(key: str) -> Any:
    """Obtém um item do cache"""
    if redis_client:
        try:
            cached = redis_client.get(key)
            return deserialize_json(cached) if cached else None
        except:
            return None
    else:
        return fake_cache.get(key)

def set_cache(key: str, value: Any, expire: int = None) -> None:
    """Define um item no cache com tempo de expiração opcional"""
    serialized = serialize_json(value)
    
    if redis_client:
        try:
            redis_client.set(key, serialized)
            if expire is None:
                expire = settings.REDIS_CACHE_EXPIRE
            if expire > 0:
                redis_client.expire(key, expire)
        except Exception as e:
            print(f"Erro ao definir cache: {e}")
    else:
        fake_cache[key] = serialized

def delete_cache(key: str) -> None:
    """Remove um item do cache"""
    if redis_client:
        try:
            redis_client.delete(key)
        except Exception as e:
            print(f"Erro ao deletar cache: {e}")
    else:
        if key in fake_cache:
            del fake_cache[key]

def clear_cache_pattern(pattern: str) -> None:
    """Limpa todas as chaves que correspondam ao padrão"""
    if redis_client:
        try:
            cursor = 0
            while True:
                cursor, keys = redis_client.scan(cursor, match=pattern, count=100)
                if keys:
                    redis_client.delete(*keys)
                if cursor == 0:
                    break
        except Exception as e:
            print(f"Erro ao limpar cache com padrão {pattern}: {e}")
    else:
        for key in list(fake_cache.keys()):
            if key.startswith(pattern.replace("*", "")):
                del fake_cache[key]


F = TypeVar('F', bound=Callable[..., Any])

def cached(expire: int = None, key_prefix: str = "cache"):
    """Decorator para cache de funções"""
    def decorator(func: F) -> F:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{key_prefix}:{func.__name__}"

            if args:
                cache_key += f":{str(args)}"
            if kwargs:
                cache_key += f":{str(kwargs)}"
            
            cached_result = get_cache(cache_key)
            if cached_result is not None:
                print(f"Cache hit para {cache_key}")
                return cached_result

            print(f"Cache miss para {cache_key}")
            result = await func(*args, **kwargs)

            set_cache(cache_key, result, expire)
            
            return result
        return wrapper
    return decorator
