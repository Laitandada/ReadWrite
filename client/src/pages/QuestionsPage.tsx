import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuthStore } from "../stores/authStore";
// import Timer from "../components/Timer"; // optional import usage if you want
import type { Question } from "../types/types";
import { useNavigate } from "react-router-dom";
import { showError } from "../utils/toastUtils";

function BlankQuestion() {
  return {
    question_text: "",
    options: ["", "", "", ""],
    correct_index: 0
  } as Partial<Question> & { options: string[]; correct_index: number };
}

export default function QuestionsPage() {
  const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<any>(BlankQuestion());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const res = await api.get("/questions");
      setQuestions(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to fetch questions");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(BlankQuestion());
    setShowModal(true);
  }
  function startQuiz() {
    // navigate to quiz page
            navigate("/questions");
    }


  function openEdit(q: Question) {
    setEditing(q);
    setForm({
      question_text: q.question_text,
      options: [...q.options],
      correct_index: q.correct_index ?? 0
    });
    setShowModal(true);
  }

  function updateOption(idx: number, value: string) {
    setForm((f: any) => ({ ...f, options: f.options.map((o: string, i: number) => (i === idx ? value : o)) }));
  }

  async function save() {
    setError(null);
    if (!form.question_text || form.options.some((o: string) => !o) || form.options.length !== 4) {
      setError("Fill question and all 4 options");
      return;
    }
    try {
      if (editing) {
        await api.put(`/questions/${editing.id}`, {
          question_text: form.question_text,
          options: form.options,
          correct_index: Number(form.correct_index)
        });
      } else {
        await api.post("/questions", {
          question_text: form.question_text,
          options: form.options,
          correct_index: Number(form.correct_index)
        });
      }
      setShowModal(false);
      fetchQuestions();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((s) => s.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        {/* Welcome message */}

        {/* <h1>  </h1> */}
        <h1 className="text-2xl font-bold">Questions</h1>
        <div className="flex gap-2">
          <button onClick={openCreate} className="px-3 py-1 bg-green-600 text-white rounded">New Question</button>
          <button onClick={startQuiz} className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer">Start Quiz</button>
          <button onClick={() => {

               logout();
               showError("Logged out successfully");
          }
         

            
            } className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          
        </div>
      </header>

      {loading ? (
        <div>Loading …</div>
      ) : (
        <div className="grid gap-3">
          {questions.map((q) => (
            <div key={q.id} className="p-4 border rounded shadow-sm">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{q.question_text}</div>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((o, i) => (
                      <li key={i} className={i === q.correct_index ? "font-semibold text-green-600" : ""}>
                        {String.fromCharCode(65 + i)}. {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEdit(q)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                  <button onClick={() => remove(q.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded p-6">
            <h3 className="text-xl font-semibold mb-3">{editing ? "Edit Question" : "New Question"}</h3>
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <div className="space-y-3">
              <input
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Question text"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {form.options.map((opt: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={form.correct_index === idx}
                      onChange={() => setForm({ ...form, correct_index: idx })}
                    />
                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="flex-1 border px-3 py-2 rounded"
                      placeholder={`Option ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">Cancel</button>
                <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
