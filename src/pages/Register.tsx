import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Wifi } from 'lucide-react';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // TODO: Implement actual registration logic
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
      <div className="bg-[#9b8b7e] bg-opacity-90 p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
          <Wifi className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Зарегистрировать дом
        </h2>
        <form onSubmit={handleNextStep} className="space-y-4">
          {step === 1 ? (
            <>
              <input
                type="text"
                placeholder="Ваше имя"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-white"
              />
              <input
                type="text"
                placeholder="Ваша фамилия"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-white"
              />
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="Придумайте пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-white"
              />
              <input
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-white"
              />
            </>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-[#7d6b5d] text-white rounded hover:bg-[#6d5d51] transition-colors"
          >
            {step === 1 ? 'Дальше' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-white">Есть дом?</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-white hover:underline"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;