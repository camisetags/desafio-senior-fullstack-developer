import axios from 'axios';
import { API_URL } from '../constants/api';


console.log('API baseURL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});

export interface Solicitacao {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  bairro: string;
  latitude?: number;
  longitude?: number;
  status: 'pendente' | 'em_andamento' | 'concluido';
  criado_em: string;
  atualizado_em: string;
  fotos_url?: string[];
}

export interface SolicitacaoListResponse {
  solicitacoes: Solicitacao[];
  total: number;
}

export interface SolicitacaoCreateData {
  titulo: string;
  descricao: string;
  categoria: string;
  bairro: string;
  latitude?: number;
  longitude?: number;
  fotos_url?: string[];
}

export interface SolicitacaoUpdateStatusData {
  status: 'pendente' | 'em_andamento' | 'concluido';
}


export const getSolicitacoes = async (page = 1, limit = 10): Promise<SolicitacaoListResponse> => {
  const skip = (page - 1) * limit;
  const response = await api.get<SolicitacaoListResponse>(`/solicitacoes/?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getSolicitacao = async (id: number): Promise<Solicitacao> => {
  const response = await api.get<Solicitacao>(`/solicitacoes/${id}`);
  return response.data;
};

export const createSolicitacao = async (data: SolicitacaoCreateData): Promise<Solicitacao> => {
  const response = await api.post<Solicitacao>('/solicitacoes/', data);
  return response.data;
};

export const updateSolicitacaoStatus = async (id: number, data: SolicitacaoUpdateStatusData): Promise<Solicitacao> => {
  const response = await api.patch<Solicitacao>(`/solicitacoes/${id}`, data);
  return response.data;
};

export default api;
