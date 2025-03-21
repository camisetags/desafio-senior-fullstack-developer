import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}


if settings.DATABASE_URL.startswith("sqlite"):
    db_path = settings.DATABASE_URL.replace("sqlite:///", "")
    if db_path.startswith('./'):
        db_path = db_path[2:]  # Remove './'
        
    db_dir = os.path.dirname(os.path.abspath(db_path)) if os.path.dirname(db_path) else '.'
    
    if not os.path.exists(db_dir) and db_dir != '.':
        try:
            os.makedirs(db_dir)
            print(f"Diretório criado: {db_dir}")
        except Exception as e:
            print(f"Erro ao criar diretório: {e}")

print(f"Conectando ao banco de dados: {settings.DATABASE_URL}")

try:
    engine = create_engine(
        settings.DATABASE_URL, connect_args=connect_args
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    print("Conexão com o banco de dados estabelecida com sucesso.")
except Exception as e:
    print(f"ERRO AO CONECTAR AO BANCO DE DADOS: {e}")
    print("Usando SQLite como fallback...")

    sqlite_url = "sqlite:///./sql_app.db" 
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, connect_args=connect_args)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models.solicitacao import Solicitacao, StatusEnum
    
    print("Criando tabelas no banco de dados...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tabelas criadas com sucesso no banco de dados.")
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")
        sys.exit(1)
