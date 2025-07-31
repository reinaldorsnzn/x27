import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { licitacaoAPI } from '../services/api';
import { Licitacao } from '../types';
import './LicitacaoPage.css';

const LicitacaoPage: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const navigate = useNavigate();
  const [licitacao, setLicitacao] = useState<Licitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (uniqueId) {
      loadLicitacao();
    }
  }, [uniqueId]);

  const loadLicitacao = async () => {
    try {
      setLoading(true);
      const licitacoes = await licitacaoAPI.getLicitacoes();
      const licitacaoEncontrada = licitacoes.find(l => l.unique_id === uniqueId);
      
      if (licitacaoEncontrada) {
        setLicitacao(licitacaoEncontrada);
      } else {
        setError('Licitação não encontrada');
      }
    } catch (error) {
      setError('Erro ao carregar licitação');
      console.error('Erro ao carregar licitação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Licitacao, value: string) => {
    if (licitacao) {
      setLicitacao({
        ...licitacao,
        [field]: value
      });
    }
  };

  const handleSaveAndContinue = async () => {
    if (!licitacao || !uniqueId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await licitacaoAPI.updateLicitacao(uniqueId, licitacao);
      setSuccess('Licitação salva com sucesso!');
      
      setTimeout(() => {
        navigate(`/itens/${uniqueId}`);
      }, 1500);
    } catch (error) {
      setError('Erro ao salvar licitação');
      console.error('Erro ao salvar licitação:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="licitacao-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando licitação...</p>
        </div>
      </div>
    );
  }

  if (error && !licitacao) {
    return (
      <div className="licitacao-page">
        <div className="error-container">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (!licitacao) return null;

  const formFields = [
    { key: 'licitacao_uasg', label: 'UASG', type: 'text' },
    { key: 'licitacao_numero', label: 'Número', type: 'text' },
    { key: 'licitacao_data_sessao', label: 'Data da Sessão', type: 'date' },
    { key: 'licitacao_objeto', label: 'Objeto', type: 'textarea' },
    { key: 'licitacao_modalidade', label: 'Modalidade', type: 'text' },
    { key: 'licitacao_portal', label: 'Portal', type: 'text' },
    { key: 'licitacao_processo', label: 'Processo', type: 'text' },
    { key: 'licitacao_SRP', label: 'SRP', type: 'text' },
    { key: 'licitacao_SRPvalidade', label: 'SRP Validade', type: 'date' },
    { key: 'licitacao_SRPadesao', label: 'SRP Adesão', type: 'text' },
    { key: 'licitacao_prazoimpugnacao', label: 'Prazo Impugnação', type: 'text' },
    { key: 'licitacao_prazoquestionamento', label: 'Prazo Questionamento', type: 'text' },
    { key: 'licitacao_legislacao', label: 'Legislação', type: 'text' },
    { key: 'licitacao_criterio', label: 'Critério', type: 'text' },
    { key: 'licitacao_modo', label: 'Modo', type: 'text' },
    { key: 'licitacao_ampla', label: 'Ampla Concorrência', type: 'text' },
    { key: 'licitacao_exclusivo', label: 'Exclusivo', type: 'text' },
    { key: 'licitacao_validadeproposta', label: 'Validade da Proposta', type: 'text' },
    { key: 'licitacao_garantiacontrato', label: 'Garantia do Contrato', type: 'text' },
    { key: 'licitacao_garantiaproduto', label: 'Garantia do Produto', type: 'text' },
    { key: 'licitacao_prazoentrega', label: 'Prazo de Entrega', type: 'text' },
    { key: 'licitacao_localentrega', label: 'Local de Entrega', type: 'text' },
    { key: 'licitacao_cidadeentrega', label: 'Cidade de Entrega', type: 'text' },
    { key: 'licitacao_estadoentrega', label: 'Estado de Entrega', type: 'text' },
    { key: 'licitacao_CEPentrega', label: 'CEP de Entrega', type: 'text' },
    { key: 'licitacao_orientacoesentrega', label: 'Orientações de Entrega', type: 'textarea' },
    { key: 'licitacao_prazopagamento', label: 'Prazo de Pagamento', type: 'text' }
  ];

  return (
    <div className="licitacao-page">
      <header className="page-header">
        <button onClick={handleBack} className="back-button">
          ← Voltar
        </button>
        <h1>Edição de Licitação</h1>
        <div className="licitacao-info">
          UASG: {licitacao.licitacao_uasg} | Nº {licitacao.licitacao_numero}
        </div>
      </header>

      <div className="page-content">
        <div className="form-section">
          <div className="form-container">
            <h2>Dados da Licitação</h2>
            
            {(error || success) && (
              <div className={`message ${error ? 'error' : 'success'}`}>
                {error || success}
              </div>
            )}

            <form className="licitacao-form">
              {formFields.map(({ key, label, type }) => (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{label}:</label>
                  {type === 'textarea' ? (
                    <textarea
                      id={key}
                      value={licitacao[key as keyof Licitacao] || ''}
                      onChange={(e) => handleInputChange(key as keyof Licitacao, e.target.value)}
                      className="form-input"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={type}
                      id={key}
                      value={licitacao[key as keyof Licitacao] || ''}
                      onChange={(e) => handleInputChange(key as keyof Licitacao, e.target.value)}
                      className="form-input"
                    />
                  )}
                </div>
              ))}
            </form>

            <div className="form-actions">
              <button
                onClick={handleSaveAndContinue}
                disabled={saving}
                className="save-continue-button"
              >
                {saving ? 'Salvando...' : 'Salvar e Continuar'}
              </button>
            </div>
          </div>
        </div>

        <div className="pdf-section">
          <div className="pdf-container">
            <h2>Documento PDF</h2>
            {licitacao.arquivo_pdf ? (
              <iframe
                src={licitacao.arquivo_pdf}
                className="pdf-frame"
                title="Documento PDF da Licitação"
              />
            ) : (
              <div className="no-pdf">
                <p>Nenhum arquivo PDF disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicitacaoPage;