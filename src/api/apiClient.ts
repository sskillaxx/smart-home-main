import axios from "axios";
import { QueryClient } from "react-query";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
      refetchInterval: 15000, // <--- Глобальный интервал
      refetchIntervalInBackground: false, // Обновление даже при невидимой вкладке
    },
  },
});
