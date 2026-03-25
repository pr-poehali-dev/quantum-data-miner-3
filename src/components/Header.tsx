import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem("wander_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("wander_user");
    navigate("/");
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-wide">WanderTogether</div>
        <nav className="flex gap-8 items-center">
          <a href="#about" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm">
            О нас
          </a>
          <a href="#adventures" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm">
            Приключения
          </a>
          <a href="#contact" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm">
            Присоединиться
          </a>
          {user ? (
            <>
              <span className="text-white text-sm uppercase tracking-wide opacity-80">
                {user.first_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm cursor-pointer"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm">
                Войти
              </Link>
              <Link to="/register" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
