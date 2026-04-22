import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import ProfessionalCard from "@/components/components Principal/common/ProfessionalCard";
import { Input } from "@/components/ui/input";
import { getProfessionals } from "@/services/professionalService";

type Professional = {
  _id: string;
  nom: string;
  prenom: string;
  profession: string;
  specialties?: string[];
};

export default function ProfessionalsPage() {
  const [search, setSearch] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfessionals();
        setProfessionals(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les professionnels.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filteredProfessionals = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return professionals;

    return professionals.filter((professional) => {
      const fullName =
        `${professional.prenom} ${professional.nom}`.toLowerCase();
      const profession = (professional.profession || "").toLowerCase();
      const specialties = (professional.specialties || [])
        .join(" ")
        .toLowerCase();

      return (
        fullName.includes(value) ||
        profession.includes(value) ||
        specialties.includes(value)
      );
    });
  }, [search, professionals]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-7xl">
            {/* HEADER */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Trouver un professionnel
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Recherchez un professionnel par nom, profession ou spécialité
                puis prenez rendez-vous rapidement.
              </p>

              <div className="mt-8 max-w-2xl">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ex : dentiste, Ryan, dermatologue, orthodontie..."
                  className="h-12 rounded-2xl bg-slate-50 px-4 text-base shadow-sm"
                />
              </div>
            </div>

            {/* STATES */}
            {loading && (
              <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-slate-600">Chargement des professionnels...</p>
              </div>
            )}

            {!loading && error && (
              <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="mt-8 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Professionnels disponibles
                  </h2>

                  <p className="text-sm text-slate-500">
                    {filteredProfessionals.length} résultat
                    {filteredProfessionals.length > 1 ? "s" : ""}
                  </p>
                </div>

                {filteredProfessionals.length > 0 ? (
                  <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProfessionals.map((professional) => (
                      <ProfessionalCard
                        key={professional._id}
                        _id={professional._id}
                        nom={professional.nom}
                        prenom={professional.prenom}
                        profession={professional.profession}
                        specialties={professional.specialties || []}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
                    <p className="text-slate-600">
                      Aucun professionnel trouvé pour cette recherche.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}