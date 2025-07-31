import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { configAPI } from './services/api';
import HomePage from './components/HomePage';
import ConfigPage from './components/ConfigPage';
import LicitacaoPage from './components/LicitacaoPage';
import ItensPage from './components/ItensPage';
import './App.css';

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const config = await configAPI.getConfig();
      setIsConfigured(config.configured);
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigured = () => {
    setIsConfigured(true);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Carregando aplicação...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/config" 
            element={<ConfigPage onConfigured={handleConfigured} />} 
          />
          
          {isConfigured ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/licitacao/:uniqueId" element={<LicitacaoPage />} />
              <Route path="/itens/:uniqueId" element={<ItensPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/config" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
