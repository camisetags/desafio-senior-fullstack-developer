# Desafio Técnico – Desenvolvedor(a) Full-Stack (Sênior)

## 📌 Contexto

A Prefeitura do Rio de Janeiro quer oferecer aos cidadãos uma Plataforma de Solicitação de Serviços Municipais, onde qualquer pessoa pode solicitar reparos urbanos (como buracos na rua, semáforos quebrados, coleta de entulho, entre outros). O sistema deve permitir que os moradores cadastrem solicitações, acompanhem o status dos pedidos e visualizem demandas já registradas em sua região.

Seu desafio é desenvolver uma aplicação full-stack usando Next.js no front-end e FastAPI no back-end para oferecer essa funcionalidade de maneira eficiente e escalável.

## 🚀 Solução Implementada

### 🔹 Arquitetura do Backend

O backend foi desenvolvido utilizando uma arquitetura limpa com as seguintes camadas:

- API Layer: Controllers/rotas que expõem os endpoints REST
- Service Layer: Contém a lógica de negócio
- Repository Layer: Responsável pelo acesso ao banco de dados
- Models Layer: Define os modelos de dados e schemas
- Core Layer: Configurações e elementos centrais da aplicação

### 🔹 Tecnologias Utilizadas

- **Backend**:
  - FastAPI: Framework web de alta performance
  - SQLAlchemy: ORM para manipulação de banco de dados
  - Pydantic: Validação de dados e serialização
  - PostgreSQL/SQLite: Banco de dados relacional
  - Pytest: Framework de testes

- **DevOps**:
  - Docker: Containerização da aplicação
  - Docker Compose: Orquestração dos serviços

## 💻 Como Executar o Projeto

### Método 1: Com Docker (Recomendado)

O projeto possui um Makefile que simplifica todos os comandos necessários para executar a aplicação.

#### Pré-requisitos
- Docker e Docker Compose instalados
- Git
- Make (normalmente já incluído em sistemas Linux e macOS)

#### Passos para execução usando Makefile

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd full_stack_senior_prefeitura
   ```

2. Iniciar todos os serviços:
   ```bash
   make start
   ```
   Isso iniciará o backend, frontend, banco de dados e MinIO, e configurará o bucket necessário automaticamente.

3. Acessar a aplicação:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Documentação da API: http://localhost:8000/docs
   - MinIO Console: http://localhost:9001 (usuário: minioadmin, senha: minioadmin)

4. Para parar todos os serviços:
   ```bash
   make stop
   ```

5. Para ver os logs de todos os serviços:
   ```bash
   make logs
   ```

#### Outros comandos úteis do Makefile

- `make test` - Executar todos os testes (backend e frontend)
- `make test-backend` - Executar apenas os testes do backend
- `make test-frontend` - Executar apenas os testes do frontend
- `make db-init` - Inicializar o banco de dados
- `make db-reset` - Recriar as tabelas do banco de dados (apaga dados existentes)
- `make minio-setup` - Configurar o MinIO manualmente (buckets e permissões)
- `make clean` - Limpar arquivos temporários e caches

Para ver todos os comandos disponíveis:
```bash
make help
```

### Método 2: Sem Docker (Desenvolvimento Local)

#### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes do Python)
- SQLite ou PostgreSQL

#### Passos para execução

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd full_stack_senior_prefeitura
   ```

2. Crie e ative um ambiente virtual (recomendado):
   ```bash
   # No Linux/macOS
   python -m venv venv
   source venv/bin/activate

   # No Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. Instale as dependências:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente:
   ```bash
   # Linux/macOS
   export DATABASE_URL="sqlite:///./sql_app.db"
   export PROJECT_NAME="Plataforma de Solicitação de Serviços Municipais"
   export API_PREFIX="/api"
   export ALLOWED_ORIGINS='["http://localhost:3000"]'

   # Windows (PowerShell)
   $env:DATABASE_URL="sqlite:///./sql_app.db"
   $env:PROJECT_NAME="Plataforma de Solicitação de Serviços Municipais"
   $env:API_PREFIX="/api"
   $env:ALLOWED_ORIGINS='["http://localhost:3000"]'
   ```

5. Execute a aplicação:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Acesse a API em: http://localhost:8000/api/
7. Documentação da API: http://localhost:8000/docs

### Executando testes

Usando Makefile:
```bash
make test
```

Ou manualmente:
```bash
cd backend
pytest
```

## 🔍 Estrutura do Projeto

```
/
├── backend/                  # Código do backend em FastAPI
│   ├── app/                  # Código da aplicação
│   │   ├── api/              # API routes e controllers
│   │   ├── core/             # Configurações centrais
│   │   ├── models/           # Modelos do banco de dados
│   │   ├── repositories/     # Camada de acesso a dados
│   │   ├── schemas/          # Schemas para validação
│   │   ├── services/         # Camada de serviços (lógica de negócio)
│   │   └── main.py           # Ponto de entrada da aplicação
│   ├── tests/                # Testes automatizados
│   ├── Dockerfile            # Dockerfile para o backend
│   └── requirements.txt      # Dependências do Python
├── .env                      # Variáveis de ambiente
├── docker-compose.yml        # Configuração do Docker Compose
└── README.md                 # Documentação do projeto
```

## ✨ Requisitos do Desafio

### 🔹 Funcionalidades Esperadas

#### Frontend (Next.js)

- Página principal com:
    - Lista de solicitações mais recentes, incluindo título, categoria, bairro e status (pendente, em andamento, concluído).
    - Botão para registrar uma nova solicitação.

- Página de detalhe de solicitação:
    - Exibir todas as informações da solicitação.
    - Permitir que o usuário acompanhe o status da solicitação.

- Formulário de nova solicitação:
    - Campos: Título, descrição, categoria, bairro, fotos (upload opcional).
    - Validação dos campos obrigatórios.

- Mapa interativo:
    - Exibir as solicitações em um mapa, permitindo visualizar as ocorrências por bairro.

#### Backend (FastAPI)

- API RESTful para gerenciar solicitações com os seguintes endpoints:
    - ✅ POST /solicitacoes/ → Criar uma nova solicitação.
    - ✅ GET /solicitacoes/ → Listar todas as solicitações.
    - ✅ GET /solicitacoes/{id}/ → Obter detalhes de uma solicitação específica.
    - ✅ PATCH /solicitacoes/{id}/ → Atualizar o status da solicitação.

- ✅ Banco de Dados: Usar PostgreSQL (ou SQLite para desenvolvimento).
- ✅ ORM: Usar SQLAlchemy para manipulação do banco.

### 🔹 Requisitos Técnicos

- Next.js para o front-end, com SSR (Server-Side Rendering) e otimizações de performance.
- ✅ FastAPI para o back-end, estruturado de forma modular e bem organizada.
- Gerenciamento de estado no front-end (Redux, Context API, Zustand, etc).
- ✅ Banco de dados relacional para armazenar as solicitações.
- ✅ Testes automatizados no back-end.
- ✅ Docker para facilitar o setup do projeto.
- ✅ Documentação clara sobre como rodar o projeto.


