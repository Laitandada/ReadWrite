import { useEffect, useState } from "react";
import api from "../api/axios";
import { useQuizStore } from "../stores/quizStore";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import type { Question } from "../types/types";
import { showError } from "../utils/toastUtils";
import { Button } from "../components/Button";
import { useConfirm } from "../hooks/useConfirm";

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
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);

  const { confirm, ConfirmUI } = useConfirm();

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
      showError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }

  function onTick(seconds: number) {
    setElapsed(seconds);
  }

  function handleSelect(questionId: number, idx: number) {
    selectAnswer(questionId, idx);
    setUnansweredIds((prev) => prev.filter((id) => id !== questionId));
  }

  async function handleSubmit() {
   const notAnswered = questions
      .filter((q) => answers[q.id] == null) 
      .map((q) => q.id);

    if (notAnswered.length > 0) {
      setUnansweredIds(notAnswered);
      showError("Please answer all questions before submitting");
      console.log({ answers, notAnswered }); 
      return;
    }

    if (!(await confirm("Submit quiz now?"))) return;

    const payload = {
      answers: Object.entries(answers).map(([qId, selected]: any) => ({
        questionId: Number(qId),
        selectedIndex: selected === null ? -1 : selected,
      })),
      timeTakenSeconds: elapsed,
    };

    try {
      setSubmitting(true);
      const res = await api.post("/quiz/submit", payload);
      navigate("/results", { state: { ...res.data } });
    } catch (err) {
      console.error(err);
      showError("Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading quiz …</div>;
  if (!questions.length)
    return <div className="p-6">No questions available.</div>;

  const q = questions[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quiz</h2>
        <div className="flex items-center gap-4">
          <div>
            Question {currentIndex + 1} of {questions.length}
          </div>
          <Timer onTick={onTick} />
        </div>
      </div>

      <div
        className={`border rounded p-6 ${
          unansweredIds.includes(q.id) ? "border-red-500 bg-red-50" : ""
        }`}
      >
        <div className="mb-4 font-medium">{q.question_text}</div>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 border p-3 rounded cursor-pointer
                ${
                  answers[q.id] === idx
                    ? "bg-blue-100 border-blue-500" 
                    : "hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === idx}
                onChange={() => handleSelect(q.id, idx)}
                className="hidden"
              />
              <span>
                {String.fromCharCode(65 + idx)}. {opt}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          {currentIndex > 0 ? (
            <Button onClick={prev} variant="outline">
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentIndex < questions.length - 1 ? (
            <Button onClick={next} variant="primary">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="success"
              disabled={
                submitting || Object.keys(answers).length !== questions.length
              }
            >
              {submitting ? "Submitting…" : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmUI />
    </div>
  );
}
