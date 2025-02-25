import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Thermometer, Lightbulb, Lock } from 'lucide-react';

function HomeControls() {
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
            Управление домом
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white bg-opacity-20 rounded">
            <div className="flex items-center">
              <Thermometer className="w-6 h-6 text-white mr-3" />
              <span className="text-white">Температура</span>
            </div>
            <div className="text-white font-medium">22°C</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white bg-opacity-20 rounded">
            <div className="flex items-center">
              <Lightbulb className="w-6 h-6 text-white mr-3" />
              <span className="text-white">Освещение</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7d6b5d]"></div>
            </label>
          </div>

          <button
            onClick={() => navigate('/security')}
            className="w-full p-4 bg-white bg-opacity-20 rounded flex items-center justify-between hover:bg-opacity-30 transition-colors"
          >
            <div className="flex items-center">
              <Lock className="w-6 h-6 text-white mr-3" />
              <span className="text-white">Безопасность</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeControls;