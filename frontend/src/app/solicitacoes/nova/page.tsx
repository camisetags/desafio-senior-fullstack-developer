'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSolicitacao } from '../../../services/api';
import Link from 'next/link';
import SmartImageUploader from '../../../components/SmartImageUploader';


const categorias = [
  'Pavimentação',
  'Iluminação',
  'Sinalização',
  'Coleta de Lixo',
  'Poda de Árvores',
  'Semáforo',
  'Limpeza Urbana',
  'Esgoto',
  'Transporte',
  'Outros'
];


const bairros = [
  'Barra da Tijuca',
  'Botafogo',
  'Centro',
  'Copacabana',
  'Ipanema',
  'Leblon',
  'Madureira',
  'Méier',
  'Tijuca',
  'Jacarepaguá',
  'Flamengo',
  'Laranjeiras',
  'Outro'
];

export default function NovaSolicitacao() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    bairro: '',
    latitude: '',
    longitude: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUploadSuccess = (urls: string[]) => {
    setFotosUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setFotosUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);

      const requiredFields = ['titulo', 'descricao', 'categoria', 'bairro'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setError(`O campo ${field} é obrigatório`);
          setIsLoading(false);
          return;
        }
      }

      await createSolicitacao({
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        fotos_url: fotosUrls.length > 0 ? fotosUrls : undefined
      });

      router.push('/');
      
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      setError('Não foi possível criar a solicitação. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      },
      () => {
        alert('Não foi possível obter sua localização');
      }
    );
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <span className="mr-1">←</span> Voltar para a lista
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Nova Solicitação de Serviço</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-primary">Título da Solicitação*</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-primary"
                required
                placeholder="Ex: Buraco na calçada"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-primary">Descrição*</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-primary"
                rows={5}
                required
                placeholder="Descreva o problema em detalhes"
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-primary">Categoria*</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-primary"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-primary">Bairro*</label>
              <select
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-primary"
                required
              >
                <option value="">Selecione um bairro</option>
                {bairros.map(bairro => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-primary">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-primary"
                placeholder="Ex: -22.9068"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-primary">Longitude</label>
              <div className="flex">
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full border rounded-l px-3 py-2 text-primary"
                  placeholder="Ex: -43.1729"
                />
                <button
                  type="button"
                  onClick={getLocation}
                  className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r"
                  title="Usar minha localização atual"
                >
                  📍
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-primary">Fotos (Opcional)</label>
              <div className="border rounded p-4">
                <div className="mb-4">
                  <SmartImageUploader onUploadSuccess={handleImageUploadSuccess} />
                </div>
                
                {fotosUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {fotosUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {fotosUrls.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma foto selecionada</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link href="/" className="px-4 py-2 mr-4 border rounded">
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
