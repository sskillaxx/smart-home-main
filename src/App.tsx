import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "./pages/Register";
import HomeControls from "./pages/HomeControls";
import SecuritySystem from "./pages/SecuritySystem";
import CameraInfo from "./pages/CameraInfo";
import VentilationPage from "./pages/VentilationPage";
import TemperaturePage from "./pages/TemperaturePage";
import RollersPage from "./pages/RollersPage";
import LightPage from "./pages/LightPage";
import HumidityPage from "./pages/HumidityPage";
import { SmartHomeControl } from "./components/SmartHomeControl";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#1a1a1a]">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/controls" element={<HomeControls />} />
            <Route path="/security" element={<SecuritySystem />} />
            <Route path="/camera" element={<CameraInfo />} />
            <Route path="/ventilation" element={<VentilationPage />} />
            <Route path="/temperature" element={<TemperaturePage />} />
            <Route path="/rollers" element={<RollersPage />} />
            <Route path="/light" element={<LightPage />} />
            <Route path="/humidity" element={<HumidityPage />} />
            <Route path="/dashboard" element={<SmartHomeControl />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
