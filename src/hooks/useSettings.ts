import { useMutation } from "react-query";
import { setSettings } from "../api/api";

export const useSetSecurity = () => useMutation((data: object) => setSettings.security(data).then((res) => res.data));

export const useSetVentilation = () =>
  useMutation((data: object) => setSettings.ventilation(data).then((res) => res.data));

export const useSetTemperature = () =>
  useMutation((data: object) => setSettings.temperature(data).then((res) => res.data));

export const useSetLight = () => useMutation((data: object) => setSettings.light(data).then((res) => res.data));

export const useSetHumidity = () => useMutation((data: object) => setSettings.humidity(data).then((res) => res.data));
