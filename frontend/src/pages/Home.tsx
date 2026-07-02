import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Sparkles, Music, Wind, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServices } from '../api';

const IconMap: any = {
  Flame: <Flame size={24} className="text-brand-orange" />,
  Wind: <Wind size={24} className="text-brand-neon" />,
  Star: <Star size={24} className="text-brand-gold" />,
  Music: <Music size={24} className="text-pink-400" />,
  Sun: <Sun size={24} className="text-yellow-400" />,
  Sparkles: <Sparkles size={24} className="text-purple-400" />,
};

export const Home = () => {
  const heroTitle = 'Сделайте ваш праздник незабываемым';
  const heroDesc = 'Профессиональное файер-шоу, тяжелый дым и спецэффекты для свадеб, корпоративов и вечеринок в Рязани.';
  
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    getServices().then(setServices).catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/70 z-10" />
          <img 
            src="/media/full_cal9H7F1.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-[scale-in_20s_ease-out_forwards]"
            onError={(e) => {
               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80';
            }}
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              {heroTitle}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto whitespace-pre-line">
              {heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contacts" className="btn-primary w-full sm:w-auto text-lg">
                Забронировать дату
              </Link>
              <Link to="/portfolio" className="btn-outline w-full sm:w-auto text-lg">
                Смотреть работы
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
        >
          <div className="w-8 h-12 rounded-full border-2 border-brand-neon flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-brand-neon rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-brand-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши Услуги</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <Link to="/services">
                  <div className="h-56 bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-card via-brand-dark-card/50 to-transparent z-10" />
                    <img 
                      src={service.image.startsWith('/media') ? service.image : `http://localhost:8000${service.image}`} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549444498-8ec1f4a9b2b2?auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-4 right-4 z-20 bg-brand-dark/80 p-2 rounded-full backdrop-blur-sm">
                      {IconMap[service.icon_name] || <Star size={24} className="text-brand-gold" />}
                    </div>
                  </div>
                  <div className="p-6 relative z-20 -mt-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-gold transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="text-brand-neon font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Подробнее <span>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/services" className="btn-outline inline-block">
              Все услуги
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-brand-dark to-brand-dark-card relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-neon/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Готовы обсудить ваше шоу?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Оставьте заявку, и мы свяжемся с вами для подбора идеальной программы и расчета стоимости.
          </p>
          <Link to="/contacts" className="btn-primary text-lg px-12 py-4">
            Получить консультацию
          </Link>
        </div>
      </section>
    </div>
  );
};
