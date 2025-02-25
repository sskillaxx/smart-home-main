import React, { useState } from "react";
import { Settings2, Wind, Lightbulb, Blinds, Shield, Thermometer, Droplets, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleControl = (type: string) => {
    navigate(`/${type}`);
  };

  const handleToggle = (type: keyof typeof controlStates, value: boolean) => {
    setControlStates((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-[#F4D03F] text-4xl font-bold mb-12">Добро пожаловать!</h1>
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
    </div>
  );
};
