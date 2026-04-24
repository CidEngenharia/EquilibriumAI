// ScoreDisplay.jsx

export default function ScoreDisplay({ confidence }) {
    if (!confidence) return null;

    return (
        <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${confidence * 100}%` }}
                ></div>
            </div>
        </div>
    );
}