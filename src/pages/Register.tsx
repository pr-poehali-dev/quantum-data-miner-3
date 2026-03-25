import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
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

          <form className="flex flex-col gap-6">
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
                  required
                  placeholder="Иван"
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Фамилия *</label>
                <input
                  type="text"
                  required
                  placeholder="Петров"
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Возраст *</label>
                <input
                  type="number"
                  required
                  min={14}
                  max={99}
                  placeholder="25"
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-neutral-400">Страна *</label>
                <input
                  type="text"
                  required
                  placeholder="Россия"
                  className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">Город *</label>
              <input
                type="text"
                required
                placeholder="Москва"
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">Увлечения <span className="text-neutral-600 normal-case">— необязательно</span></label>
              <textarea
                rows={3}
                placeholder="Горный туризм, фотография, гастрономические путешествия..."
                className="bg-transparent border border-neutral-700 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-white text-black px-8 py-4 text-sm uppercase tracking-wide font-medium hover:bg-neutral-200 transition-colors duration-300 cursor-pointer"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
