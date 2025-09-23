import React, { useEffect, useMemo, useState } from 'react';
import legalUrl from './avisoLegal.txt';

function AvisoLegal() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [texto, setTexto] = useState('');

  const sources = useMemo(() => {
    const absolute = typeof window !== 'undefined' ? new URL(legalUrl, window.location.origin).toString() : legalUrl;
    return [absolute, '/avisoLegal.txt'];
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      for (const src of sources) {
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(src, { signal: controller.signal });
          clearTimeout(id);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const txt = await res.text();
          if (!cancelled) {
            setTexto(txt);
            setLoading(false);
          }
          return;
        } catch (_) {
          // try next source
        }
      }
      if (!cancelled) {
        setError('No se pudo cargar el Aviso Legal. Intentá más tarde.');
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [sources]);

  return (
    <div style={{maxWidth:900,margin:'110px auto 40px auto', padding: '0 16px'}}>
      <h2 style={{marginBottom:12}}>Aviso Legal</h2>
      <div style={{background:'#ffffff',padding:0,borderRadius:8,marginBottom:24,overflow:'hidden',fontSize:14,border:'1px solid #ddd', boxShadow:'0 2px 8px #0001'}}>
        {loading && !error && <div style={{padding:18}}>Cargando...</div>}
        {!loading && !error && (
          <pre style={{
            margin:0,
            padding: '18px 20px',
            background: '#fff',
            color: '#222',
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6
          }}>{texto}</pre>
        )}
        {error && (
          <div style={{padding:18}}>
            <div style={{color:'red', marginBottom:8}}>{error}</div>
            <a href={sources[0]} target="_blank" rel="noreferrer">Abrir el Aviso Legal en una pestaña nueva</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvisoLegal;
