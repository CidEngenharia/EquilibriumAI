import express from "express";
import { generateDecisionResponse } from "../services/geminiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    try {
        const reply = await generateDecisionResponse(message, context);
        res.json({ reply });
    } catch (error) {
        console.error("Erro na rota de chat:", error);
        // Retorna o erro real para facilitar o diagnóstico do usuário
        res.status(500).json({ 
            error: "Erro ao processar sua decisão.",
            details: error.message 
        });
    }
});

export default router;
