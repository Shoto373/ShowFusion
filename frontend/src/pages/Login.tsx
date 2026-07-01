import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark pt-20">
      <div className="bg-brand-dark-card p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Вход в панель</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Логин</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-neon"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-neon"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all duration-300"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
