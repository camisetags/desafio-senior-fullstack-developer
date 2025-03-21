import os
import sys


sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import init_db
from app.models.solicitacao import Solicitacao, StatusEnum

def main():
    print("Criando tabelas no banco de dados...")
    try:
        init_db()
        print("Tabelas criadas com sucesso!")
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
