import { useEffect, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import { getMyProfile } from "@/services/userService";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/components Principal/common/EditProfileModal";
import UploadPhotoModal from "@/components/components Principal/common/UploadPhotoModal";

type User = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: "patient" | "professional";
  profession?: string;
  specialties?: string[];
  sessionDuration?: number;
  bookingMode?: "auto" | "manual";
  photo?: string | null;
  nomDeRue?: string;
  numeroAdresse?: number;
  codePostal?: string;
  province?: string;
  pays?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Vous devez être connecté.");
          return;
        }

        const data = await getMyProfile(token);
        setUser(data);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Impossible de charger le profil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fullAddress = user
    ? `${user.numeroAdresse || ""} ${user.nomDeRue || ""}, ${user.province || ""} ${user.codePostal || ""}, ${user.pays || ""}`
    : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-5xl">
            {loading && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-slate-600">Chargement...</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {!loading && user && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-8 md:flex-row md:items-start">
                  <div className="flex flex-col items-center">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-3xl font-bold text-violet-600">
                      {user.photo ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${user.photo}`}
                          alt="Photo profil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          {user.prenom?.[0]}
                          {user.nom?.[0]}
                        </>
                      )}
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        onClick={() => setOpenPhotoModal(true)}
                      >
                        Modifier photo
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-slate-900">
                      {user.prenom} {user.nom}
                    </h1>

                    <p className="mt-2 text-lg text-slate-500">
                      {user.role === "professional" ? "Professionnel" : "Patient"}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-400">Email</p>
                        <p className="text-slate-700">{user.email}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-400">Téléphone</p>
                        <p className="text-slate-700">{user.telephone}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-400">Adresse</p>
                        <p className="text-slate-700">{fullAddress}</p>
                      </div>
                    </div>

                    {user.role === "professional" && (
                      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                        <h2 className="text-xl font-semibold text-slate-900">
                          Informations professionnelles
                        </h2>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-400">Profession</p>
                            <p className="text-slate-700">{user.profession || "-"}</p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-400">Durée séance</p>
                            <p className="text-slate-700">
                              {user.sessionDuration || 0} min
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-400">Mode réservation</p>
                            <p className="text-slate-700">
                              {user.bookingMode === "auto"
                                ? "Réservation instantanée"
                                : "Validation manuelle"}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-sm font-semibold text-slate-400">Spécialités</p>
                            <p className="text-slate-700">
                              {user.specialties?.length
                                ? user.specialties.join(", ")
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8">
                      <Button
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => setOpenModal(true)}
                      >
                        Modifier mon profil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {user && (
        <EditProfileModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          user={user}
          onUpdated={() => window.location.reload()}
        />
      )}

      {user && (
        <UploadPhotoModal
          open={openPhotoModal}
          onClose={() => setOpenPhotoModal(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
}