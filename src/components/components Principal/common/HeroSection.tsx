import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import photoRdvHome from "@/assets/images/photoRdvHome.jpg";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* TEXTE */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Trouvez votre professionnel de santé facilement
          </h1>

          <p className="max-w-xl text-lg text-slate-600">
            Réservez vos rendez-vous rapidement avec une plateforme simple,
            moderne et intuitive.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="rounded-xl bg-violet-600 hover:bg-violet-700"
            >
              <Link to="/professionals">Voir les professionnels</Link>
            </Button>

            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>

         
        </div>

        {/* IMAGE */}
        <div className="rounded-[2rem] bg-white p-4 shadow-lg">
          <img
            src={photoRdvHome}
            alt="Illustration santé"
            className="h-[420px] w-full rounded-[1.5rem] object-cover transition duration-300 hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  );
}