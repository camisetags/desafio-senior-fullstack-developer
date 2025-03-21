'use client';

import { useEffect, useState } from 'react';
import { Solicitacao, getSolicitacoes } from '../services/api';
import SolicitacaoCard from '../components/SolicitacaoCard';
import Link from 'next/link';

export default function Home() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      const data = await getSolicitacoes(page, limit);
      setSolicitacoes(data.solicitacoes);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar solicitações:', err);
      setError('Não foi possível carregar as solicitações. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Solicitações de Serviços Municipais</h1>
        <Link 
          href="/solicitacoes/nova" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
        >
          <span className="mr-2">+</span> Nova Solicitação
        </Link>
      </div>

      {loading && <p className="text-center py-10">Carregando solicitações...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error}
        </div>
      )}
      
      {!loading && solicitacoes.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Nenhuma solicitação encontrada.</p>
          <Link href="/solicitacoes/nova" className="text-blue-600 hover:underline">
            Criar a primeira solicitação
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solicitacoes.map(solicitacao => (
          <SolicitacaoCard key={solicitacao.id} solicitacao={solicitacao} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Anterior
            </button>
            
            <div className="text-sm">
              Página {page} de {totalPages}
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
}
