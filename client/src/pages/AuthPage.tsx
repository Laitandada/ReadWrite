import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../stores/authStore";
import { showError, showSuccess } from "../utils/toastUtils";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      if (mode === "register") {
        // const { data } = await api.post("/auth/register", { email, password, name });

        await api.post("/auth/login", { email, password });
        const loginRes = await api.post("/auth/login", { email, password });
        const { token, user } = loginRes.data;
        setAuth(token, user);
        showSuccess("Registered successfully");
        navigate("/questions");
      } else {
        const res = await api.post("/auth/login", { email, password });
        const { token, user } = res.data;
        setAuth(token, user);
        showSuccess("Logged in successfully");
        navigate("/questions");
      }
    } catch (err: any) {
      console.error(err);
      showError("Authentication failed");
      setError(err?.response?.data?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3 w-full">
          {mode === "register" && (
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Full name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <div className="relative">
            <input
              className="w-full border px-3 py-2 rounded pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 underline"
          >
            {mode === "login" ? "Create an account" : "Have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
