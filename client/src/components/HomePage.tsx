import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { licitacaoAPI, itemAPI } from '../services/api';
import { Licitacao } from '../types';
import './HomePage.css';

interface LicitacaoCard extends Licitacao {
  itemCount: number;
}

const HomePage: React.FC = () => {
  const [licitacoes, setLicitacoes] = useState<LicitacaoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLicitacoes();
  }, []);

  const loadLicitacoes = async () => {
    try {
      setLoading(true);
      const licitacoesData = await licitacaoAPI.getLicitacoes();
      
      // Buscar quantidade de itens para cada licitação
      const licitacoesWithCount = await Promise.all(
        licitacoesData.map(async (licitacao) => {
          try {
            const itens = await itemAPI.getItens(licitacao.unique_id);
            return {
              ...licitacao,
              itemCount: itens.length
            };
          } catch (error) {
            return {
              ...licitacao,
              itemCount: 0
            };
          }
        })
      );

      setLicitacoes(licitacoesWithCount);
    } catch (error) {
      setError('Erro ao carregar licitações. Verifique a configuração.');
      console.error('Erro ao carregar licitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (uniqueId: string) => {
    navigate(`/licitacao/${uniqueId}`);
  };

  const handleConfigClick = () => {
    navigate('/config');
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando licitações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <h2>Erro ao carregar dados</h2>
          <p>{error}</p>
          <button onClick={handleConfigClick} className="config-button">
            Ir para Configuração
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Revisão de Licitações</h1>
        <p>Selecione uma licitação para iniciar a revisão dos dados</p>
        <button onClick={handleConfigClick} className="config-link">
          ⚙️ Configurações
        </button>
      </header>

      <div className="licitacoes-grid">
        {licitacoes.map((licitacao) => (
          <div
            key={licitacao.unique_id}
            className="licitacao-card"
            onClick={() => handleCardClick(licitacao.unique_id)}
          >
            <div className="card-header">
              <h3>UASG: {licitacao.licitacao_uasg}</h3>
              <span className="licitacao-numero">
                Nº {licitacao.licitacao_numero}
              </span>
            </div>
            
            <div className="card-content">
              <p className="licitacao-objeto">
                {licitacao.licitacao_objeto || 'Objeto não informado'}
              </p>
              
              <div className="card-info">
                <div className="info-item">
                  <span className="label">Modalidade:</span>
                  <span className="value">{licitacao.licitacao_modalidade || 'N/A'}</span>
                </div>
                
                <div className="info-item">
                  <span className="label">Data da Sessão:</span>
                  <span className="value">{licitacao.licitacao_data_sessao || 'N/A'}</span>
                </div>
                
                <div className="info-item">
                  <span className="label">Itens para revisão:</span>
                  <span className="value item-count">{licitacao.itemCount}</span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <span className="click-hint">Clique para revisar</span>
            </div>
          </div>
        ))}
      </div>

      {licitacoes.length === 0 && (
        <div className="empty-state">
          <h3>Nenhuma licitação encontrada</h3>
          <p>Verifique se a planilha está configurada corretamente e contém dados.</p>
          <button onClick={handleConfigClick} className="config-button">
            Verificar Configuração
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;