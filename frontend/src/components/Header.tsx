import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Услуги', path: '/services' },
    { name: 'Портфолио', path: '/portfolio' },
    { name: 'О нас', path: '/about' },
    { name: 'Отзывы', path: '/reviews' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] py-2' 
          : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo with Glow Effect */}
          <NavLink to="/" className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-brand-orange/20 blur-2xl rounded-full group-hover:bg-brand-gold/40 transition-colors duration-500" />
            <img 
              src="/media/logo.png" 
              alt="ShowFusion" 
              className={`relative object-contain transition-all duration-500 ${scrolled ? 'h-14 md:h-16' : 'h-16 md:h-24'} drop-shadow-[0_0_15px_rgba(255,107,0,0.3)] group-hover:scale-105`}
            />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-4">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `relative px-3 py-2 text-xs lg:text-sm font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
                    isActive ? 'text-brand-neon' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-neon shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <div className="ml-4 lg:ml-8">
              <a href="tel:+79991234567" className="btn-primary text-xs lg:text-sm py-2.5 px-6 inline-flex items-center gap-2 group animate-[pulse_2s_infinite] hover:animate-none">
                <span className="relative z-10 tracking-wide uppercase font-bold">Заказать шоу</span>
              </a>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative p-2 text-gray-300 hover:text-white transition-colors z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 md:hidden bg-[#0B0F19]/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl"
          >
            <div className="px-4 pt-4 pb-8 space-y-2 flex flex-col items-center">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `w-full text-center py-4 text-base font-bold uppercase tracking-widest transition-all ${
                      isActive ? 'text-brand-neon bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-6 w-full px-4">
                <a href="tel:+79991234567" className="btn-primary block text-center py-4 text-lg w-full tracking-widest">
                  ЗАКАЗАТЬ ШОУ
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
