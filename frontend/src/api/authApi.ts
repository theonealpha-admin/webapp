import { axiosInstance } from "@/lib/axios";
import { UserResponse } from "@/types/authTypes";

interface LoginResponse {
  accessToken: string;
  admin: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/users/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error while fetching data ${error}`);
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.get<UserResponse>("users/me");
      return response.data;
    } catch (error) {
      throw new Error(`Error while fetching data ${error}`);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      throw new Error(`Error while fetching data ${error}`);
    }
  },
};
