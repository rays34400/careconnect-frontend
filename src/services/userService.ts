import api from "@/services/api";

export const getMyProfile = async (token: string) => {
  const response = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (data: any, token: string) => {
  const response = await api.put("/users/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateMyPhoto = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.put("/users/me/photo", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};