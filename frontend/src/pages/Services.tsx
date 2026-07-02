import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Sparkles, Music, Wind, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServices } from '../api';

const IconMap: any = {
  Flame: <Flame size={32} className="text-brand-orange" />,
  Wind: <Wind size={32} className="text-brand-neon" />,
  Star: <Star size={32} className="text-brand-gold" />,
  Music: <Music size={32} className="text-pink-400" />,
  Sun: <Sun size={32} className="text-yellow-400" />,
  Sparkles: <Sparkles size={32} className="text-purple-400" />,
};

export const Services = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    getServices().then(setServices).catch(console.error);
  }, []);

  return (
    <div className="py-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Услуги и спецэффекты
          </motion.h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            От камерных свадеб до масштабных городских праздников — мы создадим шоу, 
            которое превзойдет ваши ожидания.
          </p>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div 
              key={service.key}
              id={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={service.image.startsWith('/media') ? service.image : `http://localhost:8000${service.image}`} 
                    alt={service.title} 
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549444498-8ec1f4a9b2b2?auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4 z-20 bg-brand-dark/80 p-3 rounded-full backdrop-blur-sm">
                    {IconMap[service.icon_name] || <Star size={32} className="text-brand-gold" />}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold">{service.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
                
                <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-800">
                  <h4 className="font-semibold mb-3 text-brand-neon">Особенности:</h4>
                  <ul className="grid grid-cols-2 gap-3">
                    {service.features.split(',').map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-bold text-white">{service.price}</div>
                  <Link to="/contacts" className="btn-primary">
                    Заказать
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
