"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Settings2,
  Wind,
  Lightbulb,
  Blinds,
  Shield,
  Thermometer,
  Droplets,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHumidity, useLight, useSecurity, useTemperature, useVentilation } from "../hooks/useSensors";
import {
  useSetHumidity,
  useSetLight,
  useSetSecurity,
  useSetTemperature,
  useSetVentilation,
} from "../hooks/useSettings";

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onToggle: (isOn: boolean) => void;
  isOn: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon, label, onClick, onToggle, isOn }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="bg-[#A69076] bg-opacity-90 p-4 rounded-lg w-32 h-32 flex flex-col items-center justify-center space-y-2 transition-all hover:bg-opacity-100"
    >
      <div className="absolute top-2 left-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!isOn);
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center ${isOn ? "bg-green-500" : "bg-gray-400"}`}
        >
          <Power className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="absolute top-2 right-2">
        <div className="w-6 h-6 p-1 rounded-lg cursor-pointer hover:bg-[#8B7355]">
          <Settings2 className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-white">{icon}</div>
      <span className="text-white text-sm font-medium">{label}</span>
    </button>
  </div>
);

const rooms = [
  { id: "bedroom", name: "Спальня" },
  // { id: "living_room", name: "Гостинная" },
  // { id: "bathroom_1", name: "Санузел 1" },
  // { id: "bathroom_2", name: "Санузел 2" },
  // { id: "terrace_1", name: "Терраса 1" },
  // { id: "terrace_2", name: "Терраса 2" },
  // { id: "kitchen", name: "Кухня" },
  // { id: "balcony", name: "Балкон" },
  // { id: "laundry", name: "Прачечная" },
  // { id: "guest_room", name: "Гостевая" },
];

const outputFieldPositions = [
  { left: "calc(10% + 12.5%)", bottom: "30%" },
  { left: "calc(20% + 12%)", bottom: "30%" },
  { left: "calc(30% + 12%)", bottom: "30%" },
  { left: "calc(40% + 11%)", bottom: "30%" },
  { left: "calc(50% + 13%)", bottom: "30%" },
  { left: "calc(60% + 13%)", bottom: "30%" },
];

const widgetPosition = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: "460px",
  zIndex: 10,
};

export const SmartHomeControl: React.FC = () => {
  const navigate = useNavigate();
  const [controlStates, setControlStates] = useState({
    ventilation: false,
    light: false,
    blinds: false,
    security: false,
    temperature: false,
    humidity: false,
  });

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [outputValues, setOutputValues] = useState({
    field1: 500,
    field2: true,
    field3: true,
    field4: false,
    field5: 50,
    field6: 22,
  });

  const mutateTemperatureState = useSetTemperature();
  const mutateVentilationState = useSetVentilation();
  const mutateHumidityState = useSetHumidity();
  const mutateSecurityState = useSetSecurity();
  const mutateLigthState = useSetLight();

  const handleControl = (type: string) => {
    navigate(`/${type}`);
  };

  const handleToggle = (type: keyof typeof controlStates, value: boolean) => {
    setControlStates((prev) => ({ ...prev, [type]: value }));

    switch (type) {
      case "humidity":
        mutateHumidityState.mutate({ state: value ? 1 : 0, humidity: "" });
        break;
      case "light":
        mutateLigthState.mutate({ state: value ? 1 : 0, duration: "", mode: "" });
        break;
      case "security":
        mutateSecurityState.mutate({ state: value ? 1 : 0 });
        break;
      case "temperature":
        mutateTemperatureState.mutate({ state: value ? 1 : 0, targetTemperature: "" });
        break;
      case "ventilation":
        mutateVentilationState.mutate({ state: value ? 1 : 0 });
        break;
    }
  };

  const goToNextRoom = () => {
    setCurrentRoomIndex((prevIndex) => (prevIndex + 1) % rooms.length);
  };

  const goToPreviousRoom = () => {
    setCurrentRoomIndex((prevIndex) => (prevIndex - 1 + rooms.length) % rooms.length);
  };

  const { data: temperatureData } = useTemperature();
  const { data: humidityData } = useHumidity();
  const { data: ventialtionData } = useVentilation();
  const { data: securityData } = useSecurity();
  const { data: lightData } = useLight();

  useEffect(() => {
    setOutputValues({
      field1: 500,
      field2: lightData ? lightData.state === "on" : false,
      field3: ventialtionData ? ventialtionData.state === "on" : false,
      field4: securityData ? securityData.state === "on" : false,
      field5: humidityData ? humidityData?.humidity : 0,
      field6: temperatureData ? temperatureData?.temperature : 0,
    });

    setControlStates({
      ventilation: ventialtionData ? ventialtionData.state === "on" : false,
      humidity: humidityData ? humidityData.state === "on" : false,
      light: lightData ? lightData.state === "on" : false,
      security: securityData ? securityData.state === "on" : false,
      temperature: temperatureData ? temperatureData.state === "on" : false,
      blinds: true,
    });
  }, [temperatureData, humidityData, ventialtionData, securityData, lightData]);

  const buttonPositions = {
    left: { left: "15px", top: "50%", transform: "translateY(-50%)" },
    right: { right: "15px", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-[#F4D03F] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 mt-20 sm:mt-24 md:mt-28">
          Добро пожаловать!
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ControlButton
            icon={<Wind className="w-8 h-8" />}
            label="Вентиляция"
            onClick={() => handleControl("ventilation")}
            onToggle={(value) => handleToggle("ventilation", value)}
            isOn={controlStates.ventilation}
          />
          <ControlButton
            icon={<Lightbulb className="w-8 h-8" />}
            label="Свет"
            onClick={() => handleControl("light")}
            onToggle={(value) => handleToggle("light", value)}
            isOn={controlStates.light}
          />
          <ControlButton
            icon={<Blinds className="w-8 h-8" />}
            label="Шторы"
            onClick={() => handleControl("rollers")}
            onToggle={(value) => handleToggle("blinds", value)}
            isOn={controlStates.blinds}
          />
          <ControlButton
            icon={<Shield className="w-8 h-8" />}
            label="Защита"
            onClick={() => handleControl("security")}
            onToggle={(value) => handleToggle("security", value)}
            isOn={controlStates.security}
          />
          <ControlButton
            icon={<Thermometer className="w-8 h-8" />}
            label="Температура"
            onClick={() => handleControl("temperature")}
            onToggle={(value) => handleToggle("temperature", value)}
            isOn={controlStates.temperature}
          />
          <ControlButton
            icon={<Droplets className="w-8 h-8" />}
            label="Влажность"
            onClick={() => handleControl("humidity")}
            onToggle={(value) => handleToggle("humidity", value)}
            isOn={controlStates.humidity}
          />
        </div>
      </div>

      {/* Room Selector Widget */}
      <div className="font-montserrat" style={widgetPosition}>
        <div className="flex items-center justify-center">
          <div
            className="w-full h-[150px] rounded-[30px] flex items-center px-4 relative"
            style={{
              backgroundImage: "url('src/components/main_slider.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <button
              onClick={goToPreviousRoom}
              className="w-[60px] h-[60px] bg-white/20 rounded-full flex items-center justify-center absolute left-2 top-1/2 transform -translate-y-1/2"
              aria-label="Previous room"
              style={buttonPositions.left}
            >
              <ChevronLeft className="w-[30px] h-[30px] text-white" />
            </button>

            <h2 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-black text-white">
              {rooms[currentRoomIndex].name}
            </h2>

            {/* Output Fields */}
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[0]}>
              {outputValues.field1}
            </div>
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[1]}>
              {outputValues.field2 ? "вкл." : "выкл."}
            </div>
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[2]}>
              {outputValues.field3 ? "вкл." : "выкл."}
            </div>
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[3]}>
              {outputValues.field4 ? "вкл." : "выкл."}
            </div>
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[4]}>
              {outputValues.field5}%
            </div>
            <div className="absolute text-xs font-medium text-white" style={outputFieldPositions[5]}>
              {outputValues.field6}°
            </div>

            <button
              onClick={goToNextRoom}
              className="w-[60px] h-[60px] bg-white/20 rounded-full flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Next room"
              style={buttonPositions.right}
            >
              <ChevronRight className="w-[30px] h-[30px] text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
