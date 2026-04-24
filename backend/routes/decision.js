// decision.js

const express = require("express");
const router = express.Router();

const { resolveTask } = require("../services/aiRouter");

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

module.exports = router;