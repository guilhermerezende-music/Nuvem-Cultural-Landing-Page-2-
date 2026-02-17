
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
    description: 'Análise de impacto "de dentro para fora": monitoramento de equidade salarial e representatividade em todos os níveis, incluindo diretoria e conselhos.',
    features: [
      'Censo de diversidade (Raça, Gênero, PCD, Neurodivergência)',
      'Auditoria de equidade salarial por gênero e raça',
      'Mapeamento de representatividade em Conselhos e Diretoria'
    ],
    benefits: ['Coerência institucional real', 'Indicadores para editais ESG', 'Governança inclusiva']
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

  // --- INOVAÇÃO & INTELIGÊNCIA ---
  {
    id: 'datas-impacto',
    title: 'Datas Sociais e Impacto Temático',
    category: 'Inovação',
    icon: '🌍',
    description: 'Inteligência que mapeia marcos sociais (Consciência Negra, Literatura, etc.) e faz uma varredura automática das ações da OSC para gerar dossiês de impacto.',
    features: [
      'Calendário social global e nacional',
      'Varredura de atividades via IA por temática social',
      'Relatórios automáticos de relevância e depoimentos correlacionados'
    ],
    benefits: ['Storytelling de impacto automatizado', 'Demonstração de relevância social', 'Conexão com pautas globais']
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
  },
  {
    id: 'consistencia-dados',
    title: 'Verificação de Consistência',
    category: 'Inovação',
    icon: '🛠️',
    description: 'Auditoria automática para garantir a integridade de todas as bases de dados.',
    features: ['Busca de CPFs duplicados', 'Alerta de campos vazios', 'Higienização de base'],
    benefits: ['Confiança nos dados', 'Relatórios sem erros técnicos']
  },
  {
    id: 'backup-restaura',
    title: 'Backup e Restauração',
    category: 'Inovação',
    icon: '💾',
    description: 'Garantia absoluta de que nenhuma informação histórica será perdida.',
    features: ['Backup diário automático', 'Snapshot de projetos', 'Recuperação rápida'],
    benefits: ['Segurança institucional', 'Continuidade de dados']
  }
];
