import React, { useState } from 'react';
import { supabase } from './supabaseClient';


function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#e6eaf2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
    },
    card: {
      background: '#223a5e',
      border: '2.5px solid #ffc107',
      borderRadius: 16,
      boxShadow: '0 2px 16px #0002',
      padding: 36,
      minWidth: 320,
      maxWidth: 370,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      margin: '0 auto',
    },
    titulo: {
      color: '#ffc107',
      fontWeight: 700,
      fontSize: 28,
      textAlign: 'center',
      margin: '0 0 12px 0',
      letterSpacing: 1,
      textShadow: '1px 1px 2px #222',
      textTransform: 'uppercase',
    },
    input: {
      border: '1px solid #bbb',
      borderRadius: 6,
      padding: '10px 14px',
      fontSize: 16,
      marginBottom: 8,
      width: '100%',
      boxSizing: 'border-box',
      background: '#fff',
      color: '#223a5e',
      fontWeight: 600,
    },
    btn: {
      background: '#556b2f',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      padding: '12px 0',
      fontWeight: 700,
      fontSize: 18,
      marginTop: 8,
      cursor: 'pointer',
      letterSpacing: 1,
      boxShadow: '0 2px 8px #0002',
      transition: 'background 0.2s',
    },
    error: {
      color: '#ffc107',
      background: 'rgba(255,193,7,0.12)',
      borderRadius: 6,
      padding: '8px 0',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 15,
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.titulo}>Panel Admin</div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

export default LoginAdmin;
