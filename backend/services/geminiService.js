const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const generateDecisionResponse = async (userMessage, context = 'geral') => {
    let contextInstruction = "";
    
    switch(context) {
        case 'psicologia':
            contextInstruction = "FOCO: Psicologia cognitiva. Use conceitos como Heurísticas, Vieses Cognitivos, e Sistemas 1 e 2.";
            break;
        case 'zen':
            contextInstruction = "FOCO: Filosofia japonesa. Use conceitos como Ikigai, Kaizen, Wabi-sabi e Oubaitori.";
            break;
        case 'espiritualidade':
            contextInstruction = "FOCO: Princípios do evangelho e espiritualidade prática.";
            break;
        case 'gestao':
            contextInstruction = "FOCO: Produtividade e Gestão. Use conceitos como Matriz de Eisenhower e GTD.";
            break;
        case 'filosofia':
            contextInstruction = "FOCO: Estoicismo e Filosofia. Foco no que pode ser controlado e responsabilidade.";
            break;
        default:
            contextInstruction = "Integre Filosofia japonesa (Ikigai, Kaizen, Wabi-sabi), Estoicismo, Psicologia cognitiva e Princípios do evangelho para uma resposta equilibrada.";
    }

    const prompt = `
Você é um assistente de tomada de decisão baseado em:
- Filosofia japonesa (Ikigai, Kaizen, Wabi-sabi)
- Estoicismo
- Psicologia cognitiva
- Princípios do evangelho

${contextInstruction}

Analise a pergunta do usuário e responda EXATAMENTE neste formato (use a formatação exata, sem negrito ou marcação a mais, apenas o texto):

✔ Melhor decisão: [Sua recomendação clara]
✔ Justificativa: [Explique o porquê baseado na sua área de foco atual]
✔ Riscos: [Quais os possíveis pontos negativos ou cuidados]
✔ Alternativa: [Uma segunda opção caso a primeira não seja viável]
✔ Score: [De 0 a 10]/10

Pergunta do usuário: "${userMessage}"
    `;

    try {
        console.log("Chamando Gemini API (1.5 Flash)...");
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                }
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
