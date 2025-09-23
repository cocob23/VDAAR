import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLogged(!!session);
      setChecking(false);
      if (!session) {
        setTimeout(() => navigate('/login', { replace: true }), 1000);
      }
    });
  }, [navigate]);

  if (checking) return <div style={{textAlign:'center',marginTop:80,fontSize:20}}>Verificando sesión...</div>;
  if (!isLogged) return <div style={{textAlign:'center',marginTop:80,fontSize:20}}>Debes iniciar sesión para publicar.<br/>Redirigiendo...</div>;
  return children;
}

export default RequireAuth;
