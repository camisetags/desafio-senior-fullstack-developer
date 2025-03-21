'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Solicitacao, getSolicitacao, updateSolicitacaoStatus } from '../../../services/api';
import StatusBadge from '../../../components/StatusBadge';
import { formatDate } from '../../../utils/formatters';

export default function SolicitacaoDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchSolicitacao = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await getSolicitacao(Number(id));
      setSolicitacao(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar solicitação:', err);
      setError('Não foi possível carregar os detalhes da solicitação.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSolicitacao();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: 'pendente' | 'em_andamento' | 'concluido') => {
    if (!id || !solicitacao) return;
    
    try {
      setUpdating(true);
      const updated = await updateSolicitacaoStatus(Number(id), { status: newStatus });
      setSolicitacao(updated);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível atualizar o status da solicitação.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Carregando detalhes da solicitação...</p>
      </div>
    );
  }

  if (error || !solicitacao) {
    return (
      <>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error || 'Solicitação não encontrada'}
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <span className="mr-1">←</span> Voltar para a lista
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{solicitacao.titulo}</h1>
          <StatusBadge status={solicitacao.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <p className="whitespace-pre-line">{solicitacao.descricao}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Categoria</p>
                <p>{solicitacao.categoria}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Bairro</p>
                <p>{solicitacao.bairro}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Data de Solicitação</p>
                <p>{formatDate(solicitacao.criado_em)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Última Atualização</p>
                <p>{formatDate(solicitacao.atualizado_em)}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <h2 className="text-lg font-semibold mb-4">Status da Solicitação</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange('pendente')}
                disabled={solicitacao.status === 'pendente' || updating}
                className={`w-full py-2 px-4 rounded ${
                  solicitacao.status === 'pendente'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 hover:bg-yellow-50 border'
                }`}
              >
                ⏳ Marcar como Pendente
              </button>
              
              <button
                onClick={() => handleStatusChange('em_andamento')}
                disabled={solicitacao.status === 'em_andamento' || updating}
                className={`w-full py-2 px-4 rounded ${
                  solicitacao.status === 'em_andamento'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 hover:bg-blue-50 border'
                }`}
              >
                🔧 Marcar em Andamento
              </button>
              
              <button
                onClick={() => handleStatusChange('concluido')}
                disabled={solicitacao.status === 'concluido' || updating}
                className={`w-full py-2 px-4 rounded ${
                  solicitacao.status === 'concluido'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 hover:bg-green-50 border'
                }`}
              >
                ✅ Marcar como Concluído
              </button>
            </div>
          </div>
        </div>
        
        {solicitacao.latitude && solicitacao.longitude && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Localização</h2>
            <div className="h-64 bg-gray-200 rounded overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${solicitacao.longitude-0.01}%2C${solicitacao.latitude-0.01}%2C${solicitacao.longitude+0.01}%2C${solicitacao.latitude+0.01}&layer=mapnik&marker=${solicitacao.latitude}%2C${solicitacao.longitude}`}
                style={{ border: 0 }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {solicitacao.fotos_url && solicitacao.fotos_url.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {solicitacao.fotos_url.map((url, index) => (
                <div key={index} className="border rounded overflow-hidden aspect-square relative">
                  <img
                    src={url}
                    alt={`Foto ${index + 1} da solicitação`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
