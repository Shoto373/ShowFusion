import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolio, createPortfolioItem, deletePortfolioItem, getSettings, updateSetting, logout } from '../api';

export const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'text' | 'portfolio'>('text');
  
  // Settings state
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  
  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('fire');
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const items = await getPortfolio();
      setPortfolioItems(items);
      
      const settings = await getSettings();
      const hTitle = settings.find((s: any) => s.key === 'hero_title');
      const hDesc = settings.find((s: any) => s.key === 'hero_desc');
      if (hTitle) setHeroTitle(hTitle.value);
      if (hDesc) setHeroDesc(hDesc.value);
    } catch (e) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveText = async () => {
    await updateSetting('hero_title', heroTitle, 'Заголовок на главной');
    await updateSetting('hero_desc', heroDesc, 'Описание на главной');
    alert('Сохранено!');
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return alert('Выберите файл');
    await createPortfolioItem(newTitle, newType, newImage);
    setNewTitle('');
    setNewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchData();
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Точно удалить?')) {
      await deletePortfolioItem(id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Панель управления</h1>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-400">Выйти</button>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'text' ? 'bg-brand-neon text-brand-dark' : 'bg-gray-800'}`}
          >
            Тексты
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'portfolio' ? 'bg-brand-neon text-brand-dark' : 'bg-gray-800'}`}
          >
            Портфолио
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl mb-4">Главная страница</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Главный заголовок</label>
                <input 
                  type="text" 
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="ОГНЕННОЕ ШОУ"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Описание</label>
                <textarea 
                  value={heroDesc}
                  onChange={e => setHeroDesc(e.target.value)}
                  className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 text-white h-32"
                  placeholder="Превращаем любое событие в незабываемую феерию..."
                />
              </div>
              <button 
                onClick={handleSaveText}
                className="bg-brand-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-2xl mb-4">Добавить работу</h2>
              <form onSubmit={handleAddPortfolio} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 mb-2">Название</label>
                  <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" />
                </div>
                <div className="w-48">
                  <label className="block text-gray-400 mb-2">Категория</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2">
                    <option value="fire">Файер-шоу</option>
                    <option value="smoke">Дым</option>
                    <option value="light">Свет</option>
                    <option value="fountain">Фонтаны</option>
                    <option value="cinderella">Золушка</option>
                    <option value="bubbles">Пузыри</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 mb-2">Фото</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setNewImage(e.target.files?.[0] || null)} required className="w-full text-sm text-gray-400" />
                </div>
                <button type="submit" className="bg-brand-neon text-brand-dark px-6 py-2 rounded-lg font-bold">Добавить</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map(item => (
                <div key={item.id} className="bg-brand-dark-card rounded-xl overflow-hidden border border-gray-700">
                  <img src={`http://localhost:8000${item.image}`} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.type}</p>
                    </div>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-400 text-sm">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
