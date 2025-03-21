from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Enum as SQLEnum
from app.core.database import Base

class StatusEnum(str, Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDO = "concluido"

class Solicitacao(Base):
    __tablename__ = "solicitacoes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    categoria = Column(String(50), nullable=False)
    bairro = Column(String(100), nullable=False)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    status = Column(SQLEnum(StatusEnum), default=StatusEnum.PENDENTE)
    
    # Metadata
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    fotos_url = Column(Text, nullable=True)
