import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-[#F4D03F] text-6xl font-bold mb-8">Ваш умный дом</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#F4D03F] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#F1C40F] transition-colors flex items-center space-x-2"
        >
          <span>Продолжить</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};
