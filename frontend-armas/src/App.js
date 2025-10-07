
import './App.css';
import FormularioArma from './FormularioArma';
import RequireAuth from './RequireAuth';
import LoginRegistro from './LoginRegistro';
import Listado from './Listado';
import Navbar from './Navbar';
import AvisoLegal from './AvisoLegal';
import LoginAdmin from './LoginAdmin';
import PanelAdmin from './PanelAdmin';
import DetalleArma from './DetalleArma';
import ResetPassword from './ResetPassword';
import Perfil from './Perfil';
import Guia from './Guia';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";


function TrackPageViews() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-379M3MFEGY', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  return null;
}

function App() {
  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { supabase } = await import('./supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        setAdminAutenticado(!!session);
      } catch (_e) {
        // Ignorar errores de red; no bloquear la UI
      } finally {
        setCargandoAuth(false);
      }
    };
    checkSession();
  }, []);

  return (
    <Router>
      <div className="App">
        <TrackPageViews />
        <Navbar />
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={
            cargandoAuth ? <p>Cargando...</p> :
            adminAutenticado ? <PanelAdmin /> : <LoginAdmin onLogin={() => window.location.reload()} />
          } />
          <Route path="/" element={<Listado />} />
          <Route path="/publicar" element={
            <RequireAuth>
              <FormularioArma />
            </RequireAuth>
          } />
          <Route path="/perfil" element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          } />
          <Route path="/login" element={<LoginRegistro onAuth={() => window.location.replace('/publicar')} />} />
          <Route path="/contacto" element={<Guia />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/arma/:id" element={<DetalleArma />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
