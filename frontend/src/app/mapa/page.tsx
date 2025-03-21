'use client';

import { useEffect, useState } from 'react';
import { getSolicitacoes, Solicitacao } from '../../services/api';
import dynamic from 'next/dynamic';
import StatusBadge from '../../components/StatusBadge';
import Link from 'next/link';


const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapaPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bairroFilter, setBairroFilter] = useState<string>('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('');


  const mapCenter: [number, number] = [-22.9068, -43.1729];

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        setLoading(true);

        const data = await getSolicitacoes(1, 100);
        setSolicitacoes(data.solicitacoes);
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err);
        setError('Não foi possível carregar os dados para o mapa.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);


  const solicitacoesComCoordenadas = solicitacoes.filter(
    s => s.latitude && s.longitude
  );


  const bairros = [...new Set(solicitacoes.map(s => s.bairro))].sort();


  const categorias = [...new Set(solicitacoes.map(s => s.categoria))].sort();


  const solicitacoesFiltradas = solicitacoesComCoordenadas.filter(s => {
    if (bairroFilter && s.bairro !== bairroFilter) return false;
    if (categoriaFilter && s.categoria !== categoriaFilter) return false;
    return true;
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mapa de Solicitações</h1>
        <p className="text-gray-600">
          Visualize todas as solicitações de serviços no mapa da cidade.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Filtrar por Bairro</label>
            <select
              value={bairroFilter}
              onChange={(e) => setBairroFilter(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Todos os Bairros</option>
              {bairros.map((bairro) => (
                <option key={bairro} value={bairro}>
                  {bairro}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Filtrar por Categoria</label>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setBairroFilter('');
                setCategoriaFilter('');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p>Carregando mapa...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div>
            <div className="h-[600px] mb-4">
              {typeof window !== 'undefined' && (
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {solicitacoesFiltradas.map((solicitacao) => (
                    <Marker
                      key={solicitacao.id}
                      position={[solicitacao.latitude!, solicitacao.longitude!]}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-bold">{solicitacao.titulo}</h3>
                          <p className="text-sm text-gray-600">{solicitacao.categoria} | {solicitacao.bairro}</p>
                          <div className="my-2">
                            <StatusBadge status={solicitacao.status} />
                          </div>
                          <Link 
                            href={`/solicitacoes/${solicitacao.id}`}
                            className="text-blue-600 hover:underline text-sm block mt-2"
                          >
                            Ver detalhes
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-sm font-medium mb-2">Legenda:</p>
              <div className="grid grid-cols-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Pendente</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Em Andamento</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Concluído</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total de solicitações no mapa: {solicitacoesFiltradas.length} 
              {(bairroFilter || categoriaFilter) && ' (filtradas)'} 
              de {solicitacoesComCoordenadas.length}.
            </p>
            
            {solicitacoesComCoordenadas.length === 0 && (
              <div className="mt-4 text-center p-4 border border-dashed rounded">
                <p>Não há solicitações com coordenadas geográficas no sistema.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
