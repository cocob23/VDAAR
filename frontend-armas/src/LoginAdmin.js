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

  const styles = {
    container: {
      maxWidth: 400,
      margin: '150px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: 16,
      padding: 40,
      border: '2px solid rgba(74, 124, 89, 0.4)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      fontFamily: '"Roboto Mono", monospace'
    },
    title: {
      color: '#4a7c59',
      fontWeight: 800,
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 20,
      textShadow: '0 0 10px rgba(74, 124, 89, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontFamily: '"Roboto Mono", monospace'
    },
    input: {
      background: 'rgba(15, 15, 15, 0.9)',
      border: '2px solid rgba(74, 124, 89, 0.4)',
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: 16,
      color: '#e0e0e0',
      fontFamily: '"Roboto Mono", monospace',
      transition: 'all 0.3s ease'
    },
    button: {
      background: 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)',
      color: '#fff',
      border: '2px solid #4a7c59',
      borderRadius: 8,
      padding: '14px 24px',
      fontSize: 16,
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: '"Roboto Mono", monospace',
      transition: 'all 0.3s ease',
      boxShadow: '0 0 15px rgba(74, 124, 89, 0.4)',
      marginTop: 10
    },
    error: {
      color: '#ff4444',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 600,
      fontFamily: '"Roboto Mono", monospace'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.title}>🎯 Login Admin</h2>
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
      <button 
        type="submit" 
        disabled={loading}
        style={styles.button}
      >
        {loading ? '⏳ Ingresando...' : '🔐 Ingresar'}
      </button>
      {error && <p style={styles.error}>❌ {error}</p>}
    </form>
  );
}

export default LoginAdmin;
