from fastapi import APIRouter, Response, status
from app.core.cache import clear_cache_pattern

router = APIRouter()

@router.post("/clear-cache", status_code=status.HTTP_200_OK)
async def clear_cache():
    """
    Limpar todo o cache (apenas para administração)
    """
    try:
        clear_cache_pattern("*")
        return {"message": "Cache limpo com sucesso"}
    except Exception as e:
        return {"error": f"Erro ao limpar cache: {str(e)}"}

@router.get("/health", status_code=status.HTTP_200_OK)
async def health():
    """
    Verificar saúde do sistema admin
    """
    return {"status": "OK"}
