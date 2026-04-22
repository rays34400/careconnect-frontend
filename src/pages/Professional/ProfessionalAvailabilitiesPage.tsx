import { useEffect, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAvailability,
  deleteAvailability,
  getMyAvailabilities,
} from "@/services/availabilityService";

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

export default function ProfessionalAvailabilitiesPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté.");
        return;
      }

      const data = await getMyAvailabilities(token);
      setAvailabilities(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les disponibilités."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await createAvailability(
        {
          dayOfWeek: Number(dayOfWeek),
          startTime,
          endTime,
        },
        token
      );

      setDayOfWeek("1");
      setStartTime("");
      setEndTime("");

      fetchAvailabilities();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Impossible d'ajouter la disponibilité."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteAvailability(id, token);
      fetchAvailabilities();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Impossible de supprimer la disponibilité."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Mes disponibilités
              </h1>
              <p className="mt-2 text-slate-500">
                Ajoutez et gérez vos créneaux disponibles.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Ajouter une disponibilité
              </h2>

              <form
                onSubmit={handleAddAvailability}
                className="mt-6 grid gap-4 md:grid-cols-4"
              >
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="h-10 rounded-md border px-3"
                >
                  {days.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>

                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />

                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Ajouter
                </Button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Liste de mes disponibilités
              </h2>

              {loading && (
                <p className="mt-6 text-slate-600">Chargement...</p>
              )}

              {!loading && error && (
                <p className="mt-6 text-red-500">{error}</p>
              )}

              {!loading && !error && availabilities.length === 0 && (
                <p className="mt-6 text-slate-500">
                  Aucune disponibilité ajoutée.
                </p>
              )}

              {!loading && !error && availabilities.length > 0 && (
                <div className="mt-6 space-y-4">
                  {availabilities.map((availability) => (
                    <div
                      key={availability._id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {days[availability.dayOfWeek]}
                        </p>
                        <p className="text-slate-600">
                          {availability.startTime} → {availability.endTime}
                        </p>
                        <p className="text-sm text-slate-400">
                          {availability.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(availability._id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}