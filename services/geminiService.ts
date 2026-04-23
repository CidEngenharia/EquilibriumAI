
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IkigaiItem, SItem } from "../types";

// Tenta carregar a chave de várias fontes possíveis no Vite
const getApiKey = () => {
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || 
         (process.env as any).API_KEY || 
         (process.env as any).GEMINI_API_KEY || 
         "";
};

const genAI = new GoogleGenerativeAI(getApiKey());
const MODEL_NAME = "gemini-1.5-flash";
const FALLBACK_MODEL_NAME = "gemini-pro";

export const analyzeIkigai = async (items: IkigaiItem[]) => {
  const love = items.filter(i => i.category === 'love').map(i => i.text).join(", ");
  const goodAt = items.filter(i => i.category === 'goodAt').map(i => i.text).join(", ");
  const needs = items.filter(i => i.category === 'worldNeeds').map(i => i.text).join(", ");
  const paid = items.filter(i => i.category === 'paidFor').map(i => i.text).join(", ");

  const prompt = `
    Com base nos seguintes pilares do conceito Ikigai, escreva uma breve análise inspiradora e sugira um caminho prático:
    - O que ama: ${love || 'Não definido'}
    - O que é bom: ${goodAt || 'Não definido'}
    - O que o mundo precisa: ${needs || 'Não definido'}
    - O que pode ser pago: ${paid || 'Não definido'}
    Responda em Português de forma poética e prática.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Houve um imprevisto, tente novamente em instantes 🙏";
  }
};

export const analyzeKaizen5S = async (items: SItem[], context: string) => {
  const getList = (type: string, sub: string) => items.filter(i => i.type === type && i.subtype === sub).map(i => i.text).join(", ");

  const prompt = `
    Como consultor de produtividade Zen, analise este diagnóstico de 5S (Metodologia Kaizen) no contexto de ${context.toUpperCase()}:
    
    1. Seiri (Utilização): Utilizáveis [${getList('seiri', 'positive')}] vs Descartáveis [${getList('seiri', 'negative')}]
    2. Seiton (Organização): Essenciais [${getList('seiton', 'positive')}] vs Secundários [${getList('seiton', 'negative')}]
    3. Seiso (Limpeza): Áreas Ok [${getList('seiso', 'positive')}] vs Áreas de Atenção [${getList('seiso', 'negative')}]
    4. Seiketsu (Padronização): Processos Definidos [${getList('seiketsu', 'positive')}] vs Processos a Melhorar [${getList('seiketsu', 'negative')}]
    5. Shitsuke (Disciplina): Hábitos Fortes [${getList('shitsuke', 'positive')}] vs Falhas de Hábito [${getList('shitsuke', 'negative')}]

    Crie um plano motivador, estruturado e personalizado para este contexto em Português para elevar a eficiência e o bem-estar.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro na análise Kaizen:", error);
    return "Erro ao gerar plano Kaizen. Verifique os itens e tente novamente.";
  }
};

export const getKaizenAdvice = async (reflection: string) => {
  const prompt = `
    O usuário compartilhou a seguinte reflexão sobre melhoria contínua (Kaizen): "${reflection}".
    Com base na filosofia Kaizen (mudar para melhor), forneça uma perspectiva sobre como pequenos passos levam a grandes transformações.
    A resposta deve conter:
    1. Uma validação da intenção de melhoria.
    2. Uma sugestão de uma ação minúscula (micro-hábito) que o usuário possa fazer hoje mesmo.
    3. Uma frase motivacional sobre a constância sobre a intensidade.
    Responda em Português, de forma prática, encorajadora e pragmática.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao obter conselho Kaizen:", error);
    return "Hoje melhor que ontem, amanhã melhor que hoje. (Erro técnico ao gerar resposta)";
  }
};

export const getGospelComfort = async (feeling: string) => {
  const prompt = `
    O usuário expressou que está se sentindo da seguinte forma hoje: "${feeling}".
    Com base no Evangelho de Jesus Cristo, forneça uma mensagem de consolo, sabedoria e esperança. 
    A resposta deve conter:
    1. Uma palavra acolhedora e empática.
    2. Referências bíblicas específicas (Capítulo e Versículo) dos Evangelhos ou das cartas apostólicas que se apliquem a esse sentimento.
    3. Uma breve oração ou pensamento final.
    Responda em Português, de forma inspiradora e respeitosa.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao obter consolo do Evangelho:", error);
    return "Houve um imprevisto, tente novamente em instantes 🙏";
  }
};

