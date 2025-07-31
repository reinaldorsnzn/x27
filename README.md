# Sistema de Revisão de Licitações

Uma aplicação web moderna para revisão de dados estruturados de licitações extraídos por IA a partir de documentos PDF/DOCX, com integração ao Google Sheets.

## 🚀 Funcionalidades

- **Configuração de API**: Interface para configurar API key do Google Sheets
- **Dashboard Principal**: Visualização em cartões das licitações disponíveis
- **Edição de Licitações**: Formulário completo para edição dos dados gerais
- **Revisão de Itens**: Navegação sequencial para revisão de todos os itens
- **Visualização de PDFs**: Frame integrado para visualização dos documentos originais
- **Interface Responsiva**: Design moderno e adaptável para diferentes dispositivos

## 🏗️ Arquitetura

### Frontend (React + TypeScript)
- **React 18** com TypeScript para type safety
- **React Router** para navegação entre páginas
- **Axios** para comunicação com a API
- **CSS Modules** para estilização componetizada

### Backend (Node.js + Express)
- **Express.js** para criação da API REST
- **Google Sheets API** para integração com planilhas
- **CORS** habilitado para comunicação frontend/backend

## 📋 Estrutura de Dados

### Planilha "licitacoes"
Contém os dados gerais de cada licitação com as seguintes colunas:
- `unique_id` - Identificador único
- `licitacao_uasg` - UASG da licitação
- `licitacao_numero` - Número da licitação
- `licitacao_data_sessao` - Data da sessão
- `licitacao_objeto` - Objeto da licitação
- `arquivo_pdf` - Link para o arquivo PDF
- E mais 22 campos específicos de licitação

### Planilha "itens_licitacao"
Contém os itens/produtos de cada licitação:
- `item_numero` - Número do item
- `item_descricao` - Descrição do produto
- `item_unidade` - Unidade de medida
- `item_quantidade` - Quantidade
- `item_unitario` - Valor unitário
- `item_total` - Valor total
- `item_meepp` - Indicador ME/EPP
- `unique_id` - Relaciona com a licitação
- `item_thumbnail` - Imagem do item

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta Google Cloud com Sheets API habilitada

### Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd licitacao-review-app
```

2. **Instale as dependências**
```bash
npm run install-all
```

3. **Configure a API do Google Sheets**
   - Acesse o [Google Cloud Console](https://console.cloud.google.com)
   - Crie um novo projeto ou selecione um existente
   - Habilite a Google Sheets API
   - Crie uma API key
   - Configure as permissões necessárias

4. **Execute a aplicação**
```bash
npm run dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Como Usar

### 1. Configuração Inicial
- Acesse a aplicação e vá para a página de configuração
- Insira sua API key do Google Sheets
- Informe o ID da planilha (encontrado na URL da planilha)
- Salve a configuração

### 2. Revisão de Licitações
- Na página inicial, visualize os cartões das licitações
- Clique em uma licitação para iniciar a revisão
- Edite os dados gerais no formulário
- Visualize o PDF original no painel lateral
- Clique em "Salvar e Continuar"

### 3. Revisão de Itens
- Após salvar a licitação, será redirecionado para os itens
- Navegue pelos itens usando os botões de navegação
- Edite os dados de cada item
- Visualize thumbnails quando disponíveis
- No último item, clique em "Concluir Revisão"

## 🔧 Configuração do Google Sheets

### Estrutura da Planilha
Sua planilha deve ter duas abas:
- `licitacoes` - com os dados gerais
- `itens_licitacao` - com os itens/produtos

### Permissões
A API key deve ter permissões para:
- Ler dados das planilhas
- Escrever/atualizar dados nas planilhas

### Formato dos Links PDF
Os links na coluna `arquivo_pdf` devem ser URLs diretas acessíveis publicamente.

## 🎨 Personalização

### Estilos
Os estilos estão organizados em arquivos CSS separados para cada componente:
- `HomePage.css` - Página inicial
- `ConfigPage.css` - Página de configuração  
- `LicitacaoPage.css` - Página de edição de licitação
- `ItensPage.css` - Página de edição de itens

### Cores e Temas
As cores principais podem ser alteradas nas variáveis CSS:
- Primária: `#667eea` 
- Secundária: `#764ba2`
- Sucesso: `#28a745`
- Erro: `#e74c3c`

## 🛠️ Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Executa frontend e backend em modo desenvolvimento
- `npm run server` - Executa apenas o backend
- `npm run client` - Executa apenas o frontend
- `npm run build` - Gera build de produção

### Estrutura de Pastas
```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Serviços de API
│   │   ├── types/          # Definições TypeScript
│   │   └── ...
├── server/                 # Backend Node.js
│   ├── index.js           # Servidor principal
│   └── package.json
└── package.json           # Configuração raiz
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da Google Sheets API
- Verifique os logs do console para erros de desenvolvimento
