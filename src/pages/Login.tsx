import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Login: React.FC = () => {
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(key)) { 
      navigate('/home'); 
    } else {
      alert('Неверный ключ. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Вход в систему</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="key">Ключ</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 primary">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
