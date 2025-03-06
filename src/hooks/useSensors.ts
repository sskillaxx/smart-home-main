import { useQuery } from "react-query";
import { getSensors } from "../api/api";

export const useTemperature = () =>
  useQuery("temperature", () => getSensors.temperature().then((res) => res.data.temperature));

export const useSecurity = () => useQuery("security", () => getSensors.security().then((res) => res.data.message));

export const useVentilation = () => useQuery("ventilation", () => getSensors.ventilation().then((res) => res.data));

export const useLight = () => useQuery("light", () => getSensors.light().then((res) => res.data));

export const useHumidity = () => useQuery("humidity", () => getSensors.humidity().then((res) => res.data));
