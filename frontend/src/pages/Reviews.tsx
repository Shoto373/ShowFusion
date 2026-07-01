
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: 'Анна и Максим',
    date: '15.08.2025',
    text: 'Заказывали тяжелый дым на первый танец и холодные фонтаны. Это было просто волшебно! Дым стелился по полу идеальным ровным слоем, а фонтаны в конце танца вызвали шквал аплодисментов. Спасибо команде за профессионализм!',
    rating: 5,
    event: 'Свадьба'
  },
  {
    id: 2,
    author: 'Корпоратив Газпром',
    date: '20.12.2025',
    text: 'Файер-шоу стало отличным завершением нашего новогоднего корпоратива. Ребята отработали на все 100%, очень зрелищно, отличная музыкальная подборка и безопасная работа с пиротехникой.',
    rating: 5,
    event: 'Корпоратив'
  },
  {
    id: 3,
    author: 'Елена',
    date: '05.05.2026',
    text: 'Брали эффект Золушки (лазеры). Очень красиво и необычно, все гости были в восторге. Отдельное спасибо за то, что учли все наши пожелания по цветам лазеров и музыке.',
    rating: 5,
    event: 'День рождения'
  },
  {
    id: 4,
    author: 'Игорь',
    date: '10.06.2026',
    text: 'Дымные пузыри для детского праздника — это нечто! Дети визжали от восторга, когда лопали пузыри, а из них выходил дым. Очень крутая идея, рекомендую!',
    rating: 5,
    event: 'Детский праздник'
  }
];

export const Reviews = () => {
  return (
    <div className="py-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Отзывы наших клиентов
          </motion.h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-dark-card p-8 rounded-2xl border border-gray-800 relative"
            >
              <Quote size={48} className="absolute top-6 right-6 text-gray-800 opacity-50" />
              
              <div className="flex items-center gap-1 mb-4 text-brand-gold">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star key={idx} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-gray-300 text-lg italic mb-6 relative z-10">
                «{review.text}»
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-800 pt-6 mt-auto">
                <div>
                  <h4 className="font-bold text-white">{review.author}</h4>
                  <p className="text-sm text-brand-neon">{review.event}</p>
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
