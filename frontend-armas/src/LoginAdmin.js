import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Autenticación con Supabase Auth (email/password)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setError('Credenciales incorrectas');
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Login Admin</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default LoginAdmin;
