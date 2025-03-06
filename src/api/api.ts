import apiClient from "./apiClient";

// Sensors API
export const getSensors = {
  temperature: () => apiClient.get("/api/sensors/temperature"),
  security: () => apiClient.get("/api/sensors/security"),
  ventilation: () => apiClient.get("/api/sensors/ventilation"),
  light: () => apiClient.get("/api/sensors/light"),
  humidity: () => apiClient.get("/api/sensors/humidity"),
};

// Settings API
export const setSettings = {
  security: (data: object) => apiClient.post("/api/settings/security", data),
  ventilation: (data: object) => apiClient.post("/api/settings/ventilation", data),
  temperature: (data: object) => apiClient.post("/api/settings/temperature", data),
  light: (data: object) => apiClient.post("/api/settings/light", data),
  humidity: (data: object) => apiClient.post("/api/settings/humidity", data),
};
