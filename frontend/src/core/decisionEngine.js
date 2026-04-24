/**
 * decisionEngine.js — Motor de Decisão do EquilibriumAI
 *
 * Responsabilidade: normalizar perfil, calcular scores e retornar ranking.
 * Completamente desacoplado de UI.
 */

// ── Base de opções ──────────────────────────────────────────────────────────
export const OPTIONS_DB = [
  {
    id: 'freelance-digital',
    nome: 'Freelancer Digital',
    descricao: 'Preste serviços digitais (design, código, escrita, marketing) via plataformas como Workana, Upwork ou clientes diretos.',
    categoria: 'renda',
    lucro: 7,      // potencial de lucro (1–10)
    risco: 4,      // risco (1–10, maior = mais arriscado)
    tempo: 6,      // horas semanais necessárias (normalizado 1–10)
    custo: 2,      // custo inicial (1–10, maior = mais caro)
    facilidade: 6, // facilidade de entrada (1–10)
    escalavel: true,
    investimento_min: 0,
    prazo_retorno: '1–3 meses',
    acoes: [
      'Defina seu nicho e serviço principal',
      'Crie portfólio com 3 projetos (podem ser fictícios)',
      'Cadastre-se em Workana e LinkedIn',
      'Envie 10 propostas por semana',
    ],
  },
  {
    id: 'ecommerce-dropshipping',
    nome: 'E-commerce / Dropshipping',
    descricao: 'Venda produtos físicos online sem estoque próprio via Shopee, Mercado Livre ou loja própria.',
    categoria: 'negocio',
    lucro: 6,
    risco: 6,
    tempo: 7,
    custo: 4,
    facilidade: 5,
    escalavel: true,
    investimento_min: 300,
    prazo_retorno: '2–6 meses',
    acoes: [
      'Pesquise nicho com alta demanda e baixa concorrência',
      'Encontre fornecedores confiáveis',
      'Crie loja no Mercado Livre ou Shopee',
      'Invista em anúncios para os primeiros pedidos',
    ],
  },
  {
    id: 'infoproduto',
    nome: 'Infoproduto / Curso Online',
    descricao: 'Crie e venda cursos, e-books ou mentorias sobre um conhecimento que você já possui.',
    categoria: 'educacao',
    lucro: 9,
    risco: 5,
    tempo: 8,
    custo: 3,
    facilidade: 5,
    escalavel: true,
    investimento_min: 100,
    prazo_retorno: '3–6 meses',
    acoes: [
      'Valide o tema com 10 pessoas do seu círculo',
      'Grave um mini-curso gratuito para construir audiência',
      'Publique na Hotmart ou Eduzz',
      'Lance com estratégia de pré-venda',
    ],
  },
  {
    id: 'afiliado-digital',
    nome: 'Marketing de Afiliados',
    descricao: 'Promova produtos de terceiros e ganhe comissão por cada venda gerada através dos seus links.',
    categoria: 'renda',
    lucro: 6,
    risco: 3,
    tempo: 5,
    custo: 1,
    facilidade: 7,
    escalavel: true,
    investimento_min: 0,
    prazo_retorno: '1–4 meses',
    acoes: [
      'Escolha um nicho de interesse (saúde, finanças, tech)',
      'Cadastre-se na Hotmart ou Amazon Associados',
      'Crie conteúdo (blog, YouTube ou Instagram)',
      'Divulgue links de afiliado de forma estratégica',
    ],
  },
  {
    id: 'investimentos',
    nome: 'Investimentos Financeiros',
    descricao: 'Faça seu dinheiro trabalhar por você via renda fixa, ações, fundos imobiliários ou cripto (risco calculado).',
    categoria: 'financas',
    lucro: 5,
    risco: 7,
    tempo: 3,
    custo: 6,
    facilidade: 4,
    escalavel: true,
    investimento_min: 500,
    prazo_retorno: '6–24 meses',
    acoes: [
      'Defina seu perfil de investidor (conservador, moderado, arrojado)',
      'Estude Tesouro Direto e Fundos Imobiliários como base',
      'Abra conta em corretora de baixo custo',
      'Comece com valor pequeno e aumente gradualmente',
    ],
  },
  {
    id: 'servicos-locais',
    nome: 'Serviços Locais',
    descricao: 'Preste serviços presenciais na sua cidade: manutenção, beleza, alimentação, transporte ou educação.',
    categoria: 'servicos',
    lucro: 5,
    risco: 3,
    tempo: 8,
    custo: 2,
    facilidade: 8,
    escalavel: false,
    investimento_min: 0,
    prazo_retorno: 'Imediato',
    acoes: [
      'Liste suas habilidades manuais ou serviços que pode oferecer',
      'Divulgue no WhatsApp e grupos locais',
      'Peça avaliações dos primeiros clientes',
      'Expanda com boca-a-boca e indicações',
    ],
  },
  {
    id: 'saas-app',
    nome: 'SaaS / Aplicativo',
    descricao: 'Crie um software ou aplicativo com receita recorrente (assinatura mensal) resolvendo um problema específico.',
    categoria: 'tecnologia',
    lucro: 10,
    risco: 8,
    tempo: 10,
    custo: 5,
    facilidade: 3,
    escalavel: true,
    investimento_min: 0,
    prazo_retorno: '6–18 meses',
    acoes: [
      'Identifique um problema específico e recorrente',
      'Valide com 5 clientes pagantes antes de construir',
      'Construa MVP mínimo em 30 dias',
      'Lance com modelo freemium ou trial',
    ],
  },
  {
    id: 'social-media-creator',
    nome: 'Criador de Conteúdo',
    descricao: 'Construa audiência em redes sociais e monetize via patrocínios, publicidade, produtos ou memberships.',
    categoria: 'criativo',
    lucro: 7,
    risco: 5,
    tempo: 7,
    custo: 2,
    facilidade: 6,
    escalavel: true,
    investimento_min: 50,
    prazo_retorno: '3–12 meses',
    acoes: [
      'Escolha 1 plataforma e 1 nicho específico',
      'Publique 3x por semana por 90 dias sem parar',
      'Engaje com a audiência respondendo comentários',
      'Monetize ao atingir 1.000 seguidores engajados',
    ],
  },
];

