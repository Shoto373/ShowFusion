
import { motion } from 'framer-motion';
import { Flame, Star, Sparkles, Music, Wind, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const detailedServices = [
  {
    id: 'fire',
    title: 'Файер-шоу',
    description: 'Яркое и динамичное огненное представление, которое станет кульминацией вашего праздника. Включает работу с различным огненным реквизитом, пиротехнические эффекты и мощный финал.',
    features: ['Профессиональные артисты', 'Безопасность', 'Яркий реквизит', 'Пиротехнический финал'],
    image: '/media/full_O2jJTAYn.png',
    icon: <Flame size={32} className="text-brand-orange" />,
    price: 'от 15 000 ₽'
  },
  {
    id: 'smoke',
    title: 'Тяжелый дым, снег, конфетти',
    description: 'Идеальное дополнение для первого танца молодоженов. Густой, стелющийся по полу дым создаст эффект танца в облаках и не испортит фотографии.',
    features: ['Не имеет запаха', 'Не оставляет следов', 'Высокая плотность', 'Генераторы снега и конфетти'],
    image: '/media/full_MXP6QYSs.jpg',
    icon: <Wind size={32} className="text-brand-neon" />,
    price: 'от 6 000 ₽'
  },
  {
    id: 'fountain',
    title: 'Холодные фонтаны',
    description: 'Искрящиеся дорожки из холодных фонтанов — идеальное решение для встречи гостей или торжественного выноса торта. Абсолютно безопасны для помещений.',
    features: ['Высота до 3 метров', 'Длительность до 60 сек', 'Для улицы и зала', 'Огненные сердца'],
    image: '/media/full_R72Wc6YZ.jpg',
    icon: <Star size={32} className="text-brand-gold" />,
    price: 'от 800 ₽/шт'
  },
  {
    id: 'cinderella',
    title: 'Эффект Золушки (лазерное шоу)',
    description: 'Волшебная сказка, создаваемая с помощью лазеров. Персонализированные анимации, имена молодоженов и романтическая атмосфера.',
    features: ['Уникальная анимация', 'Полноцветные лазеры', 'Написание имен/текста', 'Музыкальная синхронизация'],
    image: '/media/fFSTtfHP.jpg',
    icon: <Music size={32} className="text-pink-400" />,
    price: 'от 12 000 ₽'
  },
  {
    id: 'light',
    title: 'Световое оформление',
    description: 'Профессиональная заливка зала светом. Подчеркнем декор, создадим нужную атмосферу и правильный свет для работы фотографа и видеографа.',
    features: ['Заливка зала', 'Подсветка декора', 'Динамический свет', 'Работа художника по свету'],
    image: '/media/full_zc7W9Eki.jpg',
    icon: <Sun size={32} className="text-yellow-400" />,
    price: 'от 10 000 ₽'
  },
  {
    id: 'bubbles',
    title: 'Дымные пузыри',
    description: 'Новинка сезона! Тысячи мыльных пузырей, наполненных дымом, которые эффектно лопаются. Завораживающее зрелище для всех гостей.',
    features: ['Безопасно для детей', 'Вау-эффект', 'Отличные фото', 'Интерактив'],
    image: '/media/full_p4XausNN.jpg',
    icon: <Sparkles size={32} className="text-purple-400" />,
    price: 'от 8 000 ₽'
  },
  {
    id: 'dj',
    title: 'Работа DJ на мероприятиях',
    description: 'Профессиональное музыкальное сопровождение вашего праздника. Индивидуальный плейлист, качественное звуковое оборудование и невероятная энергетика на танцполе.',
    features: ['Профессиональный звук', 'Индивидуальный плейлист', 'Огромная фонотека', 'Работа в любом формате'],
    image: 'https://images.unsplash.com/photo-1571266028243-cb40fce7573a?auto=format&fit=crop&q=80',
    icon: <Music size={32} className="text-brand-neon" />,
    price: 'от 10 000 ₽'
  }
];

export const Services = () => {
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
          {detailedServices.map((service, index) => (
            <motion.div 
              key={service.id}
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
                    src={service.image} 
                    alt={service.title} 
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549444498-8ec1f4a9b2b2?auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4 z-20 bg-brand-dark/80 p-3 rounded-full backdrop-blur-sm">
                    {service.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold">{service.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {service.description}
                </p>
                
                <div className="bg-brand-dark-card p-6 rounded-xl border border-gray-800">
                  <h4 className="font-semibold mb-3 text-brand-neon">Особенности:</h4>
                  <ul className="grid grid-cols-2 gap-3">
                    {service.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                        {feature}
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
