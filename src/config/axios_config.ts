import axios, {
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_BASE_URL || "https://mysite-backend-rtck.onrender.com/api/v1";


const client = axios.create({ baseURL });

export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    const token = localStorage.getItem("token");

    // Set authorization header
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }

    // Send request and return response data
    const response: AxiosResponse<T> = await client(options);
    return response.data;
  } catch (error) {
    // Handle errors
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Invalid credentials or session expired. Please login again.");
      } else if (axiosError.response?.status === 403) {
        toast.error("You are not authorized to perform this action.");
      } else if (axiosError.response?.status === 404) {
        toast.error("Resource not found.");
      } else if (axiosError.response?.status === 500) {
        toast.error("Internal server error.");
      } else if (axiosError.response?.status === 400) {
        toast.error("Bad request.");
      } else if (axiosError.response?.status === 409) {
        toast.error("Conflict.");
      } else if (axiosError.response?.status === 422) {
        toast.error("Unprocessable entity.");
      } else if (axiosError.response?.status === 429) {
        toast.error("Too many requests.");
      } else if (axiosError.response?.status === 503) {
        toast.error("Service unavailable.");
      } else {
        toast.error(axiosError.message);
      }

      throw axiosError;
    } else {
      toast.error("An unexpected error occurred");
      throw new Error("An unexpected error occurred");
    }
  }
};
