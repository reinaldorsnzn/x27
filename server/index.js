const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração Google Sheets
let apiKey = null;
let spreadsheetId = null;

// Rota para configurar API key e spreadsheet ID
app.post('/api/config', (req, res) => {
  const { apiKey: newApiKey, spreadsheetId: newSpreadsheetId } = req.body;
  
  if (!newApiKey || !newSpreadsheetId) {
    return res.status(400).json({ error: 'API key e Spreadsheet ID são obrigatórios' });
  }
  
  apiKey = newApiKey;
  spreadsheetId = newSpreadsheetId;
  
  res.json({ message: 'Configuração salva com sucesso' });
});

// Rota para obter configuração atual
app.get('/api/config', (req, res) => {
  res.json({ 
    configured: !!(apiKey && spreadsheetId),
    spreadsheetId: spreadsheetId || ''
  });
});

// Função para criar cliente Google Sheets
const getSheetsClient = () => {
  if (!apiKey) {
    throw new Error('API key não configurada');
  }
  
  return google.sheets({
    version: 'v4',
    auth: apiKey
  });
};

// Rota para obter dados das licitações
app.get('/api/licitacoes', async (req, res) => {
  try {
    if (!apiKey || !spreadsheetId) {
      return res.status(400).json({ error: 'Configuração não encontrada' });
    }

    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'licitacoes!A:AB'
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar licitações:', error);
    res.status(500).json({ error: 'Erro ao buscar dados das licitações' });
  }
});

// Rota para obter itens de uma licitação específica
app.get('/api/itens/:uniqueId', async (req, res) => {
  try {
    if (!apiKey || !spreadsheetId) {
      return res.status(400).json({ error: 'Configuração não encontrada' });
    }

    const { uniqueId } = req.params;
    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'itens_licitacao!A:I'
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const headers = rows[0];
    const data = rows.slice(1)
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      })
      .filter(item => item.unique_id === uniqueId)
      .sort((a, b) => parseInt(a.item_numero) - parseInt(b.item_numero));

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens da licitação' });
  }
});

// Rota para atualizar uma licitação
app.put('/api/licitacoes/:uniqueId', async (req, res) => {
  try {
    if (!apiKey || !spreadsheetId) {
      return res.status(400).json({ error: 'Configuração não encontrada' });
    }

    const { uniqueId } = req.params;
    const updatedData = req.body;
    const sheets = getSheetsClient();

    // Primeiro, encontrar a linha da licitação
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'licitacoes!A:AB'
    });

    const rows = response.data.values;
    const headers = rows[0];
    const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === uniqueId);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Licitação não encontrada' });
    }

    // Preparar dados para atualização
    const updateRow = headers.map(header => updatedData[header] || '');
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `licitacoes!A${rowIndex + 1}:AB${rowIndex + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [updateRow]
      }
    });

    res.json({ message: 'Licitação atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar licitação:', error);
    res.status(500).json({ error: 'Erro ao atualizar licitação' });
  }
});

// Rota para atualizar um item da licitação
app.put('/api/itens/:uniqueId/:itemNumero', async (req, res) => {
  try {
    if (!apiKey || !spreadsheetId) {
      return res.status(400).json({ error: 'Configuração não encontrada' });
    }

    const { uniqueId, itemNumero } = req.params;
    const updatedData = req.body;
    const sheets = getSheetsClient();

    // Encontrar a linha do item
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'itens_licitacao!A:I'
    });

    const rows = response.data.values;
    const headers = rows[0];
    const rowIndex = rows.findIndex((row, index) => 
      index > 0 && row[7] === uniqueId && row[0] === itemNumero
    );

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Preparar dados para atualização
    const updateRow = headers.map(header => updatedData[header] || '');
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `itens_licitacao!A${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [updateRow]
      }
    });

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});