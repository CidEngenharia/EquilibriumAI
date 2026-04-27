import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import decisionRoute from "./routes/decision.js";
import chatRoute from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/decision", decisionRoute);
app.use("/chat", chatRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Backend Equilibrium rodando na porta ${PORT}`);
});