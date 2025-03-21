import pytest
import fakeredis
import json
from unittest.mock import patch, MagicMock

from app.core.cache import get_cache, set_cache, delete_cache, clear_cache_pattern, cached


redis_client = fakeredis.FakeStrictRedis()

@pytest.fixture(scope="function")
def mock_redis():
    with patch('app.core.cache.redis_client', redis_client):
        yield

def test_set_and_get_cache(mock_redis):
    key = "test_key"
    value = {"name": "Test", "value": 123}
    
    set_cache(key, value)
    result = get_cache(key)
    
    assert result == value

def test_delete_cache(mock_redis):
    key = "test_delete"
    value = {"name": "Delete me"}
    
    set_cache(key, value)
    assert get_cache(key) == value
    
    delete_cache(key)
    assert get_cache(key) is None

def test_clear_cache_pattern(mock_redis):
    set_cache("prefix:key1", "value1")
    set_cache("prefix:key2", "value2")
    set_cache("other:key3", "value3")

    clear_cache_pattern("prefix:*")
    
    assert get_cache("prefix:key1") is None
    assert get_cache("prefix:key2") is None
    assert get_cache("other:key3") == "value3"

@pytest.mark.asyncio
async def test_cached_decorator(mock_redis):
    call_count = 0
    
    @cached(key_prefix="test_decorator")
    async def test_function(param):
        nonlocal call_count
        call_count += 1
        return f"Result {param}"

    result1 = await test_function("abc")
    assert result1 == "Result abc"
    assert call_count == 1

    result2 = await test_function("abc")
    assert result2 == "Result abc"
    assert call_count == 1 
    
    result3 = await test_function("def")
    assert result3 == "Result def"
    assert call_count == 2
