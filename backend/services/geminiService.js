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
Você é o assistente do "Equilibrium – Sistema de Decisão Inteligente". Você utiliza um motor híbrido combinando:
1. Ikigai (Propósito)
2. Estoicismo (Controle)
3. Psicologia (Clareza)
4. Evangelho (Valores)

${contextInstruction}

Analise a pergunta do usuário e responda EXATAMENTE neste formato (não use negrito, asteriscos ou qualquer outra formatação além das marcas ✔):

✔ Melhor decisão: [Sua recomendação clara e direta]
✔ Por quê: [Justifique alinhando com os valores e impacto futuro]
✔ Risco: [Quais os possíveis pontos negativos ou cuidados (ex: médio, alto, baixo e o porquê)]
✔ Alternativa: [Uma segunda opção caso a primeira não seja viável]
✔ Score de decisão: [Forneça notas separadas por vírgulas. Ex: Propósito: 8/10, Emocional: 6/10, Financeiro: 7/10, Ética: 9/10]
✔ Técnicas utilizadas: [Liste as filosofias ou técnicas aplicadas, ex: Shikata ga nai, Paradoxo da escolha, Regra de Ouro]
🔗 Clique no botão de Dashboard abaixo para ver a análise completa.

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
