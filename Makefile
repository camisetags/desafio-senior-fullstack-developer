SHELL := /bin/bash
PYTHON := python3
VENV := venv
PIP := $(VENV)/bin/pip
PYTHON_VENV := $(VENV)/bin/python
DOCKER_COMPOSE := docker-compose
RAILWAY := railway

GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

.PHONY: setup start stop test deploy clean help db-init db-reset venv minio-setup

help:
	@echo -e "$(GREEN)Makefile para o projeto Serviços Municipais$(NC)"
	@echo -e "$(YELLOW)Comandos disponíveis:$(NC)"
	@echo "  make setup       - Configura o ambiente de desenvolvimento"
	@echo "  make start       - Inicia todos os serviços via Docker"
	@echo "  make stop        - Para todos os serviços Docker"
	@echo "  make test        - Executa os testes (backend, frontend ou ambos)"
	@echo "  make deploy      - Faz deploy para Railway"
	@echo "  make clean       - Remove arquivos gerados e caches"
	@echo "  make db-init     - Inicializa o banco de dados"
	@echo "  make db-reset    - Recria as tabelas do banco de dados"
	@echo "  make venv        - Cria e ativa ambiente virtual Python"
	@echo "  make minio-setup - Configura o bucket MinIO e permissões"

setup: venv
	@echo -e "$(GREEN)Instalando dependências do backend...$(NC)"
	$(PIP) install -r backend/requirements.txt
	@echo -e "$(GREEN)Configurando banco de dados...$(NC)"
	make db-init
	@echo -e "$(GREEN)Ambiente configurado com sucesso!$(NC)"

venv:
	@echo -e "$(GREEN)Criando ambiente virtual...$(NC)"
	$(PYTHON) -m venv $(VENV)
	@echo -e "$(YELLOW)Para ativar o ambiente virtual, execute:$(NC)"
	@echo "source $(VENV)/bin/activate"

db-init:
	@echo -e "$(GREEN)Inicializando banco de dados...$(NC)"
	cd backend && $(PYTHON_VENV) create_tables.py
	@echo -e "$(GREEN)Banco de dados inicializado!$(NC)"

db-reset:
	@echo -e "$(YELLOW)Recriando tabelas do banco de dados...$(NC)"
	@echo -e "$(RED)ATENÇÃO: Isso apagará todos os dados!$(NC)"
	@read -p "Continuar? (y/n) " confirm; \
	if [ "$$confirm" = "y" ]; then \
		cd backend && $(PYTHON_VENV) -c "from app.core.database import Base, engine; Base.metadata.drop_all(engine); Base.metadata.create_all(engine)"; \
		echo -e "$(GREEN)Tabelas recriadas com sucesso!$(NC)"; \
	else \
		echo -e "$(YELLOW)Operação cancelada.$(NC)"; \
	fi

start:
	@echo -e "$(GREEN)Iniciando todos os serviços...$(NC)"
	@if ! command -v docker >/dev/null 2>&1; then \
		echo -e "$(RED)Docker não está instalado. Por favor, instale o Docker.$(NC)"; \
		exit 1; \
	fi
	$(DOCKER_COMPOSE) up -d
	@echo -e "$(YELLOW)Configurando MinIO...$(NC)"
	@make minio-setup
	@echo -e "$(GREEN)Serviços iniciados em:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000/api"
	@echo "  Documentação API: http://localhost:8000/docs"
	@echo "  MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
	@echo -e "$(YELLOW)Para ver logs: $(NC)make logs"

stop:
	@echo -e "$(YELLOW)Parando todos os serviços...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo -e "$(GREEN)Serviços parados.$(NC)"

logs:
	$(DOCKER_COMPOSE) logs -f

test:
	@echo -e "$(GREEN)Qual componente deseja testar?$(NC)"
	@echo "1) Backend"
	@echo "2) Frontend"
	@echo "3) Ambos"
	@read -p "Escolha uma opção (1-3): " option; \
	case $$option in \
		1) make test-backend;; \
		2) make test-frontend;; \
		3) make test-backend test-frontend;; \
		*) echo -e "$(RED)Opção inválida!$(NC)";; \
	esac

test-backend:
	@echo -e "$(GREEN)Executando testes do backend...$(NC)"
	cd backend && $(PYTHON_VENV) -m pytest -v

test-frontend:
	@echo -e "$(GREEN)Executando testes do frontend...$(NC)"
	cd frontend && npm test

deploy:
	@echo -e "$(GREEN)O que deseja implantar no Railway?$(NC)"
	@echo "1) Backend"
	@echo "2) Frontend"
	@echo "3) Ambos"
	@read -p "Escolha uma opção (1-3): " option; \
	case $$option in \
		1) make deploy-backend;; \
		2) make deploy-frontend;; \
		3) make deploy-all;; \
		*) echo -e "$(RED)Opção inválida!$(NC)";; \
	esac

