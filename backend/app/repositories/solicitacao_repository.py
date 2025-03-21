import json
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.solicitacao import Solicitacao, StatusEnum
from app.schemas.solicitacao import SolicitacaoCreate, SolicitacaoUpdate

class SolicitacaoRepository:
    @staticmethod
    def get_by_id(db: Session, solicitacao_id: int) -> Optional[Solicitacao]:
        return db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
    
    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 100) -> List[Solicitacao]:
        return db.query(Solicitacao).order_by(Solicitacao.criado_em.desc()).offset(skip).limit(limit).all()
        
    @staticmethod
    def get_count(db: Session) -> int:
        return db.query(Solicitacao).count()
    
    @staticmethod
    def create(db: Session, solicitacao: SolicitacaoCreate) -> Solicitacao:
        fotos_url = json.dumps(solicitacao.fotos_url) if solicitacao.fotos_url else None
        
        db_solicitacao = Solicitacao(
            titulo=solicitacao.titulo,
            descricao=solicitacao.descricao,
            categoria=solicitacao.categoria,
            bairro=solicitacao.bairro,
            latitude=solicitacao.latitude,
            longitude=solicitacao.longitude,
            fotos_url=fotos_url,
        )
        db.add(db_solicitacao)
        db.commit()
        db.refresh(db_solicitacao)
        return db_solicitacao
    
    @staticmethod
    def update_status(db: Session, solicitacao_id: int, update: SolicitacaoUpdate) -> Optional[Solicitacao]:
        db_solicitacao = SolicitacaoRepository.get_by_id(db, solicitacao_id)
        if not db_solicitacao:
            return None
            
        db_solicitacao.status = update.status
        db.commit()
        db.refresh(db_solicitacao)
        return db_solicitacao
