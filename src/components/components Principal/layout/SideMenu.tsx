import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type LocalUser = {
  role?: "patient" | "professional";
};

export default function SideMenu() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLogged(!!token);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    setUser(null);
    navigate("/");
  };

  const linkClass =
    "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-600";

  return (
    <div className="p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl border-slate-300 bg-white shadow-sm"
          >
            ☰
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-80 border-r border-slate-200">
          <div className="mt-6 px-4">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              Navigation
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Accédez rapidement aux pages principales.
            </p>

            <div className="flex flex-col gap-3">
              {!isLogged ? (
                <>
                  <Link to="/" className={linkClass}>
                    Accueil
                  </Link>
                  <Link to="/professionals" className={linkClass}>
                    Professionnels
                  </Link>
                  <Link to="/login" className={linkClass}>
                    Connexion
                  </Link>
                  <Link to="/register" className={linkClass}>
                    Inscription
                  </Link>
                </>
              ) : user?.role === "professional" ? (
                <>
                  <Link to="/profile" className={linkClass}>
                    Mon profil
                  </Link>
                  <Link to="/professional/availabilities" className={linkClass}>
                    Mes disponibilités
                  </Link>
                  <Link to="/appointments" className={linkClass}>
                    Mes rendez-vous
                  </Link>
                  <Link
                    to="/professional/pending-appointments"
                    className={linkClass}
                  >
                    Rendez-vous en attente
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/profile" className={linkClass}>
                    Mon profil
                  </Link>
                  <Link to="/appointments" className={linkClass}>
                    Mes rendez-vous
                  </Link>
                  <Link to="/patient/pending-appointments" className={linkClass}>
                    Rendez-vous en attente
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}