export function classifyTask(input) {
    const text = input.toLowerCase();

    if (text.length < 150) return "simple";

    if (
        text.includes("comparar") ||
        text.includes("analisar") ||
        text.includes("diferença")
    ) {
        return "medium";
    }

    if (
        text.includes("estratégia") ||
        text.includes("decisão") ||
        text.includes("investimento") ||
        text.includes("risco")
    ) {
        return "complex";
    }

    return "medium";
}