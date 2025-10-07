import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const accessToken = searchParams.get('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!password || password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== password2) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMensaje(error.message);
    else {
      setMensaje('Contraseña actualizada correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (!accessToken) {
    return <div style={{margin:60, textAlign:'center', color:'#c00'}}>Token inválido o expirado.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6eaf2' }}>
      <form onSubmit={handleSubmit} style={{ background: '#223a5e', border: '2.5px solid #ffc107', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 36, minWidth: 320, maxWidth: 370, color: '#fff', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ color: '#ffc107', fontWeight: 700, fontSize: 24, textAlign: 'center', margin: '0 0 12px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222', textTransform: 'uppercase' }}>
          Nueva contraseña
        </div>
  <input type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
  <input type="password" placeholder="Repetir contraseña" value={password2} onChange={e => setPassword2(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
        <button type="submit" disabled={loading} style={{ background: '#556b2f', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 2px 8px #0002' }}>
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
        {mensaje && <div style={{ color: '#ffc107', background: 'rgba(255,193,7,0.12)', borderRadius: 6, padding: '8px 0', textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{mensaje}</div>}
      </form>
    </div>
  );
}
