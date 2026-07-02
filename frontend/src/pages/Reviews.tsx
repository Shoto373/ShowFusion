import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getReviews } from '../api';

export const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div className="text-center text-gray-400">Загрузка отзывов...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400">Пока нет отзывов</div>
        ) : (
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
                  {[...Array(5 - review.rating)].map((_, idx) => (
                    <Star key={`empty-${idx}`} size={18} fill="currentColor" className="opacity-30" />
                  ))}
                </div>
                
                <p className="text-gray-300 text-lg italic mb-6 relative z-10">
                  «{review.text}»
                </p>
                
                <div className="flex items-center justify-between border-t border-gray-800 pt-6 mt-auto">
                  <div>
                    <h4 className="font-bold text-white">{review.author}</h4>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
