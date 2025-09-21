
import './App.css';
import FormularioArma from './FormularioArma';
import Listado from './Listado';
import Navbar from './Navbar';
import AvisoLegal from './AvisoLegal';
import LoginAdmin from './LoginAdmin';
import PanelAdmin from './PanelAdmin';
import DetalleArma from './DetalleArma';
import Guia from './Guia';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await import('./supabaseClient').then(m => m.supabase.auth.getSession());
      setAdminAutenticado(!!session);
      setCargandoAuth(false);
    };
    checkSession();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/admin" element={
            cargandoAuth ? <p>Cargando...</p> :
            adminAutenticado ? <PanelAdmin /> : <LoginAdmin onLogin={() => window.location.reload()} />
          } />
          <Route path="/" element={<Listado />} />
          <Route path="/publicar" element={<FormularioArma />} />
          <Route path="/contacto" element={<Guia />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/arma/:id" element={<DetalleArma />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
