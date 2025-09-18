
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const { state }: any = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-6">
        <div>No results to show.</div>
        <button onClick={() => navigate("/questions")} className="mt-3 px-3 py-1 bg-blue-600 text-white rounded">Back</button>
      </div>
    );
  }

  const { score, correctCount, total, timeTakenSeconds } = state;

  function fmt(sec: number) {
    const mm = Math.floor(sec / 60).toString().padStart(2, "0");
    const ss = (sec % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>

      <div className="space-y-3">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-3xl font-bold">{score}%</div>
        </div>

        <div className="p-4 border rounded flex justify-between">
          <div>Correct answers</div>
          <div>{correctCount} / {total}</div>
        </div>

        <div className="p-4 border rounded flex justify-between">
          <div>Time taken</div>
          <div className="font-mono">{fmt(timeTakenSeconds)}</div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => navigate("/questions")} className="px-3 py-1 border rounded">Manage Questions</button>
          <button onClick={() => navigate("/quiz")} className="px-3 py-1 bg-blue-600 text-white rounded">Retake Quiz</button>
        </div>
      </div>
    </div>
  );
}
