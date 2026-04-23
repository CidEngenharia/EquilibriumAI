/**
 * Serviço de comunicação com o backend Equilibrium.
 * Nunca expõe a API Key do Gemini — todas as chamadas passam pelo backend.
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '/api'; // em dev, usa o proxy do vite; em prod, usa a variável de ambiente

/**
 * Envia uma mensagem para o assistente e retorna a resposta da IA.
 * @param {string} message - Mensagem do usuário
 * @param {string} context - Contexto/técnica ativa (ex: 'psicologia', 'zen')
 * @param {Array}  history - Histórico de mensagens para contexto conversacional
 * @returns {Promise<string>} Resposta da IA
 */
export async function sendMessage(message, context = 'geral', history = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context, history }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${response.status} na comunicação com o servidor.`);
  }

  const data = await response.json();
  return data.reply;
}
