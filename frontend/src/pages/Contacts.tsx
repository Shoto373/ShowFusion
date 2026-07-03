import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { API_URL } from '../api';

export const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event_type: 'Свадьба',
    date: '',
    time_start: '',
    time_end: '',
    comment: '',
    tg_user_id: undefined as number | undefined
  });

  const longEvents = ['Свадьба', 'Корпоратив', 'День рождения', 'Клубная вечеринка', 'Городской праздник', 'Услуга DJ'];
  const isLongEvent = longEvents.includes(formData.event_type);
  
  useEffect(() => {
    if (WebApp.initDataUnsafe?.user) {
      setFormData(prev => ({
        ...prev,
        name: WebApp.initDataUnsafe.user?.first_name || '',
        tg_user_id: WebApp.initDataUnsafe.user?.id
      }));
    }
  }, []);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      let finalTime = formData.time_start;
      if (isLongEvent && formData.time_start && formData.time_end) {
        finalTime = `с ${formData.time_start} до ${formData.time_end}`;
      } else if (!formData.time_start) {
        finalTime = '';
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        event_type: formData.event_type,
        date: formData.date,
        time: finalTime,
        comment: formData.comment,
        tg_user_id: formData.tg_user_id
      };

      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      setStatus('success');
      setFormData({ name: '', phone: '', event_type: 'Свадьба', date: '', time_start: '', time_end: '', comment: '', tg_user_id: formData.tg_user_id });
      
      // Close WebApp if running inside Telegram
      if (WebApp.initDataUnsafe?.user) {
        setTimeout(() => {
          WebApp.close();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="py-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Свяжитесь с нами
          </motion.h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Ждем ваших вопросов!</h2>
            <p className="text-gray-300">
              Мы с радостью ответим на любые вопросы, поможем подобрать идеальное шоу 
              и рассчитаем точную стоимость для вашей площадки.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="text-brand-neon" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Телефон / Telegram</h3>
                  <a href="tel:+79966178089" className="text-gray-400 hover:text-brand-gold transition-colors block">+7 (996) 617-80-89</a>
                  <a 
                    href="https://t.me/ShowFusion_bot" 
                    target="_blank" rel="noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1 block"
                  >
                    Написать в Telegram
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-brand-neon" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <a href="mailto:showfusion62@gmail.com" className="text-gray-400 hover:text-brand-gold transition-colors block">showfusion62@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-neon" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Локация</h3>
                  <p className="text-gray-400">г. Рязань и Рязанская область (возможен выезд)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Оставить заявку</h3>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                <CheckCircle2 size={64} className="text-green-500" />
                <h4 className="text-xl font-semibold">Заявка успешно отправлена!</h4>
                <p className="text-gray-400">Мы свяжемся с вами в ближайшее время.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="btn-outline mt-4"
                >
                  Отправить еще
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Ваше имя *</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Номер телефона *</label>
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Тип мероприятия</label>
                    <select 
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleChange}
                      className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
                    >
                      <optgroup label="Мероприятия (от и до)">
                        <option value="Свадьба">Свадьба</option>
                        <option value="Корпоратив">Корпоратив</option>
                        <option value="День рождения">День рождения</option>
                        <option value="Клубная вечеринка">Клубная вечеринка</option>
                        <option value="Городской праздник">Городской праздник</option>
                        <option value="Услуга DJ">Услуга DJ</option>
                      </optgroup>
                      <optgroup label="Одиночные шоу (время начала)">
                        <option value="Фаер-шоу">Фаер-шоу</option>
                        <option value="Тяжелый дым">Тяжелый дым</option>
                        <option value="Холодные фонтаны">Холодные фонтаны</option>
                        <option value="Лазерное шоу">Лазерное шоу</option>
                        <option value="Другое">Другое</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Дата мероприятия</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
                    />
                  </div>

                  <div className={isLongEvent ? "col-span-1 md:col-span-3 grid grid-cols-2 gap-5" : ""}>
                    <div className={isLongEvent ? "" : "col-span-1"}>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        {isLongEvent ? "Время начала" : "Время проведения"}
                      </label>
                      <input 
                        type="time" 
                        name="time_start"
                        value={formData.time_start}
                        onChange={handleChange}
                        className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
                      />
                    </div>
                    {isLongEvent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Время окончания</label>
                        <input 
                          type="time" 
                          name="time_end"
                          value={formData.time_end}
                          onChange={handleChange}
                          className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Комментарий (какое шоу хотите)</label>
                  <textarea 
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none"
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>Произошла ошибка при отправке. Попробуйте еще раз или напишите нам в WhatsApp.</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <span className="animate-pulse">Отправка...</span>
                  ) : (
                    <>
                      <Send size={18} /> Отправить заявку
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
