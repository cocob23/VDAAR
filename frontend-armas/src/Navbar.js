import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Navbar.css';

// Estilos globales para fondo y fuente
if (typeof document !== 'undefined') {
  document.body.style.background = '#e6e0d8'; // neutral warm gray
  document.body.style.fontFamily = 'Inter, Segoe UI, Roboto, Arial, Helvetica, sans-serif';
  document.body.style.margin = 0;
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 700 : false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [search, setSearch] = useState('');
  const links = [
    { to: '/', label: 'INICIO' },
    { to: '/publicar', label: 'PUBLICAR' },
    { to: '/aviso-legal', label: 'AVISO LEGAL' },
    { to: '/contacto', label: 'GUÍA' }
  ];

  useEffect(() => {
    let unsub = null;
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (_e) {
        // Ignorar errores de red para no romper la UI
      }
      try {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
        unsub = listener?.subscription?.unsubscribe || null;
      } catch (_e) {
        unsub = null;
      }
    };
    init();
    const onResize = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 700 : false);
    if (typeof window !== 'undefined') window.addEventListener('resize', onResize);
    return () => {
      try { unsub && unsub(); } catch (_e) {}
      if (typeof window !== 'undefined') window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass });
    if (error) setLoginMsg(error.message);
    else {
      setShowLogin(false);
      setLoginEmail('');
      setLoginPass('');
    }
  };

  const handleForgot = async () => {
    if (!loginEmail) { setLoginMsg('Ingresá tu email para recuperar.'); return; }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, { redirectTo: window.location.origin + '/reset-password' });
      if (error) setLoginMsg(error.message); else setLoginMsg('Te enviamos un email para recuperar tu contraseña.');
    } catch (_e) {
      setLoginMsg('No se pudo enviar el email. Intentá más tarde.');
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate('/?q=' + encodeURIComponent(q)); else navigate('/');
  };

  const spacerHeight = 64 + (isMobile ? 0 : 44);
  return (
    <>
    <nav className="navbar-root">
      {/* Top bar */}
      <div className="navbar-top">
        <div className="navbar-container top-row">
          <div className="navbar-title" onClick={() => navigate('/')} style={{cursor:'pointer'}}>
            <span>VENTADEARMAS</span>
            <span className="navbar-flags">🇦🇷</span>
          </div>
          <form className="navbar-search" onSubmit={submitSearch}>
            <input placeholder="Buscar por nombre o marca" value={search} onChange={e=>setSearch(e.target.value)} />
          </form>
          <div className="navbar-icons">
            {!user ? (
              <button className="icon-btn" onClick={() => setShowLogin(v=>!v)} aria-label="Ingresar">
                INICIAR SESIÓN
              </button>
            ) : (
              <button className="icon-btn" onClick={() => navigate('/perfil')}>PERFIL</button>
            )}
            <button className="icon-btn" onClick={() => setShowDrawer(true)} aria-label="Menú" style={{display: isMobile ? 'inline-flex' : 'none'}}>
              ☰
            </button>
          </div>
        </div>
      </div>
      {/* Categories row (desktop) */}
      <div className="navbar-cats" style={{display: isMobile ? 'none' : 'block'}}>
        <div className="navbar-container cats-row">
          <div className="navbar-links">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={'navbar-link' + (location.pathname === link.to ? ' active' : '')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Login dropdown */}
      {showLogin && !user && !isMobile && (
        <div className="login-dropdown" onMouseLeave={() => setShowLogin(false)}>
          <h4>Ingresar</h4>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={loginPass} onChange={e=>setLoginPass(e.target.value)} required />
            <button type="submit" className="submit">INGRESAR</button>
          </form>
          {loginMsg && <div style={{color:'#e6c86b', marginTop:6, fontWeight:700}}>{loginMsg}</div>}
          <div className="links">
            <span onClick={handleForgot}>¿Olvidaste tu contraseña?</span>
            <br/>
            <Link to="/login" onClick={()=>setShowLogin(false)}>Crear cuenta</Link>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div className={"drawer-backdrop" + (showDrawer ? ' show' : '')} onClick={()=>setShowDrawer(false)}></div>
      <div className={"drawer" + (showDrawer ? ' open' : '')}>
        <div className="drawer-header">
          <div className="drawer-title">Menú</div>
          <button className="icon-btn" onClick={()=>setShowDrawer(false)}>✕</button>
        </div>
        {!user ? (
          <>
            <button className="menu-link" onClick={()=>{ setShowDrawer(false); navigate('/login'); }}>Iniciar sesión</button>
            <Link className="menu-link" to="/login" onClick={()=>setShowDrawer(false)}>Crear cuenta</Link>
          </>
        ) : (
          <button className="menu-link" onClick={()=>{ setShowDrawer(false); navigate('/perfil'); }}>Perfil</button>
        )}
        {links.map(link => (
          <Link key={link.to} to={link.to} className={'menu-link' + (location.pathname === link.to ? ' active' : '')} onClick={()=>setShowDrawer(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
    <div style={{height: spacerHeight}}></div>
    </>
  );
}

export default Navbar;