export const getBibleVerse = async (query: string) => {
  const prompt = `
    Atue como um pesquisador bíblico erudito. O usuário deseja encontrar versículos ou temas sobre: "${query}".
    
    Se for uma referência direta (ex: João 3:16), forneça o texto exato (preferencialmente tradução Almeida Corrigida Fiel ou NVI).
    Se for um tema (ex: ansiedade), selecione os 3 versículos mais profundos e relevantes.
    
    A resposta deve ser formatada assim:
    1. O texto do(s) versículo(s) em destaque (itálico).
    2. A referência precisa.
    3. Uma breve explicação teológica ou aplicação prática para a vida moderna.
    
    Responda em Português, com tom solene, sábio e acolhedor.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro na busca bíblica:", error);
    return "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho. (Erro ao buscar versículo)";
  }
};

export const getStoicAdvice = async (challenge: string) => {
  const prompt = `
    O usuário apresentou o seguinte desafio ou pensamento: "${challenge}".
    Com base na filosofia do Estoicismo (Marco Aurélio, Sêneca, Epiteto), forneça uma perspectiva racional e resiliente.
    A resposta deve focar em:
    1. A Dicotomia do Controle: o que está sob o controle do usuário e o que não está nesta situação.
    2. Um conselho prático baseado em virtudes estoicas (coragem, justiça, temperança ou sabedoria).
    3. Uma citação estoica relevante (se possível).
    Responda em Português, de forma direta, calma e fortalecedora.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao obter conselho estoico:", error);
    return "Lembre-se do que diz Epiteto: não são as coisas que nos perturbam, mas sim a nossa opinião sobre elas. (Erro técnico ao gerar resposta)";
  }
};