// ── Normalização de perfil ──────────────────────────────────────────────────
/**
 * Normaliza os inputs brutos do usuário para pesos de 0 a 1.
 * @param {object} perfil - { objetivo, rendaMensal, tempoSemanal, risco, capital }
 * @returns {object} pesos normalizados
 */
export function normalizarPerfil(perfil) {
  const riscoMap = { baixo: 1, medio: 5, alto: 9 };
  const tempoMap = { '2h': 2, '4h': 5, '6h+': 9 };

  const risco = riscoMap[perfil.risco] ?? 5;
  const tempo = tempoMap[perfil.tempo] ?? 5;

  // Capital: normalizado 0-1 (escala logarítmica suavizada)
  const capitalRaw = parseInt(perfil.capital?.replace(/\D/g, '') || '0', 10);
  const capital = Math.min(capitalRaw / 2000, 1);

  // Meta de renda: peso de prioridade de lucro
  const rendaMap = { '<1000': 0.3, '1000-3000': 0.5, '3000-7000': 0.7, '7000+': 1 };
  const pesoPriorLucro = rendaMap[perfil.rendaMensal] ?? 0.5;

  return { risco, tempo, capital, pesoPriorLucro };
}

// ── Cálculo de score ────────────────────────────────────────────────────────
/**
 * Calcula o score de uma opção para um dado perfil.
 * Fórmula: (lucro * 0.4) + (facilidade * 0.1) - (risco_ajustado * 0.3) - (custo_ajustado * 0.2)
 */
