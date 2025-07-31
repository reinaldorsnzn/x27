import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemAPI, licitacaoAPI } from '../services/api';
import { ItemLicitacao, Licitacao } from '../types';
import './ItensPage.css';

const ItensPage: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const navigate = useNavigate();
  const [itens, setItens] = useState<ItemLicitacao[]>([]);
  const [licitacao, setLicitacao] = useState<Licitacao | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (uniqueId) {
      loadData();
    }
  }, [uniqueId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar itens e dados da licitação em paralelo
      const [itensData, licitacoesData] = await Promise.all([
        itemAPI.getItens(uniqueId!),
        licitacaoAPI.getLicitacoes()
      ]);
      
      setItens(itensData);
      
      const licitacaoEncontrada = licitacoesData.find(l => l.unique_id === uniqueId);
      setLicitacao(licitacaoEncontrada || null);
      
      if (itensData.length === 0) {
        setError('Nenhum item encontrado para esta licitação');
      }
    } catch (error) {
      setError('Erro ao carregar dados');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = itens[currentIndex];

  const handleInputChange = (field: keyof ItemLicitacao, value: string) => {
    if (currentItem) {
      const updatedItens = [...itens];
      updatedItens[currentIndex] = {
        ...currentItem,
        [field]: value
      };
      setItens(updatedItens);
    }
  };

  const handleNext = async () => {
    if (!currentItem || !uniqueId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await itemAPI.updateItem(uniqueId, currentItem.item_numero, currentItem);
      setSuccess('Item salvo com sucesso!');
      
      setTimeout(() => {
        if (currentIndex < itens.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSuccess('');
        }
      }, 1000);
    } catch (error) {
      setError('Erro ao salvar item');
      console.error('Erro ao salvar item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    if (!currentItem || !uniqueId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await itemAPI.updateItem(uniqueId, currentItem.item_numero, currentItem);
      setSuccess('Todos os itens foram salvos com sucesso!');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Erro ao salvar item');
      console.error('Erro ao salvar item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/licitacao/${uniqueId}`);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError('');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <div className="itens-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando itens...</p>
        </div>
      </div>
    );
  }

  if (error && itens.length === 0) {
    return (
      <div className="itens-page">
        <div className="error-container">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            Voltar à Licitação
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  const isLastItem = currentIndex === itens.length - 1;

  const formFields = [
    { key: 'item_numero', label: 'Número do Item', type: 'text', readonly: true },
    { key: 'item_descricao', label: 'Descrição', type: 'textarea' },
    { key: 'item_unidade', label: 'Unidade', type: 'text' },
    { key: 'item_quantidade', label: 'Quantidade', type: 'number' },
    { key: 'item_unitario', label: 'Valor Unitário', type: 'text' },
    { key: 'item_total', label: 'Valor Total', type: 'text' },
    { key: 'item_meepp', label: 'ME/EPP', type: 'text' }
  ];

  return (
    <div className="itens-page">
      <header className="page-header">
        <button onClick={handleBack} className="back-button">
          ← Voltar à Licitação
        </button>
        <div className="header-info">
          <h1>Edição de Itens</h1>
          {licitacao && (
            <div className="licitacao-info">
              UASG: {licitacao.licitacao_uasg} | Nº {licitacao.licitacao_numero}
            </div>
          )}
        </div>
        <div className="progress-info">
          Item {currentIndex + 1} de {itens.length}
        </div>
      </header>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / itens.length) * 100}%` }}
        />
      </div>

      <div className="page-content">
        <div className="form-section">
          <div className="form-container">
            <div className="item-header">
              <h2>Item {currentItem.item_numero}</h2>
              <div className="navigation-buttons">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="nav-button prev-button"
                >
                  ← Anterior
                </button>
                <span className="item-counter">
                  {currentIndex + 1} / {itens.length}
                </span>
                <button
                  onClick={() => setCurrentIndex(Math.min(currentIndex + 1, itens.length - 1))}
                  disabled={currentIndex === itens.length - 1}
                  className="nav-button next-button"
                >
                  Próximo →
                </button>
              </div>
            </div>
            
            {(error || success) && (
              <div className={`message ${error ? 'error' : 'success'}`}>
                {error || success}
              </div>
            )}

            <form className="item-form">
              {formFields.map(({ key, label, type, readonly }) => (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{label}:</label>
                  {type === 'textarea' ? (
                    <textarea
                      id={key}
                      value={currentItem[key as keyof ItemLicitacao] || ''}
                      onChange={(e) => handleInputChange(key as keyof ItemLicitacao, e.target.value)}
                      className="form-input"
                      rows={4}
                      readOnly={readonly}
                    />
                  ) : (
                    <input
                      type={type}
                      id={key}
                      value={currentItem[key as keyof ItemLicitacao] || ''}
                      onChange={(e) => handleInputChange(key as keyof ItemLicitacao, e.target.value)}
                      className="form-input"
                      readOnly={readonly}
                    />
                  )}
                </div>
              ))}
            </form>

            <div className="form-actions">
              {isLastItem ? (
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="finish-button"
                >
                  {saving ? 'Salvando...' : 'Concluir Revisão'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={saving}
                  className="next-item-button"
                >
                  {saving ? 'Salvando...' : 'Salvar e Próximo'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pdf-section">
          <div className="pdf-container">
            <h2>Documento PDF</h2>
            {licitacao?.arquivo_pdf ? (
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
          
          {currentItem.item_thumbnail && (
            <div className="thumbnail-container">
              <h3>Imagem do Item</h3>
              <img
                src={currentItem.item_thumbnail}
                alt={`Thumbnail do item ${currentItem.item_numero}`}
                className="item-thumbnail"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItensPage;