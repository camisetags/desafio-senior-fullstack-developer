import { render, screen } from '@testing-library/react';
import SolicitacaoCard from '../components/SolicitacaoCard';
import '@testing-library/jest-dom';


const mockSolicitacao = {
  id: 1,
  titulo: 'Teste de Solicitação',
  descricao: 'Descrição de teste',
  categoria: 'Pavimentação',
  bairro: 'Centro',
  status: 'pendente' as const,
  criado_em: '2023-10-20T10:00:00',
  atualizado_em: '2023-10-20T10:00:00',
};


jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('SolicitacaoCard', () => {
  it('renderiza corretamente as informações da solicitação', () => {
    render(<SolicitacaoCard solicitacao={mockSolicitacao} />);
    
    expect(screen.getByText('Teste de Solicitação')).toBeInTheDocument();
    
    expect(screen.getByText('Pavimentação')).toBeInTheDocument();
    
    expect(screen.getByText('Centro')).toBeInTheDocument();
    
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
