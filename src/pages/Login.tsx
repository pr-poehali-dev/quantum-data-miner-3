import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import func2url from "../../backend/func2url.json";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(func2url.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    setLoading(false);

    if (!res.ok) {
      setError(parsed.error);
      return;
    }

    localStorage.setItem("wander_user", JSON.stringify(parsed.user));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-neutral-800">
        <Link to="/" className="text-white text-sm uppercase tracking-wide hover:text-neutral-400 transition-colors">
          WanderTogether
        </Link>
        <Link to="/" className="text-neutral-400 text-sm uppercase tracking-wide hover:text-white transition-colors">
          ← Назад
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">ВХОД</h1>
          <p className="text-neutral-400 mb-10 text-sm uppercase tracking-wide">Рады видеть тебя снова</p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">Email *</label>
              <input
                type="email"
                required
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">Пароль *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-white text-black px-8 py-4 text-sm uppercase tracking-wide font-medium hover:bg-neutral-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Входим..." : "Войти"}
            </button>

            <p className="text-center text-neutral-500 text-sm">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-white hover:text-neutral-300 transition-colors underline underline-offset-4">
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
