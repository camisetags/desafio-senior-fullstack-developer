import json
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.solicitacao import Solicitacao, StatusEnum
from app.schemas.solicitacao import SolicitacaoCreate, SolicitacaoUpdate

class SolicitacaoRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, solicitacao_id: int) -> Optional[Solicitacao]:
        return self.db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
    
    def list_all(self, skip: int = 0, limit: int = 100) -> List[Solicitacao]:
        return self.db.query(Solicitacao).order_by(Solicitacao.criado_em.desc()).offset(skip).limit(limit).all()
        
    def get_count(self) -> int:
        return self.db.query(Solicitacao).count()
    
    def create(self, solicitacao: SolicitacaoCreate) -> Solicitacao:
        # Convert list of photo URLs to JSON string
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
        self.db.add(db_solicitacao)
        self.db.commit()
        self.db.refresh(db_solicitacao)
        return db_solicitacao
    
    def update_status(self, solicitacao_id: int, update: SolicitacaoUpdate) -> Optional[Solicitacao]:
        db_solicitacao = self.get_by_id(solicitacao_id)
        if not db_solicitacao:
            return None
            
        db_solicitacao.status = update.status
        self.db.commit()
        self.db.refresh(db_solicitacao)
        return db_solicitacao
