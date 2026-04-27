// Perguntas e opções específicas por nicho para o Assistente de Decisão

export const NICHE_LABELS = {
  profissional: 'IA para Orientação Profissional',
  pme: 'IA para Negócios (PMEs)',
  condominio: 'IA para Gestão de Condomínios',
  decisao: 'IA para Tomada de Decisão Estratégica',
  financeiro: 'IA para Análise Financeira',
};

export const NICHE_WIZARDS = {
  profissional: [
    {
      message: 'Qual é o seu principal objetivo profissional agora?',
      key: 'objetivo',
      options: [
        { id: 'transicao', label: 'Mudar de carreira', desc: 'Ir para uma nova área ou profissão' },
        { id: 'crescimento', label: 'Crescer na carreira atual', desc: 'Promoção ou especialização' },
        { id: 'autonomia', label: 'Empreender / freelancer', desc: 'Sair do CLT e trabalhar por conta' },
        { id: 'recolocacao', label: 'Recolocação profissional', desc: 'Estou desempregado e quero voltar' },
      ],
    },
    {
      message: 'Qual é o seu nível de experiência na área desejada?',
      key: 'experiencia',
      options: [
        { id: 'zero', label: 'Nenhuma experiência', desc: 'Área completamente nova para mim' },
        { id: 'basico', label: 'Básico', desc: 'Tenho noções, mas nunca trabalhei' },
        { id: 'medio', label: 'Intermediário', desc: 'Já atuei de forma limitada' },
        { id: 'senior', label: 'Avançado', desc: 'Tenho bagagem significativa' },
      ],
    },
    {
      message: 'Quanto tempo você pode investir diariamente em requalificação?',
      key: 'tempo',
      options: [
        { id: '1h', label: 'Até 1h/dia', desc: 'Tenho pouco tempo disponível' },
        { id: '2h', label: '2h/dia', desc: 'Tempo moderado' },
        { id: '4h', label: '4h/dia', desc: 'Estou muito dedicado' },
        { id: '8h', label: '8h+ /dia', desc: 'Dedicação total' },
      ],
    },
    {
      message: 'Qual é sua situação financeira para essa transição?',
      key: 'financeiro',
      options: [
        { id: 'critico', label: 'Crítica — preciso de renda já', desc: 'Não posso esperar meses' },
        { id: 'moderado', label: 'Moderada — tenho 3 meses de reserva', desc: 'Posso me planejar' },
        { id: 'confortavel', label: 'Confortável — mais de 6 meses de reserva', desc: 'Tenho margem para errar' },
      ],
    },
    {
      message: 'O que mais te impede de agir agora?',
      key: 'bloqueio',
      options: [
        { id: 'medo', label: 'Medo de errar ou falhar', desc: 'Insegurança paralisante' },
        { id: 'conhecimento', label: 'Falta de conhecimento', desc: 'Não sei por onde começar' },
        { id: 'rede', label: 'Falta de network', desc: 'Não conheço ninguém da área' },
        { id: 'financas', label: 'Pressão financeira', desc: 'Preciso de renda imediata' },
      ],
      isLast: true,
    },
  ],

  pme: [
    {
      message: 'Em que estágio está o seu negócio?',
      key: 'estagio',
      options: [
        { id: 'ideia', label: 'Ideia — ainda não validei', desc: 'Quero começar do zero' },
        { id: 'inicio', label: 'Início — já tenho clientes', desc: 'Primeiros meses de operação' },
        { id: 'crescimento', label: 'Crescimento — quero escalar', desc: 'Tenho faturamento recorrente' },
        { id: 'crise', label: 'Em crise — preciso reestruturar', desc: 'O negócio está em dificuldades' },
      ],
    },
    {
      message: 'Qual é o seu maior desafio operacional hoje?',
      key: 'desafio',
      options: [
        { id: 'clientes', label: 'Atrair novos clientes', desc: 'Vendas e marketing' },
        { id: 'caixa', label: 'Controle de caixa', desc: 'Fluxo financeiro desorganizado' },
        { id: 'equipe', label: 'Gestão da equipe', desc: 'Contratar e reter talentos' },
        { id: 'processos', label: 'Padronização de processos', desc: 'O negócio depende só de mim' },
      ],
    },
    {
      message: 'Qual é o faturamento mensal aproximado?',
      key: 'faturamento',
      options: [
        { id: 'zero', label: 'R$ 0 (pré-operacional)' },
        { id: 'ate10k', label: 'Até R$ 10.000/mês' },
        { id: '10k50k', label: 'R$ 10.000 – R$ 50.000/mês' },
        { id: 'acima50k', label: 'Acima de R$ 50.000/mês' },
      ],
    },
    {
      message: 'Qual o seu maior objetivo para os próximos 12 meses?',
      key: 'objetivo',
      options: [
        { id: 'sobreviver', label: 'Sobreviver e estabilizar', desc: 'Manter as contas em dia' },
        { id: 'dobrar', label: 'Dobrar o faturamento', desc: 'Crescimento acelerado' },
        { id: 'expandir', label: 'Abrir nova unidade ou produto', desc: 'Diversificação' },
        { id: 'vender', label: 'Preparar para vender o negócio', desc: 'Exit strategy' },
      ],
    },
    {
      message: 'Você tem sócio ou gestor de confiança?',
      key: 'parceria',
      options: [
        { id: 'sozinho', label: 'Trabalho sozinho', desc: 'Sou dono e operador' },
        { id: 'socio', label: 'Tenho sócio ativo', desc: 'Dividimos as responsabilidades' },
        { id: 'gestor', label: 'Tenho gerente/gestor', desc: 'Já deleguei operações' },
        { id: 'equipe', label: 'Tenho equipe estruturada', desc: 'Time com papéis definidos' },
      ],
      isLast: true,
    },
  ],

  condominio: [
    {
      message: 'Qual é o seu papel no condomínio?',
      key: 'papel',
      options: [
        { id: 'sindico_morador', label: 'Síndico morador', desc: 'Sou condômino eleito' },
        { id: 'sindico_prof', label: 'Síndico profissional', desc: 'Administro como serviço' },
        { id: 'conselheiro', label: 'Conselheiro fiscal', desc: 'Faço parte do conselho' },
        { id: 'morador', label: 'Morador / condômino', desc: 'Quero entender meus direitos' },
      ],
    },
    {
      message: 'Qual é o maior problema do seu condomínio hoje?',
      key: 'problema',
      options: [
        { id: 'inadimplencia', label: 'Inadimplência alta', desc: 'Moradores sem pagar' },
        { id: 'conflitos', label: 'Conflitos entre moradores', desc: 'Barulho, animais, espaço' },
        { id: 'manutencao', label: 'Manutenção atrasada', desc: 'Infraestrutura deteriorando' },
        { id: 'financeiro', label: 'Desequilíbrio financeiro', desc: 'Fundo de reserva baixo' },
      ],
    },
    {
      message: 'Quantas unidades tem o condomínio?',
      key: 'tamanho',
      options: [
        { id: 'pequeno', label: 'Até 30 unidades', desc: 'Condomínio pequeno' },
        { id: 'medio', label: '31 a 100 unidades', desc: 'Condomínio médio' },
        { id: 'grande', label: '101 a 300 unidades', desc: 'Condomínio grande' },
        { id: 'multibloco', label: 'Acima de 300 unidades', desc: 'Multiblocos / empreendimento' },
      ],
    },
    {
      message: 'Como está a comunicação com os condôminos?',
      key: 'comunicacao',
      options: [
        { id: 'ruim', label: 'Muito falha', desc: 'Muita reclamação e desinformação' },
        { id: 'irregular', label: 'Irregular', desc: 'Só em situações de crise' },
        { id: 'boa', label: 'Razoável', desc: 'Comunicamos eventos principais' },
        { id: 'otima', label: 'Excelente', desc: 'Canal ativo e respostas rápidas' },
      ],
    },
    {
      message: 'O que você mais precisa melhorar na gestão agora?',
      key: 'foco',
      options: [
        { id: 'cobranca', label: 'Régua de cobrança', desc: 'Processo para inadimplência' },
        { id: 'assembleia', label: 'Conduzir assembleias', desc: 'Organizar votações e atas' },
        { id: 'obras', label: 'Gerir obras e contratos', desc: 'Orçamentos e fiscalização' },
        { id: 'tecnologia', label: 'Digitalização', desc: 'Usar apps e ferramentas digitais' },
      ],
      isLast: true,
    },
  ],

  decisao: [
    {
      message: 'Qual tipo de decisão você precisa tomar agora?',
      key: 'tipodecisao',
      options: [
        { id: 'pessoal', label: 'Decisão pessoal', desc: 'Vida, relacionamento, moradia' },
        { id: 'profissional', label: 'Decisão profissional', desc: 'Carreira, emprego, sócio' },
        { id: 'empresarial', label: 'Decisão empresarial', desc: 'Negócios, investimento, produto' },
        { id: 'financeira', label: 'Decisão financeira', desc: 'Compra, investimento, dívida' },
      ],
    },
    {
      message: 'Qual é a urgência dessa decisão?',
      key: 'urgencia',
      options: [
        { id: 'imediata', label: 'Urgente — preciso decidir hoje', desc: 'Sem margem de espera' },
        { id: 'curto', label: 'Curto prazo — esta semana', desc: 'Posso pensar um pouco' },
        { id: 'medio', label: 'Médio prazo — este mês', desc: 'Tenho tempo para analisar' },
        { id: 'longo', label: 'Longo prazo — sem pressa', desc: 'Planejamento estratégico' },
      ],
    },
    {
      message: 'Quantas alternativas você já considerou?',
      key: 'alternativas',
      options: [
        { id: 'nenhuma', label: 'Só vejo uma saída', desc: 'Estou em túnel' },
        { id: 'duas', label: 'Duas opções', desc: 'A clássica escolha binária' },
        { id: 'tres', label: 'Três ou mais', desc: 'Várias possibilidades em mente' },
        { id: 'demais', label: 'Opções demais', desc: 'Paralisia por excesso de escolha' },
      ],
    },
    {
      message: 'Qual seu maior obstáculo para decidir?',
      key: 'obstáculo',
      options: [
        { id: 'medo', label: 'Medo de errar', desc: 'Viés do status quo' },
        { id: 'dados', label: 'Falta de informação', desc: 'Não tenho dados suficientes' },
        { id: 'pressao', label: 'Pressão externa', desc: 'Outras pessoas influenciando' },
        { id: 'conflito', label: 'Valores em conflito', desc: 'Opções incompatíveis com o que valorizo' },
      ],
    },
    {
      message: 'Como você quer estruturar sua análise?',
      key: 'metodo',
      options: [
        { id: 'pros_cons', label: 'Prós e Contras', desc: 'Simples e direto' },
        { id: 'eisenhower', label: 'Matriz de Eisenhower', desc: 'Urgente vs. Importante' },
        { id: 'cenarios', label: 'Análise de Cenários', desc: 'Melhor, pior e provável caso' },
        { id: 'valores', label: 'Alinhamento de Valores', desc: 'O que mais importa para mim' },
      ],
      isLast: true,
    },
  ],

  financeiro: [
    {
      message: 'Qual é o seu principal objetivo financeiro?',
      key: 'objetivo',
      options: [
        { id: 'reserva', label: 'Criar reserva de emergência', desc: 'Segurança antes de investir' },
        { id: 'divida', label: 'Quitar dívidas', desc: 'Limpar o nome e respirar' },
        { id: 'investir', label: 'Começar a investir', desc: 'Fazer o dinheiro trabalhar' },
        { id: 'aposentadoria', label: 'Planejar aposentadoria', desc: 'Independência financeira' },
      ],
    },
    {
      message: 'Como está sua situação atual de dívidas?',
      key: 'dividas',
      options: [
        { id: 'sem_divida', label: 'Sem dívidas', desc: 'Estou no positivo' },
        { id: 'controlado', label: 'Dívidas controladas', desc: 'Pago em dia, sem sufoco' },
        { id: 'alto', label: 'Dívidas pesadas', desc: 'Cartão, cheque especial ou empréstimos' },
        { id: 'critico', label: 'Situação crítica', desc: 'Nome negativado ou ação judicial' },
      ],
    },
    {
      message: 'Quanto você consegue poupar por mês?',
      key: 'poupanca',
      options: [
        { id: 'nada', label: 'Nada ainda', desc: 'Gastos iguais ou maiores que renda' },
        { id: 'ate5', label: 'Até 5% da renda', desc: 'Pequena sobra todo mês' },
        { id: '10a20', label: '10% a 20%', desc: 'Tenho disciplina financeira' },
        { id: 'mais20', label: 'Mais de 20%', desc: 'Alta capacidade de poupança' },
      ],
    },
    {
      message: 'Qual é o seu perfil de investidor?',
      key: 'perfil',
      options: [
        { id: 'conservador', label: 'Conservador', desc: 'Segurança acima de tudo' },
        { id: 'moderado', label: 'Moderado', desc: 'Aceito alguma volatilidade' },
        { id: 'arrojado', label: 'Arrojado', desc: 'Busco máximo retorno' },
        { id: 'nao_sei', label: 'Não sei ainda', desc: 'Quero descobrir meu perfil' },
      ],
    },
    {
      message: 'Qual é o seu horizonte de tempo para ver resultados?',
      key: 'horizonte',
      options: [
        { id: 'curto', label: 'Curto prazo (até 1 ano)', desc: 'Preciso de resultado rápido' },
        { id: 'medio', label: 'Médio prazo (1 a 5 anos)', desc: 'Planejando com calma' },
        { id: 'longo', label: 'Longo prazo (5 a 10 anos)', desc: 'Construção sólida' },
        { id: 'muito_longo', label: 'Muito longo (10+ anos)', desc: 'Aposentadoria ou herança' },
      ],
      isLast: true,
    },
  ],
};
