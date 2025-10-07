import React, { useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function RecuperarCodigo() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0); // 0: email, 1: código, 2: nueva pass
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canIrCodigo = useMemo(() => !!email, [email]);
  const canIrNueva = useMemo(() => !!email && !!codigo, [email, codigo]);

  const enviarCodigo = async (e) => {
    e?.preventDefault?.();
    setError('');
    setMensaje('');
    if (!email) { setError('Poné tu email'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setMensaje('Listo. Te mandamos un código a tu email.');
      setPaso(1);
    }
  };

  const verificarCodigo = async (e) => {
    e?.preventDefault?.();
    setError('');
    setMensaje('');
    if (!email) { setError('Falta el email (Paso 1).'); return; }
    if (!codigo) { setError('Ingresá el código.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: codigo,
      type: 'email',
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setMensaje('Código verificado. Podés crear una nueva contraseña.');
      setPaso(2);
    }
  };

  const actualizarPassword = async (e) => {
    e?.preventDefault?.();
    setError('');
    setMensaje('');
    if (!password || password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setMensaje('Contraseña actualizada. Ya podés iniciar sesión.');
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  const Tab = ({ label, active, disabled, onClick }) => (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        padding: '10px 14px',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginRight: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? '#ffc107' : 'transparent',
        color: active ? '#223a5e' : '#ffc107',
        opacity: disabled ? 0.5 : 1,
        border: '2px solid #ffc107',
        borderBottom: active ? 'none' : '2px solid #ffc107',
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f0', overflow: 'hidden', position: 'fixed', inset: 0 }}>
      <div style={{ minWidth: 320, maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Tab label="1) Email" active={paso === 0} disabled={false} onClick={() => setPaso(0)} />
          <Tab label="2) Código" active={paso === 1} disabled={!canIrCodigo} onClick={() => canIrCodigo && setPaso(1)} />
          <Tab label="3) Nueva" active={paso === 2} disabled={!canIrNueva} onClick={() => canIrNueva && setPaso(2)} />
        </div>

  <div style={{ background: '#2c5234', border: '2.5px solid #ffc107', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 28, color: '#fff', width: '100%', boxSizing: 'border-box' }}>
          {paso === 0 && (
            <form onSubmit={enviarCodigo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ color: '#ffc107', fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Recuperar contraseña</div>
              <input type="email" placeholder="Tu email" value={email} onChange={e => setEmail(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
              <button type="submit" disabled={loading} style={{ background: '#ffc107', color: '#333', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 2px 8px #0002' }}>
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ color: '#ffc107', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate(-1)}>Volver</span>
              </div>
            </form>
          )}

          {paso === 1 && (
            <form onSubmit={verificarCodigo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ color: '#ffc107', fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Ingresá el código</div>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
              <input type="text" placeholder="Código que recibiste" value={codigo} onChange={e => setCodigo(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
              <button type="submit" disabled={loading} style={{ background: '#ffc107', color: '#333', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 2px 8px #0002' }}>
                {loading ? 'Verificando...' : 'Verificar código'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ color: '#ffc107', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setPaso(0)}>Volver al paso 1</span>
              </div>
            </form>
          )}

          {paso === 2 && (
            <form onSubmit={actualizarPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ color: '#ffc107', fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Nueva contraseña</div>
              <input type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
              <input type="password" placeholder="Repetir contraseña" value={password2} onChange={e => setPassword2(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#223a5e', fontWeight: 600 }} />
              <button type="submit" disabled={loading} style={{ background: '#556b2f', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 2px 8px #0002' }}>
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ color: '#ffc107', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/login')}>Ir a iniciar sesión</span>
              </div>
            </form>
          )}

          {(error || mensaje) && (
            <div style={{ marginTop: 10, textAlign: 'center', fontWeight: 600, fontSize: 15, borderRadius: 6, padding: '8px 0', background: 'rgba(255,193,7,0.12)', color: error ? '#ffdddd' : '#ffc107' }}>
              {error || mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
