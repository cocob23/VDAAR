import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Estilos globales para fondo y fuente
if (typeof document !== 'undefined') {
  document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  document.body.style.minHeight = '100vh';
  document.body.style.fontFamily = 'Inter, Segoe UI, Roboto, Arial, Helvetica, sans-serif';
  document.body.style.margin = 0;
}

function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'INICIO' },
    { to: '/publicar', label: 'PUBLICAR' },
    { to: '/aviso-legal', label: 'LEGAL' },
    { to: '/contacto', label: 'GUÍA' }
  ];

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        <div className="navbar-title">
          <span>VENTADEARMAS</span>
          <span className="navbar-flags">🇦🇷</span>
        </div>
        <div className="navbar-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={
                'navbar-link' + (location.pathname === link.to ? ' active' : '')
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