function calcularScore(opcao, perfil) {
  const { risco: pesoRisco, capital, pesoPriorLucro } = normalizarPerfil(perfil);

  let score = 0;

  // Lucro (peso principal)
  score += (opcao.lucro / 10) * 0.4 * (1 + pesoPriorLucro * 0.3);

  // Facilidade (menor barreira de entrada = melhor)
  score += (opcao.facilidade / 10) * 0.1;

  // Risco — penaliza se perfil é conservador vs opção arriscada
  const riscoDelta = Math.max(0, opcao.risco - pesoRisco) / 10;
  score -= riscoDelta * 0.3;

  // Custo — penaliza se capital disponível é baixo mas opção é cara
  const capitalNecessario = opcao.investimento_min / 2000; // normalizado
  if (capital < capitalNecessario) {
    score -= (capitalNecessario - capital) * 0.2;
  }

  // Tempo — penaliza se opção exige mais horas do que o disponível
  const tempoDisponivel = parseInt(perfil.tempo?.replace(/\D/g, '') || '4', 10);
  const tempoOpcao = opcao.tempo;
  if (tempoOpcao > tempoDisponivel * 1.5) {
    score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

// ── Simulação de cenários ───────────────────────────────────────────────────
export function simularCenarios(opcao, rendaMeta) {
  const meta = parseInt(rendaMeta?.replace(/\D/g, '') || '3000', 10);
  const base = (opcao.lucro / 10) * meta * 1.2;

  return {
    esperado: Math.round(base),
    melhor: Math.round(base * 1.5),
    pior: Math.round(base * 0.5),
    prazo: opcao.prazo_retorno,
  };
}

// ── Engine principal ────────────────────────────────────────────────────────
/**
 * Processa o perfil do usuário e retorna as top 3 opções ranqueadas.
 * @param {object} perfil - Dados coletados no wizard
 * @returns {Array} Top 3 opções com score, cenários e justificativa
 */
export function processarDecisao(perfil) {
  const scored = OPTIONS_DB.map((opcao) => ({
    ...opcao,
    score: calcularScore(opcao, perfil),
    cenarios: simularCenarios(opcao, perfil.rendaMensal === '<1000' ? '1500'
      : perfil.rendaMensal === '1000-3000' ? '2500'
      : perfil.rendaMensal === '3000-7000' ? '5000'
      : '8000'),
  }));

  const ranqueadas = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((opt, idx) => ({
      ...opt,
      posicao: idx + 1,
      recomendado: idx === 0,
      scorePercent: Math.round(opt.score * 100),
      justificativa: gerarJustificativa(opt, perfil),
    }));

  return ranqueadas;
}

// ── Gerador de justificativa ─────────────────────────────────────────────────
function gerarJustificativa(opcao, perfil) {
  const fatores = [];

  if (opcao.risco <= 4) fatores.push('baixo risco de entrada');
  if (opcao.lucro >= 7) fatores.push('alto potencial de lucro');
  if (opcao.facilidade >= 7) fatores.push('facilidade de começar');
  if (opcao.custo <= 2) fatores.push('investimento inicial mínimo');
  if (opcao.escalavel) fatores.push('escalável a longo prazo');
  if (opcao.prazo_retorno === 'Imediato') fatores.push('retorno imediato');

  const perfisMatch = [];
  if (perfil.risco === 'baixo' && opcao.risco <= 4) perfisMatch.push('alinhado ao seu perfil conservador');
  if (perfil.risco === 'alto' && opcao.lucro >= 8) perfisMatch.push('combina com seu perfil arrojado');
  if (perfil.tempo === '2h' && opcao.tempo <= 4) perfisMatch.push('cabe no seu tempo disponível');

  const all = [...fatores, ...perfisMatch];
  if (all.length === 0) return 'Boa compatibilidade com seu perfil atual.';

  return `Esta opção se destaca por: ${all.slice(0, 3).join(', ')}.`;
}
