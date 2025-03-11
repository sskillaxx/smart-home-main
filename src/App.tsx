import { queryClient } from "./api/apiClient";
import { SmartHomeControl } from "./components/SmartHomeControl";
import CameraInfo from "./pages/CameraInfo";
import HomeControls from "./pages/HomeControls";
import HumidityPage from "./pages/HumidityPage";
import LightPage from "./pages/LightPage";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import RollersPage from "./pages/RollersPage";
import SecuritySystem from "./pages/SecuritySystem";
import TemperaturePage from "./pages/TemperaturePage";
import VentilationPage from "./pages/VentilationPage";
import { Welcome } from "./pages/Welcome";
import { QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
