
import { ModuleDetail } from '../types';

export const modules: ModuleDetail[] = [
  // --- GESTÃO & GOVERNANÇA ---
  {
    id: 'diretoria',
    title: 'Gerenciamento da Diretoria',
    category: 'Gestão',
    icon: '🏛️',
    description: 'Controle de mandatos, atas de eleição e responsabilidades estatutárias da diretoria executiva.',
    features: ['Histórico de mandatos', 'Gestão de assinaturas', 'Cronograma de reuniões'],
    benefits: ['Conformidade estatutária', 'Organização de governança']
  },
  {
    id: 'gestao-patrimonio',
    title: 'Gestão de Patrimônio',
    category: 'Gestão',
    icon: '🏢',
    description: 'Controle completo de bens móveis e imóveis, inventário de equipamentos e gestão de espaços físicos da organização.',
    features: ['Inventário com QR Code', 'Termos de responsabilidade', 'Controle de manutenção'],
    benefits: ['Segurança patrimonial', 'Transparência no uso de bens']
  },
  {
    id: 'gestao-projetos',
    title: 'Gestão de Projetos e Programas',
    category: 'Gestão',
    icon: '📂',
    description: 'Organização estruturada de todas as iniciativas da organização, separadas por programas e metas de longo prazo.',
    features: ['Agrupamento por programas', 'Cronograma macro', 'Vínculo com orçamentos'],
    benefits: ['Visão estratégica do portfólio', 'Melhor controle de entregas']
  },
  {
    id: 'quadro-tarefas',
    title: 'Gestão de Tarefas (Kanban)',
    category: 'Gestão',
    icon: '📋',
    description: 'Sistema visual para gestão do dia a dia da equipe utilizando o método Kanban para organizar o fluxo de trabalho.',
    features: ['Colunas de status (To Do, Doing, Done)', 'Atribuição de responsáveis', 'Checklists e prazos'],
    benefits: ['Produtividade da equipe', 'Transparência nas demandas diárias']
  },
  {
    id: 'portal-diretoria',
    title: 'Portal da Diretoria',
    category: 'Gestão',
    icon: '🔐',
    description: 'Ambiente seguro para acesso a informações sigilosas, atas de reuniões fechadas e documentos estratégicos.',
    features: ['Repositório sigiloso', 'Votações internas online', 'Pautas de reunião'],
    benefits: ['Segurança da informação', 'Agilidade em decisões de alto nível']
  },
  {
    id: 'documentos-inst',
    title: 'Documentos Institucionais',
    category: 'Gestão',
    icon: '📁',
    description: 'Repositório central para Estatutos, CNPJ, Regimentos e Contratos da organização.',
    features: ['Controle de versões', 'Acesso rápido para editais', 'Repositório histórico'],
    benefits: ['Organização documental', 'Agilidade em processos burocráticos']
  },
  {
    id: 'cnds-titulos',
    title: 'CNDs, Títulos e Qualificações',
    category: 'Gestão',
    icon: '📜',
    description: 'Monitoramento automatizado de Certidões Negativas (CNDs), OSCIP, CEBAS e Utilidade Pública.',
    features: ['Alertas de vencimento', 'Rastreio em sites gov', 'Gestão de renovações'],
    benefits: ['Prevenção de bloqueios em repasses', 'Saúde jurídica constante']
  },
  {
    id: 'portal-colaborador',
    title: 'Portal do Colaborador',
    category: 'Gestão',
    icon: '👤',
    description: 'Espaço para que colaboradores compreendam seu papel individual e coletivo na OSC.',
    features: ['Descritivo de cargo', 'Manual de conduta', 'Visão de metas da equipe'],
    benefits: ['Alinhamento cultural', 'Engajamento institucional']
  },

  // --- IMPACTO SOCIAL & PÚBLICO ---
  {
    id: 'equidade-interna',
    title: 'Equidade e Diversidade Interna',
    category: 'Social',
    icon: '⚖️',
    description: 'Análise de impacto "de dentro para fora": monitoramento de equidade salarial e representatividade em todos os níveis.',
    features: ['Censo de diversidade', 'Auditoria salarial', 'Mapeamento de Conselhos'],
    benefits: ['Coerência institucional real', 'Indicadores para editais ESG']
  },
  {
    id: 'beneficiarios',
    title: 'Gestão de Beneficiários',
    category: 'Social',
    icon: '👥',
    description: 'CRM Social completo para cadastro e acompanhamento das trajetórias de atendimento.',
    features: ['Mapeamento de interesses', 'Histórico de oficinas', 'Validação de CPF'],
    benefits: ['Atendimento humanizado', 'Relatórios de alcance social']
  },
  {
    id: 'pesquisas-satisfacao',
    title: 'Pesquisas e Avaliações',
    category: 'Social',
    icon: '📝',
    description: 'Ferramenta para criação de pesquisas de satisfação e avaliações de impacto junto ao público.',
    features: ['Formulários personalizados', 'Análise de NPS Social', 'Relatórios gráficos'],
    benefits: ['Escuta ativa do público', 'Ajuste de metodologias sociais']
  },
  {
    id: 'depoimentos',
    title: 'Registro de Depoimentos',
    category: 'Social',
    icon: '💬',
    description: 'Banco de dados multimídia com relatos reais sobre a transformação gerada pela ONG.',
    features: ['Upload de vídeos/áudios', 'Gestão de autorização de imagem', 'Tagging por projeto'],
    benefits: ['Material rico para captação', 'Validação qualitativa do impacto']
  },
  {
    id: 'cases-sucesso',
    title: 'Cases de Sucesso',
    category: 'Social',
    icon: '🌟',
    description: 'Documentação profunda de trajetórias inspiradoras de beneficiários atendidos.',
    features: ['Timeline de evolução', 'Relatos familiares', 'Indicadores de mudança'],
    benefits: ['Narrativa poderosa para doadores', 'Memória institucional']
  },
  {
    id: 'portfolio-publico',
    title: 'Portfólio de Projetos (Público)',
    category: 'Social',
    icon: '🖼️',
    description: 'Página pública automática para apresentar os projetos realizados para a sociedade e financiadores.',
    features: ['Layout vitrine', 'Filtros por ano/eixo', 'Galeria de fotos automática'],
    benefits: ['Transparência radical', 'Vitrine para novos parceiros']
  },
  {
    id: 'agenda-publica',
    title: 'Agenda de Atividades OSC',
    category: 'Social',
    icon: '📅',
    description: 'Exposição pública das atividades em andamento para a comunidade.',
    features: ['Inscrição simplificada', 'Localização via mapa', 'Calendário de oficinas'],
    benefits: ['Mobilização de público', 'Divulgação comunitária']
  },

  // --- FINANCEIRO & CAPTAÇÃO ---
  {
    id: 'doadores',
    title: 'Gestão de Doadores',
    category: 'Financeiro',
    icon: '💎',
    description: 'CRM focado no relacionamento, fidelização e régua de contatos com doadores.',
    features: ['Histórico de doações', 'Réguas de agradecimento', 'Categorização por perfil'],
    benefits: ['Retenção de doadores', 'Previsibilidade financeira']
  },
  {
    id: 'doacao-produtos',
    title: 'Doações de Produtos/Serviços',
    category: 'Financeiro',
    icon: '🎁',
    description: 'Página para captação e triagem de itens físicos e serviços pro-bono.',
    features: ['Wishlist de materiais', 'Formulário de oferta', 'Logística de entrega'],
    benefits: ['Abastecimento de insumos', 'Redução de custos fixos']
  },
  {
    id: 'fornecedores',
    title: 'Gestão de Fornecedores',
    category: 'Financeiro',
    icon: '🏗️',
    description: 'Cadastro qualificado de parceiros comerciais e prestadores de serviço.',
    features: ['Avaliação de serviço', 'Base de dados compartilhada', 'Histórico de orçamentos'],
    benefits: ['Compliance financeiro', 'Facilitação de compras']
  },
  {
    id: 'orcamento',
    title: 'Acompanhamento Orçamentário',
    category: 'Financeiro',
    icon: '💰',
    description: 'Visão granular de receitas e despesas vinculadas a rubricas e projetos.',
    features: ['Extratos automáticos', 'Centro de custos', 'Gestão de caixa'],
    benefits: ['Transparência absoluta', 'Controle de gastos por edital']
  },
  {
    id: 'prestacao-contas',
    title: 'Prestação de Contas Simplificada',
    category: 'Financeiro',
    icon: '📑',
    description: 'Geração automatizada de relatórios financeiros e anexos exigidos por leis de incentivo.',
    features: ['Conciliação bancária', 'Relatórios por rubrica', 'Gerador de anexos governamentais'],
    benefits: ['Segurança jurídica financeira', 'Redução de glosas em editais']
  },

  // --- INOVAÇÃO & INTELIGÊNCIA ---
  {
    id: 'datas-impacto',
    title: 'Datas Sociais e Impacto Temático',
    category: 'Inovação',
    icon: '🌍',
    description: 'Inteligência que mapeia marcos sociais e faz uma varredura das ações da OSC para gerar dossiês.',
    features: ['Calendário social global', 'Varredura de atividades via IA', 'Relatórios de relevância'],
    benefits: ['Storytelling automatizado', 'Demonstração de relevância social']
  },
  {
    id: 'analise-erros',
    title: 'Análise de Erros e Procedimentos',
    category: 'Inovação',
    icon: '🔍',
    description: 'Módulo de análise de falhas internas focado no crescimento e melhoria institucional.',
    features: ['Registro de falhas', 'Plano de ação corretiva', 'Círculos de aprendizado'],
    benefits: ['Maturidade institucional', 'Prevenção de erros recorrentes']
  },
  {
    id: 'monitora-editais',
    title: 'Monitoramento de Editais',
    category: 'Inovação',
    icon: '📡',
    description: 'Radar inteligente para identificar oportunidades de financiamento nacionais e internacionais.',
    features: ['Filtros por eixo cultural', 'Alerta de prazos', 'Checklist de documentos'],
    benefits: ['Captação estratégica', 'Aumento de taxa de aprovação']
  },
  {
    id: 'radar-atividades',
    title: 'Radar de Ecossistema',
    category: 'Inovação',
    icon: '🛰️',
    description: 'Monitoramento de atividades de outras ONGs para inspiração e parcerias.',
    features: ['Feed de tendências', 'Mapa de parceiros locais', 'Sinalização de cooperação'],
    benefits: ['Fortalecimento de rede', 'Inovação metodológica']
  },
  {
    id: 'cursos-cap',
    title: 'Cursos e Capacitações',
    category: 'Inovação',
    icon: '🎓',
    description: 'Hub de treinamentos gratuitos e pagos para a equipe da ONG.',
    features: ['Curadoria de cursos', 'Gestão de certificados', 'Trilhas de desenvolvimento'],
    benefits: ['Profissionalização da equipe', 'Retenção de talentos']
  }
];
