import React, { useState, useEffect } from 'react';
import { configAPI } from '../services/api';
import './ConfigPage.css';

interface ConfigPageProps {
  onConfigured: () => void;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await configAPI.getConfig();
      setSpreadsheetId(config.spreadsheetId);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !spreadsheetId.trim()) {
      setMessage('Por favor, preencha todos os campos');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await configAPI.setConfig(apiKey, spreadsheetId);
      setMessage('Configuração salva com sucesso!');
      setIsError(false);
      setTimeout(() => {
        onConfigured();
      }, 1500);
    } catch (error) {
      setMessage('Erro ao salvar configuração. Verifique os dados e tente novamente.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-page">
      <div className="config-container">
        <h1>Configuração</h1>
        <p className="config-description">
          Configure a API key do Google Sheets e o ID da planilha para começar a usar a aplicação.
        </p>
        
        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label htmlFor="apiKey">API Key do Google Sheets:</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Digite sua API key do Google Sheets"
              className="form-input"
            />
            <small className="form-help">
              Obtenha sua API key no Google Cloud Console
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="spreadsheetId">ID da Planilha:</label>
            <input
              type="text"
              id="spreadsheetId"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="ID da planilha Google Sheets"
              className="form-input"
            />
            <small className="form-help">
              Encontre o ID na URL da planilha: docs.google.com/spreadsheets/d/[ID]/edit
            </small>
          </div>

          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigPage;