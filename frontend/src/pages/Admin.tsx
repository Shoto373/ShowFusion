import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolio, createPortfolioItem, deletePortfolioItem, logout, getReviews, createReview, deleteReview, getServices, createService, updateService, deleteService } from '../api';

export const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'services'>('portfolio');

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('fire');
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewDate, setNewReviewDate] = useState('');

  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [newServiceKey, setNewServiceKey] = useState('');
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFeatures, setNewServiceFeatures] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('Flame');
  const [newServiceImage, setNewServiceImage] = useState<File | null>(null);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const items = await getPortfolio();
      setPortfolioItems(items);
      const revs = await getReviews();
      setReviews(revs);
      const srvs = await getServices();
      setServices(srvs);
    } catch (e) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    let isoDate = undefined;
    if (newReviewDate) {
      isoDate = new Date(newReviewDate).toISOString();
    }
    await createReview(newReviewAuthor, newReviewText, newReviewRating, isoDate);
    setNewReviewAuthor('');
    setNewReviewText('');
    setNewReviewRating(5);
    setNewReviewDate('');
    fetchData();
  };

  const handleDeleteReview = async (id: number) => {
    if (window.confirm('Точно удалить отзыв?')) {
      await deleteReview(id);
      fetchData();
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceImage && !editingServiceId) return alert('Выберите файл для новой услуги');
    
    if (editingServiceId) {
      await updateService(editingServiceId, newServiceKey, newServiceTitle, newServiceDesc, newServiceFeatures, newServiceIcon, newServicePrice, newServiceImage);
      setEditingServiceId(null);
    } else {
      await createService(newServiceKey, newServiceTitle, newServiceDesc, newServiceFeatures, newServiceIcon, newServicePrice, newServiceImage, null);
    }
    
    setNewServiceKey('');
    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServiceFeatures('');
    setNewServicePrice('');
    setNewServiceIcon('Flame');
    setNewServiceImage(null);
    if (serviceFileInputRef.current) serviceFileInputRef.current.value = '';
    fetchData();
  };

  const handleEditService = (service: any) => {
    setEditingServiceId(service.id);
    setNewServiceKey(service.key);
    setNewServiceTitle(service.title);
    setNewServiceDesc(service.description);
    setNewServiceFeatures(service.features);
    setNewServicePrice(service.price);
    setNewServiceIcon(service.icon_name);
    setNewServiceImage(null);
    window.scrollTo(0, 0);
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Точно удалить услугу?')) {
      await deleteService(id);
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
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'portfolio' ? 'bg-brand-neon text-brand-dark' : 'bg-gray-800'}`}
          >
            Портфолио
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'reviews' ? 'bg-brand-neon text-brand-dark' : 'bg-gray-800'}`}
          >
            Отзывы
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'services' ? 'bg-brand-neon text-brand-dark' : 'bg-gray-800'}`}
          >
            Услуги
          </button>
        </div>

        {activeTab === 'services' && (
          <div>
            <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-2xl mb-4">{editingServiceId ? 'Редактировать услугу' : 'Добавить услугу'}</h2>
              <form onSubmit={handleAddService} className="flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-gray-400 mb-2">Ключ (ID)</label>
                    <input type="text" value={newServiceKey} onChange={e => setNewServiceKey(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" placeholder="Например: fire" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-400 mb-2">Название</label>
                    <input type="text" value={newServiceTitle} onChange={e => setNewServiceTitle(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" />
                  </div>
                  <div className="w-48">
                    <label className="block text-gray-400 mb-2">Иконка</label>
                    <select value={newServiceIcon} onChange={e => setNewServiceIcon(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2">
                      <option value="Flame">Огонь (Flame)</option>
                      <option value="Star">Звезда (Star)</option>
                      <option value="Sparkles">Блестки (Sparkles)</option>
                      <option value="Music">Музыка (Music)</option>
                      <option value="Wind">Ветер (Wind)</option>
                      <option value="Sun">Солнце (Sun)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-400 mb-2">Цена</label>
                    <input type="text" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" placeholder="от 15 000 ₽" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-400 mb-2">Фото {editingServiceId && '(Оставьте пустым, чтобы не менять)'}</label>
                    <input type="file" accept="image/*" ref={serviceFileInputRef} onChange={e => setNewServiceImage(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-neon file:text-brand-dark hover:file:bg-brand-neon/80 cursor-pointer transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Описание</label>
                  <textarea value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 h-24" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Особенности (через запятую)</label>
                  <input type="text" value={newServiceFeatures} onChange={e => setNewServiceFeatures(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" placeholder="Яркий реквизит,Безопасность..." />
                </div>
                <div className="flex justify-end gap-4">
                  {editingServiceId && (
                    <button type="button" onClick={() => { setEditingServiceId(null); setNewServiceTitle(''); setNewServiceKey(''); setNewServiceDesc(''); setNewServiceFeatures(''); setNewServicePrice(''); setNewServiceImage(null); }} className="px-6 py-2 rounded-lg font-bold text-gray-400">Отмена</button>
                  )}
                  <button type="submit" className="bg-brand-neon text-brand-dark px-6 py-2 rounded-lg font-bold">
                    {editingServiceId ? 'Сохранить изменения' : 'Добавить услугу'}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map(service => (
                <div key={service.id} className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-6">
                  <img src={service.image.startsWith('/media') ? service.image : `http://localhost:8000${service.image}`} alt={service.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xl">{service.title} <span className="text-sm text-gray-500">({service.key})</span></h3>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditService(service)} className="text-brand-neon hover:text-brand-neon/80 text-sm">Редактировать</button>
                        <button onClick={() => handleDeleteService(service.id)} className="text-red-500 hover:text-red-400 text-sm">Удалить</button>
                      </div>
                    </div>
                    <p className="text-brand-gold font-bold my-2">{service.price}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-2xl mb-4">Добавить работу в портфолио</h2>
              <form onSubmit={handleAddPortfolio} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 mb-2">Название</label>
                  <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" />
                </div>
                <div className="w-48">
                  <label className="block text-gray-400 mb-2">Категория</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2">
                    {services.map(s => (
                      <option key={s.key} value={s.key}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 mb-2">Фото</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setNewImage(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-neon file:text-brand-dark hover:file:bg-brand-neon/80 cursor-pointer transition-all" />
                </div>
                <button type="submit" className="bg-brand-neon text-brand-dark px-6 py-2 rounded-lg font-bold">Добавить</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map(item => (
                <div key={item.id} className="bg-brand-dark-card rounded-xl overflow-hidden border border-gray-700">
                  <img 
                    src={item.image.startsWith('/media') ? item.image : (item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`)} 
                    alt={item.title} 
                    className="w-full h-48 object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549444498-8ec1f4a9b2b2?auto=format&fit=crop&q=80';
                    }}
                  />
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

        {activeTab === 'reviews' && (
          <div>
            <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-2xl mb-4">Добавить отзыв</h2>
              <form onSubmit={handleAddReview} className="flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-400 mb-2">Имя автора</label>
                    <input type="text" value={newReviewAuthor} onChange={e => setNewReviewAuthor(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-gray-400 mb-2">Дата (опционально)</label>
                    <input type="date" value={newReviewDate} onChange={e => setNewReviewDate(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2" />
                  </div>
                  <div className="w-32">
                    <label className="block text-gray-400 mb-2">Оценка</label>
                    <select value={newReviewRating} onChange={e => setNewReviewRating(Number(e.target.value))} className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2">
                      <option value="5">5 звезд</option>
                      <option value="4">4 звезды</option>
                      <option value="3">3 звезды</option>
                      <option value="2">2 звезды</option>
                      <option value="1">1 звезда</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Текст отзыва</label>
                  <textarea value={newReviewText} onChange={e => setNewReviewText(e.target.value)} required className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-2 h-24" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-brand-neon text-brand-dark px-6 py-2 rounded-lg font-bold">Добавить отзыв</button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-brand-dark-card p-6 rounded-xl border border-gray-700 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{review.author}</h3>
                        <div className="text-brand-gold">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                      </div>
                      <button onClick={() => handleDeleteReview(review.id)} className="text-red-500 hover:text-red-400 text-sm">Удалить</button>
                    </div>
                    <p className="text-gray-300 italic">"{review.text}"</p>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 text-right">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
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
