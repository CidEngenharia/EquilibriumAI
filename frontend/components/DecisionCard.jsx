// DecisionCard.jsx

export default function DecisionCard({ result }) {
    if (!result) return null;

    return (
        <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-lg mt-4">
            <h2 className="text-lg font-bold mb-2">Resultado</h2>

            <p className="mb-2">{result.response}</p>

            <div className="text-sm opacity-70">
                <p>Modelo: {result.model}</p>
                <p>Confiança: {(result.confidence * 100).toFixed(0)}%</p>
            </div>
        </div>
    );
}