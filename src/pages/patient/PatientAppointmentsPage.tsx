import { useEffect, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import {
  getMyAppointments,
  cancelAppointment,
} from "@/services/appointmentService";
import { Button } from "@/components/ui/button";

type Appointment = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  professional: {
    nom: string;
    prenom: string;
    profession: string;
  };
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getMyAppointments(token);
      setAppointments(data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Impossible de charger les rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "all") return true;
    return appt.status === filter;
  });

  const handleCancel = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setSuccessMessage("");
      setErrorMessage("");

      await cancelAppointment(id, token);

      setSuccessMessage("Le rendez-vous a bien été annulé.");
      fetchAppointments();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.message ||
          "Impossible d'annuler le rendez-vous."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1 px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold">Mes rendez-vous</h1>

            <p className="mt-2 text-slate-500">
              Consultez l’état de vos rendez-vous.
            </p>

            {successMessage && (
              <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-green-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "Tous", value: "all" },
                { label: "En attente", value: "pending" },
                { label: "Confirmés", value: "confirmed" },
                { label: "Annulés", value: "cancelled" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    setFilter(
                      item.value as "all" | "pending" | "confirmed" | "cancelled"
                    )
                  }
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    filter === item.value
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "hover:border-violet-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="mt-6">Chargement...</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="mt-6 text-slate-500">
                Aucun rendez-vous pour ce filtre.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        {appt.professional.prenom} {appt.professional.nom}
                      </p>

                      <p className="text-sm text-slate-500">
                        {appt.professional.profession}
                      </p>

                      <p className="mt-1 text-sm">
                        {new Date(appt.date).toLocaleDateString()} —{" "}
                        {appt.startTime} à {appt.endTime}
                      </p>

                      <p className="mt-1 text-sm">
                        Statut :{" "}
                        <span
                          className={
                            appt.status === "confirmed"
                              ? "text-green-600"
                              : appt.status === "pending"
                              ? "text-orange-500"
                              : "text-red-500"
                          }
                        >
                          {appt.status}
                        </span>
                      </p>
                    </div>

                    {appt.status !== "cancelled" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancel(appt._id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}