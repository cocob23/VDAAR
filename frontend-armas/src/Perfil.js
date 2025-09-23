import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import RequireAuth from './RequireAuth';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const handleChangePassword = async () => {
    const nueva = window.prompt('Nueva contraseña:');
    if (!nueva || nueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: nueva });
    if (error) setMensaje(error.message);
    else setMensaje('Contraseña cambiada correctamente.');
  };

  const handleForgotPassword = async () => {
    const email = window.prompt('Ingresa tu email para recuperar la contraseña:');
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
    if (error) setMensaje(error.message);
    else setMensaje('Te enviamos un email para recuperar tu contraseña.');
  };

  useEffect(() => {
    const fetchUserAndArmas = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const { data, error } = await supabase
        .from('armas')
        .select('*')
        .eq('email', session.user.email)
        .order('fecha_creacion', { ascending: false });
      if (error) setError(error.message);
      else setPublicaciones(data);
      setLoading(false);
    };
    fetchUserAndArmas();
  }, []);

  const borrarArma = async (id) => {
    await supabase.from('armas').delete().eq('id', id);
    setPublicaciones(pubs => pubs.filter(p => p.id !== id));
  };

  const marcarVendida = async (id) => {
    await supabase.from('armas').update({ estado_publicacion: 'VENDIDA' }).eq('id', id);
    setPublicaciones(pubs => pubs.map(p => p.id === id ? { ...p, estado_publicacion: 'VENDIDA' } : p));
  };

  if (loading) return <div style={{textAlign:'center',marginTop:80,fontSize:20}}>Cargando publicaciones...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:80}}>{error}</div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <RequireAuth>
  <div style={{maxWidth:900,margin:'80px auto 40px auto'}}>
        <h2 style={{color:'#223a5e',textAlign:'center'}}>Mi Perfil</h2>
        <div style={{textAlign:'center',marginBottom:24}}>
          <b>{user?.email}</b>
          <div style={{marginTop:8}}>
            <button onClick={handleChangePassword} style={{background:'#ffc107',color:'#223a5e',border:'none',borderRadius:8,padding:'6px 18px',fontWeight:700,fontSize:15,cursor:'pointer',marginRight:12}}>Cambiar contraseña</button>
            <span style={{color:'#007bff',textDecoration:'underline',cursor:'pointer',fontSize:15}} onClick={handleForgotPassword}>
              ¿Has olvidado tu contraseña?
            </span>
          </div>
          {mensaje && <div style={{color:'#c00',marginTop:8,fontWeight:600}}>{mensaje}</div>}
        </div>
        <div style={{textAlign:'center',marginBottom:32}}>
          <button onClick={handleLogout} style={{background:'#c00',color:'#fff',border:'none',borderRadius:8,padding:'8px 22px',fontWeight:700,fontSize:16,cursor:'pointer'}}>Cerrar sesión</button>
        </div>
        {publicaciones.length === 0 && <p>No tienes publicaciones.</p>}
        {publicaciones.map(arma => (
          <div key={arma.id} style={{border:'1px solid #ccc',padding:16,marginBottom:16}}>
            <b>{arma.nombre}</b> - {arma.marca} {arma.modelo} <br/>
            Estado: <b>{arma.estado_publicacion}</b><br/>
            <small>Creada: {new Date(arma.fecha_creacion).toLocaleString()}</small><br/>
            <button onClick={() => borrarArma(arma.id)} style={{marginRight:8}}>Borrar</button>
            <button onClick={() => marcarVendida(arma.id)} disabled={arma.estado_publicacion==='VENDIDA'}>Marcar como vendida</button>
            <details>
              <summary>Ver detalles</summary>
              <pre style={{whiteSpace:'pre-wrap',fontSize:13}}>{JSON.stringify(arma, null, 2)}</pre>
              {arma.fotos && arma.fotos.length > 0 && (
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
                  {arma.fotos.map((url,i) => <img key={i} src={url} alt="foto" width={80} />)}
                </div>
              )}
            </details>
          </div>
        ))}
      </div>
    </RequireAuth>
  );
}

export default Perfil;
