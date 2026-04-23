const API_URL = "http://localhost:3001";

export const sendMessage = async (message, context = 'geral') => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, context }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Falha ao enviar mensagem");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro no serviço de API:", error);
        throw error;
    }
};
