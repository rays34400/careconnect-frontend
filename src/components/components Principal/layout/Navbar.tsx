import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="text-xl font-bold tracking-tight text-violet-600 transition hover:opacity-90 md:text-2xl"
        >
          CareConnect
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 md:flex">
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

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xl text-slate-700 shadow-sm md:hidden"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-600"
            >
              Home
            </Link>

            <Link
              to="/professionals"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-600"
            >
              Professionnels
            </Link>

            {!isLogged ? (
              <>
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Connexion
                  </Button>
                </Link>

                <Link to="/register" onClick={closeMobileMenu}>
                  <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700">
                    Inscription
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full rounded-xl"
              >
                Déconnexion
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}