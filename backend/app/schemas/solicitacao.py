from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.solicitacao import StatusEnum


class SolicitacaoBase(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=100, description="Título da solicitação")
    descricao: str = Field(..., description="Descrição detalhada da solicitação")
    categoria: str = Field(..., min_length=2, max_length=50, description="Categoria do serviço solicitado")
    bairro: str = Field(..., min_length=2, max_length=100, description="Bairro onde o serviço deve ser realizado")

    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SolicitacaoCreate(SolicitacaoBase):
    fotos_url: Optional[List[str]] = None


class SolicitacaoUpdate(BaseModel):
    status: StatusEnum = Field(..., description="Novo status da solicitação")


class SolicitacaoResponse(SolicitacaoBase):
    id: int
    status: StatusEnum
    criado_em: datetime
    atualizado_em: datetime
    fotos_url: Optional[List[str]] = None

    class Config:
        orm_mode = True
        

class SolicitacaoList(BaseModel):
    solicitacoes: List[SolicitacaoResponse]
    total: int
