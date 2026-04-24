import { useState } from "react";
import DecisionCard from "./components/DecisionCard";

export default function App() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);

    async function handleSubmit() {
        const res = await fetch("http://localhost:3000/api/decision", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        });

        const data = await res.json();
        setResult(data.data);
    }

    return (
        <div className="p-6">
            <input
                className="p-2 border rounded w-full"
                placeholder="Digite sua decisão..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Analisar
            </button>

            <DecisionCard result={result} />
        </div>
    );
}