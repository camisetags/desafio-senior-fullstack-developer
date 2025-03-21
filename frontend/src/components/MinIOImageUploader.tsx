'use client';

import { useState } from 'react';
import axios from 'axios';

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
}

export default function MinIOImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    try {
      setUploading(true);
      setError(null);
      
      const uploadedUrls: string[] = [];
      const progressTracking: Record<string, number> = {};
      
      for (let i = 0; i < event.target.files.length; i++) {
        progressTracking[i.toString()] = 0;
      }
      setUploadProgress(progressTracking);
      
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileKey = i.toString();
        

        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
        
        console.log(`[${i+1}/${event.target.files.length}] Solicitando URL para upload:`, fileName);
        
        try {
          const response = await axios.get('/api/upload-url', {
            params: {
              fileName,
              contentType: file.type
            }
          });
          
          const { presignedUrl, fileUrl, mock } = response.data;
          
          console.log('URL pré-assinada obtida:', presignedUrl);
          console.log('URL de acesso ao arquivo:', fileUrl);
          
          if (mock) {
            console.log('Usando modo de mock para upload');
            await axios.put(presignedUrl, file);
            uploadedUrls.push(URL.createObjectURL(file));
          } else {
            await axios.put(presignedUrl, file, {
              headers: {
                'Content-Type': file.type
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  setUploadProgress(prev => ({
                    ...prev,
                    [fileKey]: percentCompleted
                  }));
                }
              }
            });
            
            console.log('Upload bem-sucedido para:', fileUrl);
            uploadedUrls.push(fileUrl);
          }
        } catch (err) {
          console.error(`Erro no upload do arquivo ${fileName}:`, err);
        }
      }
      
      if (uploadedUrls.length > 0) {
        onUploadSuccess(uploadedUrls);
      } else {
        setError('Nenhum arquivo foi carregado com sucesso. Verifique se o MinIO está acessível.');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError(
        error instanceof Error 
          ? `Erro ao fazer upload: ${error.message}` 
          : 'Erro desconhecido ao fazer upload'
      );
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (event.target) event.target.value = '';
    }
  };

  const calculateOverallProgress = () => {
    const values = Object.values(uploadProgress);
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  return (
    <div className="mt-4">
      <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer">
        <span>{uploading ? 'Carregando...' : 'Adicionar fotos (MinIO)'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
      
      {uploading && (
        <div className="mt-2">
          <p className="text-sm">Enviando imagens... {Math.round(calculateOverallProgress())}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
