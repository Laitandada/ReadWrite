import { useEffect, useState } from "react";
import api from "../api/axios";
import { useQuizStore } from "../stores/quizStore";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import type { Question } from "../types/types";

export default function QuizPage() {
  const navigate = useNavigate();
  const setQuestions = useQuizStore((s) => s.setQuestions);
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const answers = useQuizStore((s) => s.answers);
  const selectAnswer = useQuizStore((s) => s.selectAnswer);
  const next = useQuizStore((s) => s.next);
  const prev = useQuizStore((s) => s.prev);
  const reset = useQuizStore((s) => s.reset);

  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
    reset();

  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const res = await api.get("/quiz/start");
   
      setQuestions(res.data.questions as Question[]);
    } catch (err) {
      console.error(err);
      alert("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }

  function onTick(seconds: number) {
    setElapsed(seconds);
  }

  function handleSelect(questionId: number, idx: number) {
    selectAnswer(questionId, idx);
  }

  async function handleSubmit() {
    if (!confirm("Submit quiz now?")) return;
    const payload = {
      answers: Object.entries(answers).map(([qId, selected]: any) => ({
        questionId: Number(qId),
        selectedIndex: selected === null ? -1 : selected
      })),
      timeTakenSeconds: elapsed
    };
    try {
      setSubmitting(true);
      const res = await api.post("/quiz/submit", payload);
    
      navigate("/results", { state: { ...res.data } });
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading quiz …</div>;
  if (!questions.length) return <div className="p-6">No questions available.</div>;

  const q = questions[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quiz</h2>
        <div className="flex items-center gap-4">
          <div>Question {currentIndex + 1} of {questions.length}</div>
          <Timer onTick={onTick} />
        </div>
      </div>

      <div className="border rounded p-6">
        <div className="mb-4 font-medium">{q.question_text}</div>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-3 border p-3 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === idx}
                onChange={() => handleSelect(q.id, idx)}
              />
              <span>{String.fromCharCode(65 + idx)}. {opt}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <button onClick={prev} className="px-3 py-1 border rounded">Previous</button>
          {currentIndex < questions.length - 1 ? (
            <button onClick={next} className="px-3 py-1 bg-blue-600 text-white rounded">Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="px-3 py-1 bg-green-600 text-white rounded">
              {submitting ? "Submitting…" : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
