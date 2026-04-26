import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams  } from "react-router-dom";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProfessionalById,
  getProfessionalAvailabilities,
} from "@/services/professionalService";
import {
  createAppointment,
  getProfessionalSlots,
} from "@/services/appointmentService";

type Professional = {
  _id: string;
  nom: string;
  prenom: string;
  profession: string;
  specialties?: string[];
  photo?: string | null;
  telephone?: string;
  nomDeRue?: string;
  numeroAdresse?: number;
  codePostal?: string;
  province?: string;
  pays?: string;
  sessionDuration?: number;
  bookingMode?: "auto" | "manual";
};

type Availability = {
  _id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getNextDateForDay = (targetDay: number) => {
  const today = new Date();
  const result = new Date(today);
  const currentDay = result.getDay();

  let diff = targetDay - currentDay;
  if (diff < 0) diff += 7;

  result.setDate(result.getDate() + diff);
  return formatDateLocal(result);
};

export default function ProfessionalDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const isLogged = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professionalData, availabilitiesData] = await Promise.all([
          getProfessionalById(id as string),
          getProfessionalAvailabilities(id as string),
        ]);

        setProfessional(professionalData);
        setAvailabilities(availabilitiesData.availabilities || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);
  useEffect(() => {
    const shouldOpenBooking = searchParams.get("book");

    if (shouldOpenBooking === "1") {
      setShowBooking(true);
    }
  }, [searchParams]);
  const availableDays = useMemo(() => {
    const unique = [...new Set(availabilities.map((item) => item.dayOfWeek))];
    return unique.sort((a, b) => a - b);
  }, [availabilities]);

  const handleOpenBooking = () => {
    setBookingMessage("");
    setBookingError("");
    setShowBooking(true);
  };

  const handlePickDay = async (dayOfWeek: number) => {
    try {
      if (!id) return;

      const exactDate = getNextDateForDay(dayOfWeek);

      setSelectedDayOfWeek(dayOfWeek);
      setDate(exactDate);
      setSelectedSlot("");
      setSlots([]);
      setBookingError("");
      setBookingMessage("");
      setLoadingSlots(true);

      const data = await getProfessionalSlots(id, exactDate);
      console.log("SLOTS API :", data);
      setSlots(data.slots || []);
    } catch (err: any) {
      console.error(err);
      setBookingError(
        err?.response?.data?.message || "Impossible de charger les créneaux."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !id || !date || !selectedSlot) return;

      setBookingLoading(true);
      setBookingError("");
      setBookingMessage("");

      const data = await createAppointment(
        {
          professionalId: id,
          date,
          startTime: selectedSlot,
          note,
        },
        token
      );

      setBookingMessage(data?.message || "Rendez-vous créé avec succès.");
      setSelectedSlot("");
      setNote("");

      const refreshed = await getProfessionalSlots(id, date);
      setSlots(refreshed.slots || []);
    } catch (err: any) {
      console.error(err);
      setBookingError(
        err?.response?.data?.message || "Impossible de créer le rendez-vous."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (!professional) return <p className="p-6">Introuvable</p>;

  const fullAddress = `${professional.numeroAdresse || ""} ${
    professional.nomDeRue || ""
  }, ${professional.province || ""} ${
    professional.codePostal || ""
  }, ${professional.pays || ""}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-3xl font-bold text-violet-600">
                  {professional.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${professional.photo}`}
                      alt="photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      {professional.prenom?.[0]}
                      {professional.nom?.[0]}
                    </>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold">
                    {professional.prenom} {professional.nom}
                  </h1>

                  <p className="mt-2 text-lg text-slate-500">
                    {professional.profession}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(professional.specialties || []).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    {professional.bookingMode === "auto"
                      ? "Réservation instantanée"
                      : "Validation manuelle"}
                  </p>

                  <p className="text-sm text-slate-600">
                    Durée séance : {professional.sessionDuration} min
                  </p>
                </div>
              </div>

              <div className="mt-10 border-t pt-6 space-y-3">
                <h2 className="text-xl font-semibold">Informations</h2>

                {professional.telephone && <p>📞 {professional.telephone}</p>}
                <p>📍 {fullAddress}</p>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={handleOpenBooking}
                >
                  Prendre rendez-vous
                </Button>

                <Button variant="outline" onClick={() => window.history.back()}>
                  Retour
                </Button>
              </div>
            </div>

            {showBooking && (
              <div className="rounded-3xl bg-white p-8 shadow">
                {!isLogged ? (
                  <div className="space-y-5">
                    <h2 className="text-2xl font-bold">
                      Vous devez être connecté
                    </h2>

                    <p className="text-slate-600">
                      Connectez-vous ou créez un compte pour réserver un rendez-vous.
                    </p>

                    <div className="flex gap-4">
                      <Button asChild className="bg-violet-600 hover:bg-violet-700">
                        <Link to="/login">Connexion</Link>
                      </Button>

                      <Button asChild variant="outline">
                        <Link to="/register">Inscription</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Réserver un rendez-vous
                      </h2>
                      <p className="mt-2 text-slate-600">
                        Choisissez un jour disponible puis un créneau.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium text-slate-900">
                        Jours disponibles
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {availableDays.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handlePickDay(day)}
                            className={`rounded-xl border px-4 py-2 text-sm ${
                              selectedDayOfWeek === day
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "hover:border-violet-400"
                            }`}
                          >
                            {days[day]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {date && (
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">
                          Date sélectionnée :
                        </p>
                        <p className="font-semibold text-slate-900">{date}</p>
                      </div>
                    )}

                    {loadingSlots && (
                      <p className="text-slate-500">Chargement des créneaux...</p>
                    )}

                    {!loadingSlots && slots.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Créneau disponible
                        </label>

                        <select
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="h-10 w-full rounded-md border px-3"
                        >
                          <option value="">Choisir un créneau</option>
                          {slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {!loadingSlots && date && slots.length === 0 && (
                      <p className="text-slate-500">
                        Aucun créneau disponible pour cette date.
                      </p>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Note (optionnel)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border p-3"
                        placeholder="Ajoutez une note si besoin..."
                      />
                    </div>

                    {bookingError && (
                      <p className="text-sm text-red-500">{bookingError}</p>
                    )}

                    {bookingMessage && (
                      <p className="text-sm text-green-600">{bookingMessage}</p>
                    )}

                    <Button
                      onClick={handleCreateAppointment}
                      disabled={!date || !selectedSlot || bookingLoading}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      {bookingLoading
                        ? "Création..."
                        : "Confirmer le rendez-vous"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}