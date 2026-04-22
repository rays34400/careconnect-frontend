import { useEffect, useState } from "react";
import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import { Button } from "@/components/ui/button";
import {
  cancelAppointment,
  getPendingAppointments,
  updateAppointmentStatus,
} from "@/services/appointmentService";

type Appointment = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  note?: string;
  patient?: {
    nom: string;
    prenom: string;
    email?: string;
  };
};

export default function ProfessionalPendingAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté.");
        return;
      }

      const data = await getPendingAppointments(token);
      setAppointments(data.data || data || []);
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

  const handleConfirm = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSuccessMessage("");
    setErrorMessage("");

    await updateAppointmentStatus(id, "confirmed", token);

    setSuccessMessage("Le rendez-vous a bien été confirmé.");
    fetchPendingAppointments();
  } catch (err: any) {
    console.error(err);
    setErrorMessage(
      err?.response?.data?.message ||
        "Impossible de confirmer le rendez-vous."
    );
  }
};

  const handleCancel = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSuccessMessage("");
    setErrorMessage("");

    await cancelAppointment(id, token);

    setSuccessMessage("Le rendez-vous a bien été annulé.");
    fetchPendingAppointments();
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
            <h1 className="text-3xl font-bold text-slate-900">
              Rendez-vous en attente
            </h1>
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
            <p className="mt-2 text-slate-500">
              Confirmez ou annulez les demandes en attente.
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
                          {appt.patient
                            ? `${appt.patient.prenom} ${appt.patient.nom}`
                            : "Patient"}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {new Date(appt.date).toLocaleDateString()} —{" "}
                          {appt.startTime} à {appt.endTime}
                        </p>

                        <p className="mt-1 text-sm text-orange-500">
                          Statut : {appt.status}
                        </p>

                        {appt.note && (
                          <p className="mt-2 text-sm text-slate-500">
                            Note : {appt.note}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleConfirm(appt._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmer
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => handleCancel(appt._id)}
                        >
                          Annuler
                        </Button>
                      </div>
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