import api from "@/services/api";

export const getProfessionals = async (q?: string) => {
  const response = await api.get("/professionals", {
    params: q ? { q } : {},
  });

  return response.data;
};

export const getProfessionalById = async (id: string) => {
  const response = await api.get(`/professionals/${id}`);
  return response.data;
};

export const getProfessionalSuggestions = async (q: string) => {
  const response = await api.get("/professionals/suggestions", {
    params: { q },
  });

  return response.data;
};

export const getProfessions = async () => {
  const response = await api.get("/professionals/professions");
  return response.data;
};

export const getSpecialties = async () => {
  const response = await api.get("/professionals/specialties");
  return response.data;
};

export const getProfessionalAvailabilities = async (id: string) => {
  const response = await api.get(`/professionals/${id}/availabilities`);
  return response.data;
};