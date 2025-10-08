import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import RequireAuth from './RequireAuth';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');

  const isMobile = useMemo(() => (typeof window !== 'undefined' ? window.innerWidth <= 700 : false), []);

  const handleChangePassword = async (e) => {
    e?.preventDefault?.();
    setMensaje('');
    if (!currPass) { setMensaje('Ingresá tu contraseña actual.'); return; }
    if (!pass1 || pass1.length < 6) { setMensaje('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (pass1 !== pass2) { setMensaje('Las contraseñas no coinciden.'); return; }
    // Reautenticar con la contraseña actual para validar
    try {
      const email = user?.email;
      if (!email) { setMensaje('No se pudo validar el usuario.'); return; }
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password: currPass });
      if (authErr) { setMensaje('La contraseña actual es incorrecta.'); return; }
    } catch (_) {
      setMensaje('No se pudo validar la contraseña actual.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pass1 });
    if (error) setMensaje(error.message);
    else {
      setMensaje('Contraseña cambiada correctamente.');
      setShowPass(false);
      setCurrPass(''); setPass1(''); setPass2('');
    }
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

  const styles = {
    page: { paddingTop: 72, paddingBottom: 32, width: '100%', boxSizing: 'border-box' },
    wrap: { width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 16px', boxSizing: 'border-box' },
  headerCard: { background: '#2f3d2b', color: '#fff', border: '3px solid #bfa14a', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px #0002', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 16 },
    email: { fontWeight: 800, color: '#ffc107', fontSize: 18, wordBreak: 'break-all' },
    actions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    btn: { background: '#ffc107', color: '#223a5e', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px #0002' },
    msg: { marginTop: 6, color: '#ffc107', background: 'rgba(255,193,7,0.12)', borderRadius: 8, padding: '8px 10px', fontWeight: 600 },
    stats: { display: 'flex', gap: 12, flexWrap: 'wrap', marginLeft: isMobile ? 0 : 'auto' },
    stat: { background: '#223a5e', color: '#fff', borderRadius: 12, padding: '8px 12px', fontWeight: 800 },
    passBox: { marginTop: 8, background: '#223a5e', borderRadius: 12, padding: 12, display: showPass ? 'block' : 'none' },
    input: { border: '1px solid #bbb', borderRadius: 8, padding: '10px 12px', fontSize: 15, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 },
    grid: { display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', width: '100%', marginTop: 18 },
    card: { border: isMobile ? '1px solid #e0e0e0' : '3px solid #bfa14a', borderRadius: 16, background: isMobile ? '#fff' : '#2f3d2b', color: isMobile ? '#233042' : '#fff', width: isMobile ? '100%' : 340, maxWidth: 560, boxShadow: '0 2px 8px #0002', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '10px 12px' : '8px 12px', background: isMobile ? '#fff' : '#223a5e' },
    status: { fontWeight: 800, color: '#ffc107' },
    body: { padding: isMobile ? 12 : 14 },
    title: { fontWeight: 900, color: '#ffc107', fontSize: isMobile ? 16 : 18, marginBottom: 6, letterSpacing: 0.3 },
    subtitle: { fontSize: isMobile ? 13 : 14, opacity: 0.9, marginBottom: 4 },
    price: { fontWeight: 800, color: '#e6c86b', marginTop: 6 },
    actionsRow: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' },
    smallBtn: (kind) => ({ padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, color: kind === 'danger' ? '#fff' : '#223a5e', background: kind === 'danger' ? '#c62828' : '#ffc107', boxShadow: '0 2px 8px #0002' })
  };

  const totales = publicaciones.length;
  const vendidas = publicaciones.filter(p => p.estado_publicacion === 'VENDIDA').length;
  const activas = totales - vendidas;

  return (
    <RequireAuth>
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.headerCard}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems:'flex-start', textAlign:'left'}}>
              <div style={{fontWeight: 900, letterSpacing: 1, textAlign:'left'}}>Mi Perfil</div>
              <div style={styles.email}>{user?.email}</div>
              <div className="pass-actions" style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                <button style={styles.btn} onClick={() => setShowPass(p => !p)}>{showPass ? 'Cancelar' : 'Cambiar contraseña'}</button>
                <button onClick={handleLogout} style={{...styles.btn, background:'#c00', color:'#fff'}}>Cerrar sesión</button>
              </div>
              <div style={styles.passBox}>
                <form onSubmit={handleChangePassword} style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr auto', gap: 10}}>
                  <input type="password" placeholder="Contraseña actual" value={currPass} onChange={e=>setCurrPass(e.target.value)} style={styles.input} />
                  <input type="password" placeholder="Nueva contraseña" value={pass1} onChange={e=>setPass1(e.target.value)} style={styles.input} />
                  <input type="password" placeholder="Repetir contraseña" value={pass2} onChange={e=>setPass2(e.target.value)} style={styles.input} />
                  <button type="submit" style={styles.btn}>Guardar</button>
                </form>
              </div>
              {mensaje && <div style={styles.msg}>{mensaje}</div>}
            </div>
            <div style={styles.stats}>
              <div style={styles.stat}>Total: {totales}</div>
              <div style={styles.stat}>Activas: {activas}</div>
              <div style={styles.stat}>Vendidas: {vendidas}</div>
            </div>
          </div>

          {publicaciones.length === 0 && (
            <div style={{textAlign:'center', marginTop: 20}}>No tenés publicaciones.</div>
          )}

          <div style={styles.grid}>
            {publicaciones.map(arma => (
              <div key={arma.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.status}>{arma.estado_publicacion}</div>
                  <div style={{fontSize: 12, opacity: 0.8}}>Creada: {arma.fecha_creacion ? new Date(arma.fecha_creacion).toLocaleDateString() : '-'}</div>
                </div>
                {arma.fotos && arma.fotos[0] && (
                  <img src={arma.fotos[0]} alt="foto" style={{width:'100%', height: isMobile ? 180 : 200, objectFit:'cover', background:'#fff'}} />
                )}
                <div style={styles.body}>
                  <div style={styles.title}>{arma.nombre || `${arma.marca || ''} ${arma.modelo || ''}`.trim()}</div>
                  <div style={styles.subtitle}>{[arma.marca, arma.modelo, arma.calibre].filter(Boolean).join(' • ')}</div>
                  {arma.precio_venta && (
                    <div style={styles.price}>{arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta} {arma.moneda === 'USD' ? 'Dólares' : 'Pesos AR'}</div>
                  )}
                  {arma.ciudad && arma.provincia && (
                    <div style={{marginTop:6, fontSize: 13, opacity: 0.9}}>{arma.ciudad}, {arma.provincia}</div>
                  )}
                  <div style={styles.actionsRow}>
                    <button style={styles.smallBtn('danger')} onClick={() => borrarArma(arma.id)}>Borrar</button>
                    <button style={styles.smallBtn('ok')} onClick={() => marcarVendida(arma.id)} disabled={arma.estado_publicacion==='VENDIDA'}>
                      {arma.estado_publicacion==='VENDIDA' ? 'Vendida' : 'Marcar vendida'}
                    </button>
                    <button style={styles.smallBtn('ok')} onClick={() => navigate(`/arma/${arma.id}`)}>Ver detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

export default Perfil;
