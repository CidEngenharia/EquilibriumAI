// aiRouter.js

const { classifyTask } = require("./decisionEngine");
const { getCache, setCache, hasCache } = require("./cacheService");

const { callGeminiFlash, callGeminiPro } = require("./modelClients/gemini");
const { callClaudeSonnet, callClaudeOpus } = require("./modelClients/claude");

async function resolveTask(input) {
    // 🔁 CACHE
    if (hasCache(input)) {
        return { ...getCache(input), cached: true };
    }

    const type = classifyTask(input);

    let result;

    // 🟢 SIMPLE
    if (type === "simple") {
        result = await callGeminiFlash(input);

        if (result.confidence < 0.6) {
            result = await callGeminiPro(input);
        }
    }

    // 🔵 MEDIUM
    if (type === "medium") {
        result = await callGeminiPro(input);

        if (result.confidence < 0.75) {
            result = await callClaudeSonnet(input);
        }
    }

    // 🔴 COMPLEX
    if (type === "complex") {
        result = await callClaudeSonnet(input);

        if (result.needsDeepThinking) {
            result = await callClaudeOpus(input);
        }
    }

    setCache(input, result);

    return result;
}

module.exports = { resolveTask };