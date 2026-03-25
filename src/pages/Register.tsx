import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import func2url from "../../backend/func2url.json";

export default function Register() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    city: "",
    country: "",
    hobbies: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(func2url.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        photo_base64: photo ?? undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data === "string" ? JSON.parse(data).error : data.error);
      return;
    }

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
        <div className="w-full max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">РЕГИСТРАЦИЯ</h1>
          <p className="text-neutral-400 mb-10 text-sm uppercase tracking-wide">Начни своё приключение</p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4 mb-4">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-700 flex items-center justify-center bg-neutral-800 cursor-pointer"
                onClick={() => document.getElementById("photo-input")?.click()}
              >
                {photo ? (
                  <img src={photo} alt="Фото профиля" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-neutral-500 text-xs text-center px-2">Фото профиля</span>
                )}
              </div>
              <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <button
                type="button"
                onClick={() => document.getElementById("photo-input")?.click()}
                className="text-xs text-neutral-400 uppercase tracking-wide hover:text-white transition-colors"
              >
                {photo ? "Изменить фото" : "Загрузить фото"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Имя *</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="Иван"
                  value={form.first_name}
                  onChange={handleChange}
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Фамилия *</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder="Петров"
                  value={form.last_name}
                  onChange={handleChange}
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Возраст *</label>
                <input
                  type="number"
                  name="age"
                  required
                  min={14}
                  max={99}
                  placeholder="25"
                  value={form.age}
                  onChange={handleChange}
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Страна *</label>
                <input
                  type="text"
                  name="country"
                  required
                  placeholder="Россия"
                  value={form.country}
                  onChange={handleChange}
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">Город *</label>
              <input
                type="text"
                name="city"
                required
                placeholder="Москва"
                value={form.city}
                onChange={handleChange}
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">
                Увлечения <span className="text-neutral-600 normal-case">— необязательно</span>
              </label>
              <textarea
                name="hobbies"
                rows={3}
                placeholder="Горный туризм, фотография, гастрономические путешествия..."
                value={form.hobbies}
                onChange={handleChange}
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-white text-black px-8 py-4 text-sm uppercase tracking-wide font-medium hover:bg-neutral-200 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Сохраняем..." : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
