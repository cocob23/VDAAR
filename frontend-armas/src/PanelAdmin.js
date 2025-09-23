import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function PanelAdmin() {
  const [modalImg, setModalImg] = useState(null);
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
            {/* Detalles prolijos en tabla */}
            <div style={{overflowX:'auto', margin:'12px 0'}}>
              <table style={{borderCollapse:'collapse', width:'100%', fontSize:14, background:'#f9f9f9'}}>
                <tbody>
                  {Object.entries(arma).filter(([k]) => k !== 'fotos' && k !== 'fotos_documentacion').map(([key, value]) => (
                    <tr key={key}>
                      <td style={{fontWeight:600, color:'#223a5e', padding:'4px 8px', border:'1px solid #eee', minWidth:120}}>{key.replace(/_/g,' ').toUpperCase()}</td>
                      <td style={{padding:'4px 8px', border:'1px solid #eee'}}>{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Fotos del arma */}
            {arma.fotos && arma.fotos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12,
                margin: '12px 0',
                background: '#f7f7f7',
                borderRadius: 10,
                padding: 10,
                boxShadow: '0 2px 8px #0001'
              }}>
                {arma.fotos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`foto arma ${i+1}`}
                    style={{
                      width: '100%',
                      maxWidth: 180,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1.5px solid #ffc107',
                      background: '#fff',
                      boxShadow: '0 1px 4px #0001',
                      cursor: 'pointer'
                    }}
                    onClick={() => setModalImg(url)}
                  />
                ))}
              </div>
            )}
            {/* Documentación (solo admin) */}
            {arma.documentacion && arma.documentacion.length > 0 && (
              <div style={{margin:'12px 0'}}>
                <div style={{fontWeight:600, color:'#223a5e', marginBottom:4}}>Documentación (Credencial y CLU):</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {arma.documentacion.map((url,i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`doc ${i+1}`}
                      style={{width:90, height:70, objectFit:'cover', borderRadius:6, border:'1.5px solid #ffc107', background:'#fff', cursor:'pointer'}}
                      onClick={() => setModalImg(url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </details>
          {/* Modal para agrandar imagen */}
          {modalImg && (
            <div onClick={()=>setModalImg(null)} style={{position:'fixed',zIndex:9999,top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out'}}>
              <img src={modalImg} alt="ampliada" style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:12,boxShadow:'0 4px 32px #000a',background:'#fff'}} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PanelAdmin;
