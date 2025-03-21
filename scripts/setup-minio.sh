#!/bin/sh

# Script compatível com Alpine Linux (usado no container minio/mc)
mc alias set myminio http://minio:9000 minioadmin minioadmin
mc mb --ignore-existing myminio/solicitacoes
mc anonymous set download myminio/solicitacoes

echo "Bucket 'solicitacoes' configurado com sucesso!"
