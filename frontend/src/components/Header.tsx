import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Услуги', path: '/services' },
    { name: 'Портфолио', path: '/portfolio' },
    { name: 'О нас', path: '/about' },
    { name: 'Отзывы', path: '/reviews' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <img src="/media/logo.png" alt="ShowFusion" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-sm font-semibold uppercase tracking-wider transition-colors hover:text-brand-gold ${isActive ? 'text-brand-neon' : 'text-gray-300'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <a href="tel:+79991234567" className="btn-primary text-sm py-2 px-6">
              Заказать шоу
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark-card border-b border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-brand-neon bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4">
              <a href="tel:+79991234567" className="btn-primary block text-center py-3 w-full">
                Заказать шоу
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
