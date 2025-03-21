'use client';

import { useState } from 'react';

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
}

export default function LocalStorageImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    try {
      setUploading(true);
      
      const urls: string[] = [];
      
      for (const file of event.target.files) {
        const url = URL.createObjectURL(file);
        urls.push(url);
      }
      
      onUploadSuccess(urls);
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      alert('Erro ao processar as imagens selecionadas.');
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  return (
    <div className="mt-4">
      <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-3 text-sm">
        Modo de demonstração: As imagens são armazenadas apenas localmente e serão perdidas ao recarregar a página.
      </div>
      <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer">
        <span>{uploading ? 'Processando...' : 'Adicionar fotos (local)'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
