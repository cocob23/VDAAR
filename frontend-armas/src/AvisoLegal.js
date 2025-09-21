import React, { useEffect, useState } from 'react';

function AvisoLegal() {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/avisoLegal.txt')
      .then(res => res.text())
      .then(setTexto)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      maxWidth: 900,
      margin: '110px auto 40px auto',
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: 16,
      padding: 32,
      border: '2px solid rgba(74, 124, 89, 0.4)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      fontFamily: '"Roboto Mono", monospace'
    }}>
      <h2 style={{
        color: '#4a7c59',
        fontWeight: 800,
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 24,
        textShadow: '0 0 10px rgba(74, 124, 89, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: '"Roboto Mono", monospace'
      }}>
        ⚖️ Aviso Legal
      </h2>
      <div style={{
        background: 'rgba(15, 15, 15, 0.9)',
        padding: 24,
        borderRadius: 12,
        marginBottom: 24,
        maxHeight: 500,
        overflowY: 'auto',
        fontSize: 14,
        border: '1px solid rgba(74, 124, 89, 0.3)',
        color: '#e0e0e0',
        fontFamily: '"Roboto Mono", monospace'
      }}>
        {loading ? 
          <p style={{color: '#4a7c59', textAlign: 'center'}}>⏳ Cargando...</p> : 
          <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#c0c0c0'}}>{texto}</pre>
        }
      </div>
    </div>
  );
}

export default AvisoLegal;
