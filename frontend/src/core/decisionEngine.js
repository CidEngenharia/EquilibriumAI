/**
 * decisionEngine.js — Motor de Decisão do EquilibriumAI
 * Recomendações específicas por nicho.
 */

// ── Banco de opções por nicho ───────────────────────────────────
const OPTIONS_BY_NICHE = {

  profissional: [
    {
      id: 'requalificacao-rapida',
      nome: 'Requalificação Acelerada',
      descricao: 'Invista 60–90 dias em cursos práticos e certificações reconhecidas na nova área antes de qualquer candidatura.',
      lucro: 7, risco: 3, tempo: 7, custo: 2, facilidade: 6, escalavel: true,
      prazo_retorno: '3–4 meses',
      acoes: [
        'Mapeie as 3 habilidades mais exigidas em vagas da área desejada',
        'Faça cursos práticos (Alura, DIO, Coursera) com certificado reconhecido',
        'Construa 2 projetos reais para portfolio durante o aprendizado',
        'Compartilhe seu progresso no LinkedIn semanalmente',
      ],
    },
    {
      id: 'portfolio-experiencia',
      nome: 'Portfolio + Experiência Voluntária',
      descricao: 'Construa credibilidade fazendo projetos reais gratuitos ou voluntários para ONGs, startups ou contatos próximos antes de entrar no mercado.',
      lucro: 6, risco: 2, tempo: 5, custo: 1, facilidade: 7, escalavel: false,
      prazo_retorno: '2–3 meses',
      acoes: [
        'Identifique 5 ONGs ou startups que precisam da sua nova habilidade',
        'Ofereça trabalho voluntário por 30 dias em troca de referência',
        'Documente cada resultado com dados e prints',
        'Use os casos como prova social em entrevistas',
      ],
    },
    {
      id: 'networking-setorial',
      nome: 'Networking Estratégico no Setor',
      descricao: 'Conecte-se com 30+ profissionais da nova área em 60 dias via LinkedIn, eventos e comunidades para criar pontes que o currículo não consegue.',
      lucro: 8, risco: 2, tempo: 4, custo: 1, facilidade: 7, escalavel: true,
      prazo_retorno: '1–3 meses',
      acoes: [
        'Envie 5 mensagens personalizadas por dia no LinkedIn para profissionais da área',
        'Participe de 2 eventos presenciais ou meetups do setor por mês',
        'Entre em 3 comunidades online relevantes (Discord, Slack, grupos)',
        'Peça conversas de 15 min (coffee chat) para entender a área',
      ],
    },
    {
      id: 'transicao-gradual',
      nome: 'Transição Gradual (Sem Risco)',
      descricao: 'Mantenha o emprego atual enquanto constrói a nova carreira nas horas livres por 90–120 dias antes de dar o salto definitivo.',
      lucro: 9, risco: 1, tempo: 3, custo: 1, facilidade: 8, escalavel: true,
      prazo_retorno: '3–6 meses',
      acoes: [
        'Dedique 2h diárias à nova área antes ou depois do trabalho atual',
        'Valide a nova carreira com freelances ou projetos paralelos',
        'Construa 3 meses de reserva financeira antes de pedir demissão',
        'Só deixe o emprego atual quando tiver renda mínima na nova área',
      ],
    },
  ],

  pme: [
    {
      id: 'validacao-produto',
      nome: 'Validação Antes de Investir',
      descricao: 'Teste seu produto ou serviço com 10 clientes pagantes antes de qualquer investimento em estrutura, marketing ou tecnologia.',
      lucro: 9, risco: 2, tempo: 6, custo: 1, facilidade: 8, escalavel: true,
      prazo_retorno: '1–2 meses',
      acoes: [
        'Defina sua proposta de valor em uma frase',
        'Venda manualmente para 10 clientes sem site ou sistema',
        'Colha feedbacks estruturados de cada cliente',
        'Só invista em estrutura depois de validar a demanda real',
      ],
    },
    {
      id: 'maquina-vendas',
      nome: 'Máquina de Vendas Digital',
      descricao: 'Crie um sistema de aquisição de clientes previsível combinando tráfego pago e orgânico com conversão otimizada.',
      lucro: 8, risco: 5, tempo: 7, custo: 5, facilidade: 5, escalavel: true,
      prazo_retorno: '2–4 meses',
      acoes: [
        'Crie uma oferta clara com proposta de valor irresistível',
        'Invista R$ 500–1.000/mês em Google Ads ou Meta Ads para testar',
        'Crie página de captura e sequência de e-mail de nutrição',
        'Otimize o funil a cada 30 dias baseado nos dados reais',
      ],
    },
    {
      id: 'processos-escalabilidade',
      nome: 'Processos para Escalar',
      descricao: 'Documente e padronize suas operações para que o negócio funcione sem depender totalmente de você.',
      lucro: 7, risco: 3, tempo: 6, custo: 2, facilidade: 6, escalavel: true,
      prazo_retorno: '2–3 meses',
      acoes: [
        'Mapeie os 5 processos que mais consomem seu tempo',
        'Crie SOPs (procedimentos) em vídeo ou texto para cada um',
        'Delegue uma tarefa por semana para um colaborador ou ferramenta',
        'Use Trello, Notion ou Monday para acompanhar sem estar presente',
      ],
    },
    {
      id: 'retenção-clientes',
      nome: 'Estratégia de Retenção de Clientes',
      descricao: 'Aumente o faturamento vendendo mais para quem já comprou. Reter é 5x mais barato que adquirir novos clientes.',
      lucro: 8, risco: 2, tempo: 4, custo: 1, facilidade: 7, escalavel: true,
      prazo_retorno: 'Imediato',
      acoes: [
        'Crie um programa de fidelidade ou clube de benefícios',
        'Implante pós-venda estruturado: WhatsApp + e-mail de acompanhamento',
        'Crie uma oferta de upsell ou cross-sell para clientes ativos',
        'Peça indicações de forma estruturada a cada cliente satisfeito',
      ],
    },
  ],

  condominio: [
    {
      id: 'regua-cobranca',
      nome: 'Régua de Cobrança Estruturada',
      descricao: 'Implante um processo claro e automatizado de cobrança que reduza a inadimplência sem gerar conflitos.',
      lucro: 8, risco: 2, tempo: 4, custo: 1, facilidade: 7, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Envie boleto/PIX 7 dias antes do vencimento com lembrete amigável',
        'Envie notificação no dia do vencimento e 3 dias depois',
        'Ofereça acordo em 30 dias antes de acionar advogado',
        'Use app de gestão de condomínio para automatizar alertas',
      ],
    },
    {
      id: 'manutencao-preventiva',
      nome: 'Plano de Manutenção Preventiva',
      descricao: 'Crie um calendário de manutenções preventivas que evita emergências, prolonga a vida útil dos equipamentos e reduz custos.',
      lucro: 7, risco: 2, tempo: 3, custo: 3, facilidade: 7, escalavel: false,
      prazo_retorno: '1–3 meses',
      acoes: [
        'Levante todos os equipamentos e sistemas do condomínio',
        'Crie um calendário anual de manutenção preventiva para cada item',
        'Contrate contratos de manutenção para elevadores, bombas e elétrica',
        'Fotodocumente cada manutenção para transparência com os moradores',
      ],
    },
    {
      id: 'comunicacao-digital',
      nome: 'Canal de Comunicação Digital',
      descricao: 'Implante um canal oficial de comunicação (app ou grupo organizado) para reduzir conflitos e aumentar a satisfação dos moradores.',
      lucro: 6, risco: 1, tempo: 3, custo: 1, facilidade: 8, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Crie um grupo oficial no WhatsApp apenas para comunicados (sem discussão)',
        'Use app de condomínio como Condomínio Online ou CondoApp',
        'Publique ata de cada decisão importante em 48h após a assembleia',
        'Envie relatório mensal de gestão para todos os condôminos',
      ],
    },
    {
      id: 'fundo-reserva',
      nome: 'Planejamento do Fundo de Reserva',
      descricao: 'Reestruture o fundo de reserva para garantir que o condomínio tenha recursos para emergências sem aprovação de taxa extra.',
      lucro: 9, risco: 2, tempo: 3, custo: 2, facilidade: 6, escalavel: false,
      prazo_retorno: '3–6 meses',
      acoes: [
        'Faça laudo técnico para estimar obras necessárias nos próximos 5 anos',
        'Calcule a contribuição mensal necessária para cobrir essas obras',
        'Apresente o plano em assembleia com projeções claras',
        'Aplique o fundo em CDB ou Tesouro Direto para rentabilizar',
      ],
    },
  ],

  decisao: [
    {
      id: 'matriz-decisao',
      nome: 'Matriz de Decisão Ponderada',
      descricao: 'Liste suas alternativas, defina os critérios mais importantes e atribua pesos. A matriz elimina o viés emocional e revela a melhor opção.',
      lucro: 9, risco: 1, tempo: 2, custo: 1, facilidade: 8, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Liste todas as alternativas disponíveis (mínimo 3)',
        'Defina 4–6 critérios de decisão e atribua um peso de 1–5 para cada',
        'Pontue cada alternativa em cada critério de 1–10',
        'Some os pontos ponderados e escolha com base nos dados, não na emoção',
      ],
    },
    {
      id: 'regra-10-10-10',
      nome: 'Regra 10-10-10 (Visão de Longo Prazo)',
      descricao: 'Analise sua decisão pelo impacto em 10 minutos, 10 meses e 10 anos. Evita decisões impulsivas e alinha com seus valores reais.',
      lucro: 8, risco: 1, tempo: 1, custo: 1, facilidade: 9, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Anote como se sentirá com cada opção em 10 minutos',
        'Projete o impacto de cada opção em 10 meses na sua vida',
        'Visualize os cenários em 10 anos — qual alinha com quem você quer ser?',
        'Escolha a opção que você menos se arrependerá no longo prazo',
      ],
    },
    {
      id: 'analise-cenarios',
      nome: 'Análise de Cenários (Melhor, Esperado, Pior)',
      descricao: 'Projete os três cenários possíveis para cada alternativa. Isso reduz o medo do desconhecido e prepara você para qualquer resultado.',
      lucro: 8, risco: 2, tempo: 3, custo: 1, facilidade: 7, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Para cada opção, descreva o melhor cenário realista',
        'Descreva o cenário mais provável com base nos dados disponíveis',
        'Descreva o pior cenário — e avalie se consegue sobreviver a ele',
        'Escolha a opção cujo pior cenário você consiga suportar',
      ],
    },
    {
      id: 'pre-mortem',
      nome: 'Técnica Pre-Mortem',
      descricao: 'Imagine que você tomou a decisão e ela falhou. Agora investigue por que falhou. Isso identifica riscos ocultos antes que se tornem realidade.',
      lucro: 9, risco: 1, tempo: 2, custo: 1, facilidade: 8, escalavel: false,
      prazo_retorno: 'Imediato',
      acoes: [
        'Escolha a alternativa que mais inclina a tomar',
        'Imagine que 1 ano se passou e foi um fracasso total',
        'Liste todas as razões que poderiam ter causado esse fracasso',
        'Para cada razão, crie uma ação de mitigação antes de decidir',
      ],
    },
  ],

  financeiro: [
    {
      id: 'reserva-emergencia',
      nome: 'Construir Reserva de Emergência',
      descricao: 'Antes de qualquer investimento, acumule 6 meses de gastos em um ativo de liquidez diária e rendimento. É a base de toda saúde financeira.',
      lucro: 7, risco: 1, tempo: 3, custo: 1, facilidade: 9, escalavel: false,
      prazo_retorno: '3–12 meses',
      acoes: [
        'Calcule seus gastos mensais reais (fixos + variáveis)',
        'Defina a meta: 6x esse valor como reserva mínima',
        'Abra conta no Nubank, Inter ou C6 e separe uma conta exclusiva para reserva',
        'Automatize uma transferência mensal para essa conta no dia do pagamento',
      ],
    },
    {
      id: 'quitar-dividas',
      nome: 'Estratégia de Quitação de Dívidas',
      descricao: 'Elimine dívidas caras (cartão, cheque especial) antes de investir. Nenhum investimento rende mais que os juros de dívidas no Brasil.',
      lucro: 9, risco: 1, tempo: 3, custo: 1, facilidade: 8, escalavel: false,
      prazo_retorno: '2–12 meses',
      acoes: [
        'Liste todas as dívidas com valor, taxa de juros e prazo',
        'Negocie desconto à vista para as maiores — bancos dão 30–60% de desconto',
        'Use o método bola de neve: quite as menores primeiro para ganhar moral',
        'Corte um gasto variável e direcione 100% para amortização',
      ],
    },
    {
      id: 'carteira-iniciante',
      nome: 'Carteira Diversificada para Iniciantes',
      descricao: 'Monte uma carteira equilibrada com renda fixa, ações e fundos imobiliários para fazer o dinheiro crescer com risco controlado.',
      lucro: 7, risco: 4, tempo: 2, custo: 4, facilidade: 6, escalavel: true,
      prazo_retorno: '12–24 meses',
      acoes: [
        'Abra conta em corretora de custo zero (XP, Rico, BTG, Nu Invest)',
        'Comece com 60% em Tesouro Selic ou CDB de liquidez diária',
        'Destine 20% a Fundos Imobiliários (FIIs) de alta liquidez',
        'Aplique 20% em ETFs de ações (BOVA11 ou IVVB11)',
      ],
    },
    {
      id: 'independencia-financeira',
      nome: 'Plano de Independência Financeira',
      descricao: 'Defina seu número de liberdade (patrimônio necessário para viver de renda) e trace um plano de aportes mensais para alcançá-lo.',
      lucro: 10, risco: 3, tempo: 3, custo: 5, facilidade: 5, escalavel: true,
      prazo_retorno: '5–20 anos',
      acoes: [
        'Calcule seu número IF: gastos mensais × 300 (regra dos 4%)',
        'Defina um aporte mensal fixo e aumente 10% ao ano',
        'Invista em ativos geradores de renda (FIIs, ações com dividendos)',
        'Acompanhe o progresso mensalmente e comemore cada 10% da meta',
      ],
    },
  ],
};

