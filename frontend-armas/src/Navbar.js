import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Estilos globales para fondo militar oscuro
if (typeof document !== 'undefined') {
  document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a2a1a 75%, #0a1a0a 100%)';
  document.body.style.minHeight = '100vh';
  document.body.style.fontFamily = '"Roboto Mono", "Courier New", monospace';
  document.body.style.margin = 0;
  document.body.style.backgroundAttachment = 'fixed';
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
