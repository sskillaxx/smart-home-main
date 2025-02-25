import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft } from 'lucide-react';

function CameraInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
      <div className="bg-[#9b8b7e] bg-opacity-90 p-8 rounded-lg shadow-xl w-96">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white text-center flex-1">
            Информация с камеры
          </h2>
        </div>
        
        <div className="relative aspect-video bg-black rounded-lg mb-4">
          <div className="absolute top-2 right-2">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center justify-center h-full">
            <span className="text-white text-xl">SIGNAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraInfo;