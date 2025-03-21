from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para o sistema de Solicitação de Serviços Municipais",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


@app.get("/")
async def root():
    return {"message": "API ativa e funcionando! Acesse /docs para a documentação."}

@app.on_event("startup")
async def startup_db_client():
    init_db()
    print("Banco de dados inicializado com sucesso!")
    print(f"CORS configurado para aceitar origens: {settings.ALLOWED_ORIGINS}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
