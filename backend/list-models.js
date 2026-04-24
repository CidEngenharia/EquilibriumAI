import "dotenv/config";
import fetch from "node-fetch";

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log("Modelos disponíveis:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("Nenhum modelo encontrado ou erro na resposta:", data);
        }
    } catch (error) {
        console.error("Erro ao listar modelos:", error);
    }
}

listModels();
