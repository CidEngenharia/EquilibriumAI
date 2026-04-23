
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

export const generateDecisionResponse = async (userMessage, context = 'geral') => {
    let contextInstruction = "";
    
    switch(context) {
        case 'psicologia':
            contextInstruction = "FOCO: Psicologia & Tomada de Decisão. Use conceitos como Heurísticas, Vieses Cognitivos, Paradoxo da Escolha, Regra 10/10/10 e Sistemas 1 e 2 de Kahneman.";
            break;
        case 'zen':
            contextInstruction = "FOCO: Filosofia Japonesa. Use conceitos como Shikata ga nai, Gaman, Oubaitori, Seiketsu, Hansei, Ikigai, Kaizen e Wabi-sabi.";
            break;
        case 'espiritualidade':
            contextInstruction = "FOCO: Evangelho & Espiritualidade Prática. Use conceitos como Sermão da Montanha, Fruto do Espírito, Parábola dos Talentos e a Regra de Ouro.";
            break;
        case 'gestao':
            contextInstruction = "FOCO: Produtividade & Gestão. Use conceitos como Matrix de Eisenhower, Técnica Pomodoro, GTD (Getting Things Done) e OKRs.";
            break;
        case 'filosofia':
            contextInstruction = "FOCO: Filosofia Ocidental & Mentalidade. Use conceitos como Estoicismo (foco no controle), Existencialismo (responsabilidade) e Growth Mindset.";
            break;
        default:
            contextInstruction = "FOCO: Visão Multisetorial. Integre Psicologia, Filosofia (Oriental e Ocidental), Espiritualidade e Gestão para uma resposta equilibrada.";
    }

    const prompt = `
Você é um especialista em tomada de decisão.
${contextInstruction}

INSTRUÇÕES DE RESPOSTA:
Analise a pergunta do usuário e responda EXATAMENTE neste formato estruturado (não use negrito):

✔ Melhor decisão: [Sua recomendação clara]
✔ Justificativa: [Explique o porquê baseado na sua área de foco atual]
✔ Riscos: [Quais os possíveis pontos negativos ou cuidados]
✔ Alternativa: [Uma segunda opção caso a primeira não seja viável]
✔ Score de 0 a 10: [X/10]

Pergunta do usuário: "${userMessage}"
    `;

    try {
        console.log("Chamando Gemini API...");
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Erro na API do Gemini");
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui processar uma decisão no momento.";
    } catch (error) {
        console.error("Erro no Gemini Service:", error);
        throw error;
    }
};
