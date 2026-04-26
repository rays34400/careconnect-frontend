import { useEffect, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import { Button } from "@/components/ui/button";
import {
  cancelAppointment,
  getMyAppointments,
} from "@/services/appointmentService";

type Appointment = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  professional?: {
    nom: string;
    prenom: string;
    profession?: string;
  };
};

export default function PatientPendingAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté.");
        return;
      }

      const data = await getMyAppointments(token);
      const allAppointments = data.data || [];
      const pendingAppointments = allAppointments.filter(
        (appt: Appointment) => appt.status === "pending"
      );

      setAppointments(pendingAppointments);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les rendez-vous en attente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await cancelAppointment(id, token);
      fetchPendingAppointments();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Impossible d'annuler le rendez-vous."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex flex-col md:flex-row">
        <SideMenu />

        <main className="flex-1 px-4 py-6 md:px-6 md:py-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Mes rendez-vous en attente
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Voici vos demandes de rendez-vous en attente de confirmation.
            </p>

            {loading && (
              <p className="mt-6 text-slate-600">Chargement...</p>
            )}

            {!loading && error && (
              <p className="mt-6 text-red-500">{error}</p>
            )}

            {!loading && !error && appointments.length === 0 && (
              <p className="mt-6 text-slate-500">
                Aucun rendez-vous en attente.
              </p>
            )}

            {!loading && !error && appointments.length > 0 && (
              <div className="mt-6 space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {appt.professional
                            ? `${appt.professional.prenom} ${appt.professional.nom}`
                            : "Professionnel"}
                        </p>

                        {appt.professional?.profession && (
                          <p className="text-sm text-slate-500">
                            {appt.professional.profession}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-slate-600">
                          {new Date(appt.date).toLocaleDateString()} —{" "}
                          {appt.startTime} à {appt.endTime}
                        </p>

                        <p className="mt-1 text-sm text-orange-500">
                          Statut : {appt.status}
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => handleCancel(appt._id)}
                        className="w-full md:w-auto"
                      >
                        Annuler
                      </Button>
                    </div>
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