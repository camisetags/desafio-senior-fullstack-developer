import Link from 'next/link';
import { Solicitacao } from '../services/api';
import { formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';

interface SolicitacaoCardProps {
  solicitacao: Solicitacao;
}

const SolicitacaoCard = ({ solicitacao }: SolicitacaoCardProps) => {
  return (
    <Link 
      href={`/solicitacoes/${solicitacao.id}`}
      className="block border rounded-lg hover:shadow-md transition p-4 mb-4 bg-white"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{solicitacao.titulo}</h3>
        <StatusBadge status={solicitacao.status} />
      </div>
      
      <div className="text-gray-600 mt-2">
        <div className="flex items-center mb-1">
          <span className="mr-2">📂</span>
          <span>{solicitacao.categoria}</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="mr-2">📍</span>
          <span>{solicitacao.bairro}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="mr-2">📅</span>
          <span>{formatDate(solicitacao.criado_em)}</span>
        </div>
      </div>
    </Link>
  );
};

export default SolicitacaoCard;
