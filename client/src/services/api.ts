import axios from 'axios';
import { Licitacao, ItemLicitacao, Config } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const configAPI = {
  getConfig: async (): Promise<Config> => {
    const response = await api.get('/config');
    return response.data;
  },

  setConfig: async (apiKey: string, spreadsheetId: string): Promise<void> => {
    await api.post('/config', { apiKey, spreadsheetId });
  },
};

export const licitacaoAPI = {
  getLicitacoes: async (): Promise<Licitacao[]> => {
    const response = await api.get('/licitacoes');
    return response.data;
  },

  updateLicitacao: async (uniqueId: string, data: Partial<Licitacao>): Promise<void> => {
    await api.put(`/licitacoes/${uniqueId}`, data);
  },
};

export const itemAPI = {
  getItens: async (uniqueId: string): Promise<ItemLicitacao[]> => {
    const response = await api.get(`/itens/${uniqueId}`);
    return response.data;
  },

  updateItem: async (uniqueId: string, itemNumero: string, data: Partial<ItemLicitacao>): Promise<void> => {
    await api.put(`/itens/${uniqueId}/${itemNumero}`, data);
  },
};