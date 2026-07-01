import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPortfolio } from '../api';

const filters = [
  { id: 'all', label: 'Все работы' },
  { id: 'fire', label: 'Файер-шоу' },
  { id: 'smoke', label: 'Дым и эффекты' },
  { id: 'light', label: 'Свет' },
  { id: 'fountain', label: 'Фонтаны' },
  { id: 'cinderella', label: 'Золушка' },
  { id: 'bubbles', label: 'Пузыри' }
];

export const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio().then(data => {
      setPortfolioItems(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.type === activeFilter);

  return (
    <div className="py-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Портфолио
          </motion.h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id 
                  ? 'bg-brand-neon text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : 'bg-brand-dark-card text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-gray-400">Загрузка...</div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="relative group rounded-xl overflow-hidden aspect-[4/3] cursor-pointer bg-brand-dark-card"
              >
                <img 
                  src={`http://localhost:8000${item.image}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549444498-8ec1f4a9b2b2?auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
