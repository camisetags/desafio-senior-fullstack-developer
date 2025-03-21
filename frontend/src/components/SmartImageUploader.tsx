'use client';

import { useState, useEffect } from 'react';
import MinIOImageUploader from './MinIOImageUploader';
import LocalStorageImageUploader from './LocalStorageImageUploader';

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
}

export default function SmartImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMinIOAvailability = async () => {
      try {
        const response = await fetch('/api/minio-test');
        const data = await response.json();
        
        if (data.status === 'success' && data.bucketExists) {
          console.log('MinIO está disponível e configurado corretamente.');
          setUseLocalStorage(false);
        } else {
          console.warn('MinIO não está totalmente configurado:', data);
          setUseLocalStorage(true);
        }
      } catch (error) {
        console.error('Erro ao verificar disponibilidade do MinIO:', error);
        setUseLocalStorage(true);
      } finally {
        setChecking(false);
      }
    };

    checkMinIOAvailability();
  }, []);

  if (checking) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">Verificando configuração de armazenamento...</p>
      </div>
    );
  }

  return useLocalStorage ? (
    <LocalStorageImageUploader onUploadSuccess={onUploadSuccess} />
  ) : (
    <MinIOImageUploader onUploadSuccess={onUploadSuccess} />
  );
}
