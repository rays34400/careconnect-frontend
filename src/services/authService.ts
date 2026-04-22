import api from "@/services/api";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

type RegisterPayload = {
  email: string;
  password: string;
  role: "patient" | "professional";
  nom: string;
  prenom: string;
  telephone: string;
  nomDeRue: string;
  numeroAdresse: number;
  codePostal: string;
  province: string;
  pays: string;
  dateDeNaissance: string;
  profession?: string;
  specialties?: string[];
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};