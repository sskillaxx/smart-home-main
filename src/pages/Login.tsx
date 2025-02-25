import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useAuthStore } from "../store/authStore";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout title="Войти в дом">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Имейл"
          className="w-full p-3 rounded-lg bg-white bg-opacity-90 placeholder-gray-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full p-3 rounded-lg bg-white bg-opacity-90 placeholder-gray-500"
          required
        />
        <button
          type="submit"
          className="w-full p-3 rounded-lg bg-[#8B7355] text-white font-semibold hover:bg-[#7A6548] transition-colors"
        >
          Войти
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-white">Нет дома?</p>
        <Link
          to="/register"
          className="block mt-2 p-3 rounded-lg bg-[#8B7355] text-white font-semibold hover:bg-[#7A6548] transition-colors"
        >
          Зарегистрироваться
        </Link>
      </div>
    </AuthLayout>
  );
};
