// gemini.js

async function callGeminiFlash(prompt) {
    return {
        model: "gemini-flash",
        response: `⚡ Resposta rápida: ${prompt}`,
        confidence: 0.7
    };
}

async function callGeminiPro(prompt) {
    return {
        model: "gemini-pro",
        response: `🧠 Análise intermediária: ${prompt}`,
        confidence: 0.8
    };
}

module.exports = { callGeminiFlash, callGeminiPro };