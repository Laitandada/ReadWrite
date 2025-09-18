import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import { ProtectedRoute } from "./components/ProtectedRoute"; 
 import { ToastContainer } from 'react-toastify';
 import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>
        <Route path="*" element={<AuthPage />} />
      </Routes>
      <ToastContainer />

    </BrowserRouter>
  );
}
