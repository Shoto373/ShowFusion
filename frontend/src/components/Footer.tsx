import { Flame, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const handleScrollToService = (id: string) => {
    if (window.location.pathname === '/services') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-brand-dark-card border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/media/logo.png" alt="ShowFusion" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm">
              Яркое шоу и спецэффекты на свадьбу, корпоратив и любой праздник в Рязани.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Услуги</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services#fire" onClick={() => handleScrollToService('fire')} className="hover:text-brand-gold transition-colors">Файер-шоу</Link></li>
              <li><Link to="/services#smoke" onClick={() => handleScrollToService('smoke')} className="hover:text-brand-gold transition-colors">Тяжелый дым</Link></li>
              <li><Link to="/services#fountain" onClick={() => handleScrollToService('fountain')} className="hover:text-brand-gold transition-colors">Холодные фонтаны</Link></li>
              <li><Link to="/services#cinderella" onClick={() => handleScrollToService('cinderella')} className="hover:text-brand-gold transition-colors">Эффект золушки</Link></li>
              <li><Link to="/services#light" onClick={() => handleScrollToService('light')} className="hover:text-brand-gold transition-colors">Световое оформление</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Контакты</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-neon" /> 
                <a href="tel:+79966178089" className="hover:text-white transition-colors">+7 996 617 80 89</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-neon" /> 
                <a href="mailto:showfusion62@gmail.com" className="hover:text-white transition-colors">showfusion62@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-neon" /> 
                <span>г. Рязань</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Мы в соцсетях</h4>
            <div className="flex gap-4">
              {/* VK icon placeholder using Lucide or similar text */}
              <a href="https://vk.com/originalfireshow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-brand-neon hover:text-brand-dark transition-all font-bold">
                VK
              </a>
              <a href="https://t.me/ShowFusion_bot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-brand-neon hover:text-brand-dark transition-all font-bold">
                TG
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ShowFusion. Все права защищены.</p>
          <p className="mt-2 md:mt-0">Разработано с ❤️ в Рязани</p>
        </div>
      </div>
    </footer>
  );
};