// Fallback: opções genéricas se nicho não identificado
const OPTIONS_GENERICAS = OPTIONS_BY_NICHE.profissional;

// ── Score de compatibilidade ────────────────────────────────────
function calcularScore(opcao, perfil) {
  let score = 0;

  // Lucro potencial (peso principal)
  score += (opcao.lucro / 10) * 0.45;

  // Facilidade de entrada
  score += (opcao.facilidade / 10) * 0.15;

  // Penaliza risco alto para perfis conservadores
  const riscoPerfilMap = { conservador: 2, moderado: 5, arrojado: 9, baixo: 2, medio: 5, alto: 9 };
  const riscoUsuario = riscoPerfilMap[perfil.perfil] || riscoPerfilMap[perfil.risco] || 5;
  const riscoDelta = Math.max(0, opcao.risco - riscoUsuario) / 10;
  score -= riscoDelta * 0.25;

  // Penaliza custo alto quando sem capital
  if (perfil.poupanca === 'nada' || perfil.capital === 'zero' || perfil.financeiro === 'critico') {
    score -= (opcao.custo / 10) * 0.15;
  }

  // Penaliza alta demanda de tempo para quem tem pouco
  const tempoPouco = perfil.tempo === '1h' || perfil.tempo === '2h';
  if (tempoPouco && opcao.tempo >= 7) {
    score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

// ── Simulação de cenários ───────────────────────────────────────
export function simularCenarios(opcao) {
  const base = opcao.lucro * 600;
  return {
    esperado: Math.round(base),
    melhor: Math.round(base * 1.5),
    pior: Math.round(base * 0.5),
    prazo: opcao.prazo_retorno,
  };
}

// ── Gerador de justificativa ────────────────────────────────────
function gerarJustificativa(opcao, perfil) {
  const fatores = [];
  if (opcao.risco <= 3) fatores.push('baixo risco de entrada');
  if (opcao.lucro >= 8) fatores.push('alto potencial de resultado');
  if (opcao.facilidade >= 7) fatores.push('fácil de começar');
  if (opcao.custo <= 2) fatores.push('investimento inicial mínimo');
  if (opcao.escalavel) fatores.push('escalável no médio prazo');
  if (opcao.prazo_retorno === 'Imediato') fatores.push('retorno imediato possível');

  if (fatores.length === 0) return 'Boa compatibilidade com seu perfil atual.';
  return `Esta estratégia se destaca por: ${fatores.slice(0, 3).join(', ')}.`;
}

// ── Engine principal ────────────────────────────────────────────
export function processarDecisao(perfil) {
  const nicho = perfil.nicho || 'profissional';
  const opcoes = OPTIONS_BY_NICHE[nicho] || OPTIONS_GENERICAS;

  const scored = opcoes.map(opcao => ({
    ...opcao,
    score: calcularScore(opcao, perfil),
    cenarios: simularCenarios(opcao),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((opt, idx) => ({
      ...opt,
      posicao: idx + 1,
      recomendado: idx === 0,
      scorePercent: Math.round(opt.score * 100),
      justificativa: gerarJustificativa(opt, perfil),
    }));
}

// Manter compatibilidade de imports antigos
export { OPTIONS_BY_NICHE as OPTIONS_DB };
export { calcularScore as normalizarPerfil };
