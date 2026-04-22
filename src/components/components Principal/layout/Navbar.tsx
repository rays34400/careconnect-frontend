import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-violet-600 transition hover:opacity-90"
        >
          CareConnect
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            to="/professionals"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-600"
          >
            Professionnels
          </Link>

          {!isLogged ? (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-xl">
                  Connexion
                </Button>
              </Link>

              <Link to="/register">
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  Inscription
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="rounded-xl"
            >
              Déconnexion
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}