from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.solicitacao import SolicitacaoCreate, SolicitacaoResponse, SolicitacaoUpdate, SolicitacaoList
from app.services.solicitacao_service import SolicitacaoService

router = APIRouter()

@router.post("/", response_model=SolicitacaoResponse, status_code=201)
async def create_solicitacao(
    solicitacao: SolicitacaoCreate,
    db: Session = Depends(get_db)
):
    """
    Criar uma nova solicitação de serviço.
    """
    result = await SolicitacaoService.create_solicitacao(db, solicitacao)
    return result

@router.get("/", response_model=SolicitacaoList)
async def list_solicitacoes(
    skip: int = Query(0, ge=0, description="Items para pular"),
    limit: int = Query(100, ge=1, le=100, description="Limite de itens para retornar"),
    db: Session = Depends(get_db)
):
    """
    Listar todas as solicitações com paginação.
    """
    result = await SolicitacaoService.list_solicitacoes(db, skip, limit)
    return result

@router.get("/{solicitacao_id}", response_model=SolicitacaoResponse)
async def get_solicitacao(
    solicitacao_id: int,
    db: Session = Depends(get_db)
):
    """
    Obter detalhes de uma solicitação específica.
    """
    result = await SolicitacaoService.get_solicitacao(db, solicitacao_id)
    if not result:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    return result

@router.patch("/{solicitacao_id}", response_model=SolicitacaoResponse)
async def update_solicitacao_status(
    solicitacao_id: int,
    update: SolicitacaoUpdate,
    db: Session = Depends(get_db)
):
    """
    Atualizar o status de uma solicitação.
    """
    result = await SolicitacaoService.update_solicitacao_status(db, solicitacao_id, update)
    if not result:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    return result
