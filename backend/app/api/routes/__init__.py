from fastapi import APIRouter

from app.api.routes.solicitacao import router as solicitacao_router
from app.api.routes.admin import router as admin_router

router = APIRouter()
router.include_router(solicitacao_router, prefix="/solicitacoes", tags=["solicitacoes"])
router.include_router(admin_router, prefix="/admin", tags=["admin"])