deploy-backend:
	@echo -e "$(GREEN)Implantando backend no Railway...$(NC)"
	@if ! command -v $(RAILWAY) >/dev/null 2>&1; then \
		echo -e "$(YELLOW)Railway CLI não encontrada. Instalando...$(NC)"; \
		npm i -g @railway/cli; \
	fi
	cd backend && $(RAILWAY) login && $(RAILWAY) link && $(RAILWAY) up

deploy-frontend:
	@echo -e "$(GREEN)Implantando frontend no Railway...$(NC)"
	@if ! command -v $(RAILWAY) >/dev/null 2>&1; then \
		echo -e "$(YELLOW)Railway CLI não encontrada. Instalando...$(NC)"; \
		npm i -g @railway/cli; \
	fi
	cd frontend && $(RAILWAY) login && $(RAILWAY) link && $(RAILWAY) up

deploy-all:
	@echo -e "$(GREEN)Implantando backend e frontend no Railway...$(NC)"
	@if ! command -v $(RAILWAY) >/dev/null 2>&1; then \
		echo -e "$(YELLOW)Railway CLI não encontrada. Instalando...$(NC)"; \
		npm i -g @railway/cli; \
	fi
	@echo -e "$(YELLOW)Implantando backend primeiro...$(NC)"
	cd backend && $(RAILWAY) login && $(RAILWAY) link
	$(eval BACKEND_URL := $(shell cd backend && $(RAILWAY) up --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4))
	@if [ -z "$(BACKEND_URL)" ]; then \
		echo -e "$(YELLOW)Não foi possível obter URL do backend automaticamente.$(NC)"; \
		read -p "Por favor, insira a URL do backend manualmente: " backend_url; \
		BACKEND_URL=$$backend_url; \
	else \
		echo -e "$(GREEN)Backend implantado em: $(BACKEND_URL)$(NC)"; \
	fi
	@echo -e "$(YELLOW)Agora implantando o frontend...$(NC)"
	cd frontend && $(RAILWAY) login && $(RAILWAY) link
	cd frontend && $(RAILWAY) variables set NEXT_PUBLIC_BACKEND_URL=$(BACKEND_URL)
	cd frontend && $(RAILWAY) variables set NEXT_PUBLIC_API_URL=$(BACKEND_URL)/api
	cd frontend && $(RAILWAY) up
	@echo -e "$(GREEN)Deploy concluído com sucesso!$(NC)"

clean:
	@echo -e "$(YELLOW)Removendo arquivos temporários e caches...$(NC)"
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
	find . -type d -name node_modules -exec rm -rf {} +
	find . -type d -name .next -exec rm -rf {} +
	@echo -e "$(GREEN)Limpeza concluída.$(NC)"

minio-setup:
	@echo -e "$(GREEN)Configurando MinIO para o projeto...$(NC)"
	@if ! docker info > /dev/null 2>&1; then \
		echo -e "$(RED)Docker não está rodando. Por favor, inicie o Docker e tente novamente.$(NC)"; \
		exit 1; \
	fi
	
	@MINIO_RUNNING=$$(docker ps --filter "name=minio" -q); \
	if [ -z "$$MINIO_RUNNING" ]; then \
		echo -e "$(YELLOW)O container do MinIO não está rodando. Iniciando serviços...$(NC)"; \
		$(DOCKER_COMPOSE) up -d minio; \
		echo -e "$(GREEN)Aguardando o serviço do MinIO iniciar...$(NC)"; \
		sleep 5; \
	fi
	
	@echo -e "$(GREEN)Criando bucket 'solicitacoes' e configurando permissões...$(NC)"
	
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc alias set myminio http://minio:9000 minioadmin minioadmin || true
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc mb --ignore-existing myminio/solicitacoes || true
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc policy set download myminio/solicitacoes || true
	
	@echo -e "$(GREEN)Criando bucket 'images' e configurando permissões...$(NC)"
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc mb --ignore-existing myminio/images || true
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc policy set public myminio/images || true
	
	@echo -e "$(GREEN)Listando todos os buckets configurados:$(NC)"
	@docker run --rm --network full_stack_senior_prefeitura_app-network minio/mc ls myminio || true
	
	@echo -e "$(GREEN)MinIO configurado! Você pode acessar em:$(NC)"
	@echo -e "$(GREEN)- MinIO API: http://localhost:9000$(NC)"
	@echo -e "$(GREEN)- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)$(NC)"
	@echo -e "$(YELLOW)Importante: As imagens agora serão armazenadas no bucket 'images' no MinIO$(NC)"
