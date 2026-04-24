// server.js

const express = require("express");
const cors = require("cors");

const decisionRoute = require("./routes/decision");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/decision", decisionRoute);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
});