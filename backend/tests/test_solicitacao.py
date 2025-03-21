import json
from app.models.solicitacao import StatusEnum

def test_create_solicitacao(client):
    solicitacao_data = {
        "titulo": "Buraco na rua",
        "descricao": "Buraco grande na Av. Principal",
        "categoria": "Pavimentação",
        "bairro": "Centro",
        "latitude": -22.9035,
        "longitude": -43.2096,
        "fotos_url": ["http://example.com/photo1.jpg"]
    }
    
    response = client.post("/api/solicitacoes/", json=solicitacao_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["titulo"] == solicitacao_data["titulo"]
    assert data["status"] == StatusEnum.PENDENTE
    assert "id" in data

def test_list_solicitacoes(client):
    solicitacao_data = {
        "titulo": "Teste de listagem",
        "descricao": "Descrição de teste",
        "categoria": "Teste",
        "bairro": "Centro",
    }
    client.post("/api/solicitacoes/", json=solicitacao_data)

    response = client.get("/api/solicitacoes/")
    assert response.status_code == 200
    
    data = response.json()
    assert "solicitacoes" in data
    assert "total" in data
    assert data["total"] >= 1
    assert len(data["solicitacoes"]) >= 1

def test_get_solicitacao(client):
    solicitacao_data = {
        "titulo": "Teste de detalhe",
        "descricao": "Descrição de teste",
        "categoria": "Teste",
        "bairro": "Centro",
    }
    create_response = client.post("/api/solicitacoes/", json=solicitacao_data)
    solicitacao_id = create_response.json()["id"]

    response = client.get(f"/api/solicitacoes/{solicitacao_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == solicitacao_id
    assert data["titulo"] == solicitacao_data["titulo"]

def test_update_solicitacao_status(client):
    solicitacao_data = {
        "titulo": "Teste de atualização",
        "descricao": "Descrição de teste",
        "categoria": "Teste",
        "bairro": "Centro",
    }
    create_response = client.post("/api/solicitacoes/", json=solicitacao_data)
    solicitacao_id = create_response.json()["id"]

    update_data = {"status": StatusEnum.EM_ANDAMENTO}
    response = client.patch(f"/api/solicitacoes/{solicitacao_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == solicitacao_id
    assert data["status"] == StatusEnum.EM_ANDAMENTO
