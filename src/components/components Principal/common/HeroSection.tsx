import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import photoRdvHome from "@/assets/images/photoRdvHome.jpg";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-5 md:space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Trouvez votre professionnel de santé facilement
          </h1>

          <p className="max-w-xl text-base text-slate-600 md:text-lg">
            Réservez vos rendez-vous rapidement avec une plateforme simple,
            moderne et intuitive.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 sm:w-auto"
            >
              <Link to="/professionals">Voir les professionnels</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl sm:w-auto"
            >
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-3 shadow-lg md:p-4">
          <img
            src={photoRdvHome}
            alt="Illustration santé"
            className="h-[260px] w-full rounded-[1.5rem] object-cover transition duration-300 hover:scale-[1.01] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}