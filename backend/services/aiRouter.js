import { generateDecisionResponse } from "./geminiService.js";

export const resolveTask = async (input) => {
    // Para a rota de decisão, podemos usar o contexto 'geral' ou algo específico
    return await generateDecisionResponse(input, 'geral');
};
