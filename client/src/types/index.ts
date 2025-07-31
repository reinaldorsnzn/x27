export interface Licitacao {
  unique_id: string;
  licitacao_uasg: string;
  licitacao_numero: string;
  licitacao_data_sessao: string;
  licitacao_objeto: string;
  licitacao_modalidade: string;
  licitacao_portal: string;
  licitacao_processo: string;
  licitacao_SRP: string;
  licitacao_SRPvalidade: string;
  licitacao_SRPadesao: string;
  licitacao_prazoimpugnacao: string;
  licitacao_prazoquestionamento: string;
  licitacao_legislacao: string;
  licitacao_criterio: string;
  licitacao_modo: string;
  licitacao_ampla: string;
  licitacao_exclusivo: string;
  licitacao_validadeproposta: string;
  licitacao_garantiacontrato: string;
  licitacao_garantiaproduto: string;
  licitacao_prazoentrega: string;
  licitacao_localentrega: string;
  licitacao_cidadeentrega: string;
  licitacao_estadoentrega: string;
  licitacao_CEPentrega: string;
  licitacao_orientacoesentrega: string;
  licitacao_prazopagamento: string;
  arquivo_pdf: string;
}

export interface ItemLicitacao {
  item_numero: string;
  item_descricao: string;
  item_unidade: string;
  item_quantidade: string;
  item_unitario: string;
  item_total: string;
  item_meepp: string;
  unique_id: string;
  item_thumbnail: string;
}

export interface Config {
  configured: boolean;
  spreadsheetId: string;
}