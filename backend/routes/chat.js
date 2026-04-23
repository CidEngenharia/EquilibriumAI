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
        res.status(500).json({ error: "Erro ao processar sua decisão. Tente novamente mais tarde." });
    }
});

export default router;
