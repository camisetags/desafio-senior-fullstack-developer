from typing import Dict, List, Optional, Any
from sqlalchemy.orm import Session

from app.repositories.solicitacao_repository import SolicitacaoRepository
from app.schemas.solicitacao import SolicitacaoCreate, SolicitacaoUpdate, SolicitacaoResponse
from app.models.solicitacao import Solicitacao
import json

class SolicitacaoService:
    @staticmethod
    def get_solicitacao(db: Session, solicitacao_id: int) -> Optional[Dict[str, Any]]:
        db_solicitacao = SolicitacaoRepository.get_by_id(db, solicitacao_id)
        if not db_solicitacao:
            return None
        return SolicitacaoService._prepare_solicitacao_response(db_solicitacao)
    
    @staticmethod
    def list_solicitacoes(db: Session, skip: int = 0, limit: int = 100) -> Dict[str, Any]:
        solicitacoes = SolicitacaoRepository.list_all(db, skip, limit)
        total = SolicitacaoRepository.get_count(db)
        
        return {
            "solicitacoes": [SolicitacaoService._prepare_solicitacao_response(s) for s in solicitacoes],
            "total": total
        }
    
    @staticmethod
    def create_solicitacao(db: Session, solicitacao: SolicitacaoCreate) -> Dict[str, Any]:
        db_solicitacao = SolicitacaoRepository.create(db, solicitacao)
        return SolicitacaoService._prepare_solicitacao_response(db_solicitacao)
    
    @staticmethod
    def update_solicitacao_status(db: Session, solicitacao_id: int, update: SolicitacaoUpdate) -> Optional[Dict[str, Any]]:
        db_solicitacao = SolicitacaoRepository.update_status(db, solicitacao_id, update)
        if not db_solicitacao:
            return None
        return SolicitacaoService._prepare_solicitacao_response(db_solicitacao)
    
    @staticmethod
    def _prepare_solicitacao_response(solicitacao: Solicitacao) -> Dict[str, Any]:
        """Convert the Solicitacao model to a dict and handle the JSON fields"""
        result = {
            "id": solicitacao.id,
            "titulo": solicitacao.titulo,
            "descricao": solicitacao.descricao,
            "categoria": solicitacao.categoria,
            "bairro": solicitacao.bairro,
            "latitude": solicitacao.latitude,
            "longitude": solicitacao.longitude,
            "status": solicitacao.status,
            "criado_em": solicitacao.criado_em,
            "atualizado_em": solicitacao.atualizado_em,
            "fotos_url": json.loads(solicitacao.fotos_url) if solicitacao.fotos_url else None,
        }
        return result
