import express from "express";
const router = express.Router();
// Nota: Certifique-se que aiRouter também é ESM ou use a extensão .js se necessário
import { resolveTask } from "../services/aiRouter.js";

router.post("/", async (req, res) => {
    try {
        const { input } = req.body;

        const result = await resolveTask(input);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Erro ao processar decisão"
        });
    }
});

export default router;