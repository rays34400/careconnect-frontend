import api from "./api";

/**
 * =========================
 * GET MES RENDEZ-VOUS
 * =========================
 */
export const getMyAppointments = async (token: string) => {
  const response = await api.get("/appointment/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * =========================
 * GET RENDEZ-VOUS EN ATTENTE
 * =========================
 */
export const getPendingAppointments = async (token: string) => {
  const response = await api.get("/appointment/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * =========================
 * UPDATE STATUS (PRO)
 * =========================
 */
export const updateAppointmentStatus = async (
  id: string,
  status: "pending" | "confirmed" | "cancelled",
  token: string
) => {
  const response = await api.patch(
    `/appointment/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/**
 * =========================
 * ANNULER RENDEZ-VOUS
 * =========================
 */
export const cancelAppointment = async (id: string, token: string) => {
  const response = await api.patch(
    `/appointment/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/**
 * =========================
 * GET SLOTS DISPONIBLES
 * =========================
 */
export const getProfessionalSlots = async (
  professionalId: string,
  date: string
) => {
  const response = await api.get(
    `/appointment/professional/${professionalId}/slots`,
    {
      params: { date },
    }
  );

  return response.data;
};

/**
 * =========================
 * CRÉER RENDEZ-VOUS
 * =========================
 */
export const createAppointment = async (
  payload: {
    professionalId: string;
    date: string;
    startTime: string;
    note?: string;
  },
  token: string
) => {
  const response = await api.post("/appointment", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};