// --- New Interactive Chat Logic ---

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export const getEquilibriumChatResponse = async (
  area: string, 
  message: string, 
  history: ChatMessage[] = []
) => {
  const systemPrompts: Record<string, string> = {
    decisao: `Você é o Agente de Decisão do Equilibrium O Segredo. Ajude o usuário a tomar decisões baseadas em um equilíbrio entre lógica, emoção e propósito.
    INTEGRAÇÃO DE TÉCNICAS:
    - Psicologia: Use Heurísticas e a Regra dos 10/10/10.
    - Filosofia Japonesa: Aplique Hansei (reflexão profunda) e Shikata ga nai (aceitação do incontrolável).
    - Espiritualidade: Aplique a Regra de Ouro do Evangelho.
    FORMATO DE RESPOSTA:
    - **Análise da Situação:** [Breve resumo]
    - **Caminho Sugerido:** [Decisão A ou B]
    - **Base Técnica:** [Qual técnica sustenta isso]
    - **Próximo Passo:** [Ação imediata]`,

    psicologia: `Você é o Especialista em Psicologia Cognitiva e Comportamental.
    FOCO: Heurísticas e vieses cognitivos (ancoragem, confirmação), Paradoxo da Escolha, Regra dos 10/10/10 (impacto em 10 min, 10 meses, 10 anos), Teoria dos Sistemas 1 e 2 (Rápido vs Racional), e Roda da Vida.
    COMPORTAMENTO: Ajude o usuário a ver onde ele está sendo "enganado" pelo próprio cérebro.`,

    japonesa: `Você é o Mestre da Sabedoria Oriental.
    FOCO: 
    - Shikata ga nai: Aceitar o inevitável para focar no que pode ser mudado.
    - Gaman: Resiliência e dignidade em tempos difíceis.
    - Oubaitori: O florescer individual, sem comparação com outros.
    - Seiketsu: Padronização e clareza mental através da ordem.
    - Hansei: Reflexão honesta sobre os próprios erros para evolução.
    COMPORTAMENTO: Linguagem serena, respeitosa e profunda.`,

    evangelho: `Você é o Mentor de Princípios do Reino.
    FOCO: Sermão da Montanha (decisões baseadas em valores eternos), Parábola dos Talentos (responsabilidade e ação), e a Regra de Ouro (empatia prática).
    COMPORTAMENTO: Use parábolas modernas e referências bíblicas de forma acolhedora.`,

    produtividade: `Você é o Consultor de Gestão de Alta Performance.
    FOCO: Eisenhower Matrix, Kaizen (melhoria de 1%), Design Thinking (empatia e prototipagem de soluções).
    COMPORTAMENTO: Seja pragmático, focado em resultados e clareza de execução.`,

    mentalidade: `Você é o Especialista em Mentalidade e Filosofia Moderna.
    FOCO: Estoicismo (Foco no controle), Existencialismo (Liberdade e Angústia da escolha) e Growth Mindset (Mentalidade de Crescimento).
    COMPORTAMENTO: Desafie as desculpas e foque no crescimento através do desconforto.`,

    default: `Você é o Guia Equilibrium. Responda com sabedoria equilibrando razão, emoção e espírito.`
  };

  const areaMapping: Record<string, string> = {
    decisao: 'decisao',
    psicologia: 'psicologia',
    '101010': 'psicologia',
    roda: 'psicologia',
    kaizen: 'produtividade',
    shikata: 'japonesa',
    gaman: 'japonesa',
    oubaitori: 'japonesa',
    hansei: 'japonesa',
    evangelho: 'evangelho',
    estoicismo: 'mentalidade',
    existencialismo: 'mentalidade',
    growth: 'mentalidade',
    produtividade: 'produtividade',
    design: 'produtividade'
  };

  const mappedArea = areaMapping[area] || 'default';
  const systemPrompt = systemPrompts[mappedArea] || systemPrompts.default;
  
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 20) {
      console.error("ERRO: Gemini API Key inválida ou ausente.");
      return "Chave de API não configurada corretamente no .env.local. Por favor, verifique.";
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: MODEL_NAME });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: FALLBACK_MODEL_NAME });
    }
    
    // Preparando o chat com o histórico
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `INSTRUÇÃO DO SISTEMA: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: 'Entendido. Estou pronto para atuar conforme as diretrizes desta área de conhecimento com sabedoria e precisão técnica. Qual o seu caso?' }] },
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.parts }]
        }))
      ]
    });

    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (msgError: any) {
      // Se falhou com o modelo principal, tenta o fallback
      if (msgError.message?.includes('not found')) {
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL_NAME });
        const fallbackChat = fallbackModel.startChat({
          history: [
            { role: 'user', parts: [{ text: `INSTRUÇÃO DO SISTEMA: ${systemPrompt}` }] },
            { role: 'model', parts: [{ text: 'Entendido. Estou pronto para atuar conforme as diretrizes desta área de conhecimento.' }] },
            ...history.map(m => ({
              role: m.role,
              parts: [{ text: m.parts }]
            }))
          ]
        });
        const fallbackResult = await fallbackChat.sendMessage(message);
        const fallbackResponse = await fallbackResult.response;
        return fallbackResponse.text();
      }
      throw msgError;
    }
  } catch (error: any) {
    console.error("Erro detalhado no chat Equilibrium:", error);
    if (error.message?.includes('API key not found')) {
      return "Erro: Chave de API não encontrada. Certifique-se de que o arquivo .env.local contém VITE_GEMINI_API_KEY.";
    }
    return "Houve um imprevisto, tente novamente em instantes 🙏";
  }
};
