import os
import sys


sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import uvicorn
from app.core.database import init_db
from app.models.solicitacao import Solicitacao, StatusEnum

if __name__ == "__main__":
    print("Inicializando o banco de dados...")
    try:
        init_db()
        print("Banco de dados inicializado com sucesso!")
    except Exception as e:
        print(f"Erro ao inicializar o banco de dados: {e}")

    print("Iniciando o servidor...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
