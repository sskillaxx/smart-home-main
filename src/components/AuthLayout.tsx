import React from 'react';
import { Home } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-[#A69076] bg-opacity-90 rounded-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-3 rounded-lg mb-4">
              <Home className="w-6 h-6 text-[#A69076]" />
            </div>
            <h2 className="text-white text-xl font-semibold">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};