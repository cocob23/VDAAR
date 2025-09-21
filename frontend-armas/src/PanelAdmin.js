import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function PanelAdmin() {
  const [armas, setArmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArmas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('armas')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      if (error) setError(error.message);
      else setArmas(data);
      setLoading(false);
    };
    fetchArmas();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    await supabase.from('armas').update({ estado_publicacion: nuevoEstado }).eq('id', id);
    setArmas(armas => armas.map(a => a.id === id ? { ...a, estado_publicacion: nuevoEstado } : a));
  };

  const marcarVendida = async (id) => {
    await supabase.from('armas').update({ estado_publicacion: 'VENDIDA' }).eq('id', id);
    setArmas(armas => armas.map(a => a.id === id ? { ...a, estado_publicacion: 'VENDIDA' } : a));
  };

  if (loading) return <p>Cargando armas...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{maxWidth:900,margin:'40px auto'}}>
      <h2>Panel de Administración</h2>
      {armas.length === 0 && <p>No hay armas registradas.</p>}
      {armas.map(arma => (
        <div key={arma.id} style={{border:'1px solid #ccc',padding:16,marginBottom:16}}>
          <b>{arma.nombre}</b> - {arma.marca} {arma.modelo} <br/>
          Estado: <b>{arma.estado_publicacion}</b><br/>
          <small>Creada: {new Date(arma.fecha_creacion).toLocaleString()}</small><br/>
          <button onClick={() => cambiarEstado(arma.id, 'RECHAZADA')} disabled={arma.estado_publicacion==='RECHAZADA'}>Rechazar</button>
          <button onClick={() => cambiarEstado(arma.id, 'PUBLICADA_SIN_CONTACTO')} disabled={arma.estado_publicacion==='PUBLICADA_SIN_CONTACTO'}>Publicar sin contacto</button>
          <button onClick={() => cambiarEstado(arma.id, 'PUBLICADA_CON_CONTACTO')} disabled={arma.estado_publicacion==='PUBLICADA_CON_CONTACTO'}>Publicar con contacto</button>
          <button onClick={() => marcarVendida(arma.id)} disabled={arma.estado_publicacion==='VENDIDA'}>Marcar como vendida</button>
          <details>
            <summary>Ver detalles</summary>
            <pre style={{whiteSpace:'pre-wrap',fontSize:13}}>{JSON.stringify(arma, null, 2)}</pre>
            {arma.fotos && arma.fotos.length > 0 && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {arma.fotos.map((url,i) => <img key={i} src={url} alt="foto" width={80} />)}
              </div>
            )}
          </details>
        </div>
      ))}
    </div>
  );
}

export default PanelAdmin;
