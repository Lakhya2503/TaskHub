import apiClient from "../utils/apiClient";

export const register = (data) => {
   return apiClient.post("/auth/register", data);
}

