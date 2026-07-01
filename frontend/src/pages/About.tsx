
import { motion } from 'framer-motion';
import { Star, Shield, ThumbsUp, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-brand-dark min-h-screen">
      {/* Hero */}
      <div className="relative py-32 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-brand-dark/90 z-10" />
        <img 
          src="/media/full_cal9H7F1.jpg" 
          alt="About" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80';
          }}
        />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            О команде <span className="text-brand-orange">ShowFusion</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Мы создаем не просто спецэффекты, мы создаем эмоции, 
            которые останутся с вами навсегда.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-neon">Наша история</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Проект «Original Fire Show» существует на рынке event-услуг уже более 10 лет. 
              Начав с небольших огненных выступлений, мы выросли в полноценное агентство 
              спецэффектов «ShowFusion», которое обеспечивает техническую поддержку и шоу-программы 
              для самых масштабных мероприятий Рязани.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              За нашими плечами сотни свадеб, масштабные корпоративы, городские праздники 
              и дни рождения. Наша главная цель — сделать ваше событие по-настоящему особенным 
              и абсолютно безопасным.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-dark-card p-6 rounded-2xl border border-gray-800 text-center">
              <div className="text-4xl font-bold text-brand-gold mb-2">10+</div>
              <div className="text-gray-400">лет опыта</div>
            </div>
            <div className="bg-brand-dark-card p-6 rounded-2xl border border-gray-800 text-center">
              <div className="text-4xl font-bold text-brand-orange mb-2">1000+</div>
              <div className="text-gray-400">мероприятий</div>
            </div>
            <div className="bg-brand-dark-card p-6 rounded-2xl border border-gray-800 text-center">
              <div className="text-4xl font-bold text-brand-neon mb-2">15</div>
              <div className="text-gray-400">артистов в команде</div>
            </div>
            <div className="bg-brand-dark-card p-6 rounded-2xl border border-gray-800 text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-gray-400">безопасность</div>
            </div>
          </div>
        </div>

        {/* Why choose us */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: <Shield size={40} className="text-brand-neon" />, title: "Безопасность", text: "Используем только сертифицированное оборудование и пиротехнику." },
            { icon: <Users size={40} className="text-brand-gold" />, title: "Профессионализм", text: "Артисты с многолетним стажем работы на площадках любого уровня." },
            { icon: <Star size={40} className="text-brand-orange" />, title: "Индивидуальность", text: "Подбираем шоу-программу под ваш бюджет и пожелания." },
            { icon: <ThumbsUp size={40} className="text-pink-400" />, title: "Надежность", text: "Всегда приезжаем вовремя и выполняем договоренности." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-dark-card p-8 rounded-2xl border border-gray-800 text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
