import api from "@/services/api";

export const getMyAvailabilities = async (token: string) => {
  const response = await api.get("/availabilities/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createAvailability = async (
  payload: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  },
  token: string
) => {
  const response = await api.post("/availabilities", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAvailability = async (id: string, token: string) => {
  const response = await api.delete(`/availabilities/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};