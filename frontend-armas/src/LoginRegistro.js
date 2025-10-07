import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function LoginRegistro({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  // Campos para registro
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleForgotPassword = async () => {
    const emailPrompt = window.prompt('Ingresa tu email para recuperar la contraseña:');
    if (!emailPrompt) return;
    const { error } = await supabase.auth.resetPasswordForEmail(emailPrompt, { redirectTo: window.location.origin + '/login' });
    if (error) setMensaje(error.message);
    else setMensaje('Te enviamos un email para recuperar tu contraseña.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth && onAuth();
    } else {
      // Validaciones
      if (!nombreCompleto) {
        setError('Debes ingresar tu nombre completo.'); setLoading(false); return;
      }
      if (!telefono) {
        setError('Debes ingresar tu número de teléfono.'); setLoading(false); return;
      }
      if (email !== email2) {
        setError('Los emails no coinciden.'); setLoading(false); return;
      }
      if (password !== password2) {
        setError('Las contraseñas no coinciden.'); setLoading(false); return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombreCompleto,
            telefono: telefono
          }
        }
      });
      if (error) setError(error.message);
      else setMensaje('Revisa tu email para confirmar el registro.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6e0d8' }}>
  <form onSubmit={handleSubmit} style={{ background: '#2f3d2b', border: '2.5px solid #bfa14a', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 36, minWidth: 320, maxWidth: 370, color: '#fff', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <div style={{ color: '#e6c86b', fontWeight: 700, fontSize: 28, textAlign: 'center', margin: '0 0 12px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222', textTransform: 'uppercase' }}>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </div>
        {!isLogin && (
          <>
            <input type="text" placeholder="Nombre completo" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="email" placeholder="Repetir email" value={email2} onChange={e => setEmail2(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="password" placeholder="Repetir contraseña" value={password2} onChange={e => setPassword2(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
          </>
        )}
        {isLogin && (
          <>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ border: '1px solid #bbb', borderRadius: 6, padding: '10px 14px', fontSize: 16, width: 270, background: '#fff', color: '#2f3d2b', fontWeight: 600, display: 'block', margin: '0 auto' }} />
            <div style={{display:'flex',justifyContent:'center',margin:'-4px 0 8px 0'}}>
              <span style={{color:'#e6c86b',textDecoration:'underline',cursor:'pointer',fontSize:15}} onClick={handleForgotPassword}>
                ¿Has olvidado tu contraseña?
              </span>
            </div>
          </>
        )}
        <button type="submit" disabled={loading} style={{
          background: 'linear-gradient(90deg, #bfa14a 0%, #e6c86b 100%)',
          color: '#2f3d2b',
          border: '2px solid #bfa14a',
          borderRadius: 8,
          padding: '12px 0',
          fontWeight: 800,
          fontSize: 20,
          marginTop: 8,
          cursor: 'pointer',
          letterSpacing: 1,
          boxShadow: '0 2px 8px #0002',
          width: 220,
          alignSelf: 'center',
          textAlign: 'center',
          transition: 'background 0.2s',
        }}>
          {loading ? (isLogin ? 'Ingresando...' : 'Registrando...') : (isLogin ? 'Ingresar' : 'Registrarse')}
        </button>
  {error && <div style={{ color: '#e6c86b', background: 'rgba(191,161,74,0.12)', borderRadius: 6, padding: '8px 0', textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{error}</div>}
  {mensaje && <div style={{ color: '#e6c86b', background: 'rgba(191,161,74,0.12)', borderRadius: 6, padding: '8px 0', textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{mensaje}</div>}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <span style={{ color: '#e6c86b', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginRegistro;
