import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const FILTROS_INICIALES = {
  tipo_arma: '',
  marca: '',
  calibre: '',
  estado_arma: '',
  empadronamiento: '',
  precio_orden: '', // 'asc' o 'desc'
  busqueda: '',
};


function IndexArmas() {
  const [armas, setArmas] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- ESTILOS CSS-IN-JS ---
  const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: 0, paddingTop: 96 },
  titulo: { color: '#ffc107', fontWeight: 700, fontSize: 32, textAlign: 'center', margin: '32px 0 24px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222' },
    filtros: { background: '#2d3a4a', borderRadius: 12, padding: 18, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24, boxShadow: '0 2px 8px #0002' },
    input: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120 },
    select: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120 },
    btnBorrar: { background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', marginLeft: 8 },
    grid: { display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'flex-start' },
    card: arma => ({
      border: arma.destacado ? '3px solid #ffc107' : '1.5px solid #222',
      borderRadius: 14,
      background: '#22303c',
      color: '#fff',
      padding: 0,
      width: 300,
      boxShadow: arma.destacado ? '0 0 16px #ffc10755' : '0 2px 8px #0002',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 8
    }),
    destacado: { position: 'absolute', top: 0, left: 0, background: '#ffc107', color: '#222', fontWeight: 700, padding: '4px 16px 4px 10px', borderRadius: '0 0 12px 0', fontSize: 15, letterSpacing: 1, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 },
    img: { width: '100%', height: 180, objectFit: 'cover', borderRadius: '12px 12px 0 0', borderBottom: '1.5px solid #222', background: '#fff' },
    nombre: { fontWeight: 700, fontSize: 20, margin: '12px 0 2px 0', color: '#ffc107', textAlign: 'center' },
    precio: { fontWeight: 700, fontSize: 20, color: '#ffc107', margin: '8px 0 0 0' },
    btn: { background: '#009e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', margin: '10px 8px 10px 0', fontSize: 15 },
    btnDetalles: { background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 },
    chip: color => ({ display: 'inline-block', background: color, color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600, margin: '0 4px 4px 0' }),
    vendido: { marginTop: 8, fontWeight: 'bold', color: 'red', fontSize: 18, textAlign: 'center' },
    contacto: { marginTop: 8, fontSize: 14, background: '#fff2', borderRadius: 8, padding: 8 },
    detalles: { fontSize: 13, background: '#fff1', borderRadius: 8, padding: 8, marginTop: 8 }
  };

  useEffect(() => {
    fetchArmas();
    // eslint-disable-next-line
  }, [filtros]);

  const fetchArmas = async () => {
    setLoading(true);
    let query = supabase
      .from('armas')
      .select('*')
      .in('estado_publicacion', ['PUBLICADA_SIN_CONTACTO', 'PUBLICADA_CON_CONTACTO', 'VENDIDA']);
    if (filtros.tipo_arma) query = query.eq('tipo_arma', filtros.tipo_arma);
    if (filtros.marca) query = query.ilike('marca', `%${filtros.marca}%`);
    if (filtros.calibre) query = query.ilike('calibre', `%${filtros.calibre}%`);
    if (filtros.estado_arma) query = query.eq('estado_arma', filtros.estado_arma);
    if (filtros.empadronamiento) query = query.eq('empadronamiento', filtros.empadronamiento);
    if (filtros.busqueda) {
      query = query.or(`nombre.ilike.%${filtros.busqueda}%,modelo.ilike.%${filtros.busqueda}%`);
    }
    if (filtros.precio_orden) {
      query = query.order('precio_venta', { ascending: filtros.precio_orden === 'asc' });
    } else {
      query = query.order('fecha_creacion', { ascending: false });
    }
    const { data, error } = await query;
    if (error) setError(error.message);
    else setArmas(data);
    setLoading(false);
  };

  const handleFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(f => ({ ...f, [name]: value }));
  };

  // --- FUNCIONES AUXILIARES PARA CHIPS ---
  const chipColor = tipo => {
    switch(tipo) {
      case 'Fusil': return '#d32f2f';
      case 'Revolver': return '#c2185b';
      case 'Pistola': return '#1976d2';
      case 'Carabina': return '#388e3c';
      case 'Escopeta': return '#ffa000';
      case 'Mira telescopica': return '#7b1fa2';
      default: return '#607d8b';
    }
  };
  const estadoColor = estado => estado === 'Nueva' ? '#009e3c' : '#fbc02d';

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Armas Disponibles</h2>
      <div style={styles.filtros}>
        <input name="busqueda" placeholder="Buscar por nombre o modelo" value={filtros.busqueda} onChange={handleFiltro} style={styles.input} />
        <input name="marca" placeholder="Marca" value={filtros.marca} onChange={handleFiltro} style={styles.input} />
        <input name="calibre" placeholder="Calibre" value={filtros.calibre} onChange={handleFiltro} style={styles.input} />
        <select name="tipo_arma" value={filtros.tipo_arma} onChange={handleFiltro} style={styles.select}>
          <option value="">Tipo de arma</option>
          <option value="Pistola">Pistola</option>
          <option value="Revolver">Revolver</option>
          <option value="Fusil">Fusil</option>
          <option value="Carabina">Carabina</option>
          <option value="Escopeta">Escopeta</option>
          <option value="Mira telescopica">Mira telescopica</option>
          <option value="Otro">Otro</option>
        </select>
        <select name="estado_arma" value={filtros.estado_arma} onChange={handleFiltro} style={styles.select}>
          <option value="">Estado</option>
          <option value="Nueva">Nueva</option>
          <option value="Usada">Usada</option>
        </select>
        <select name="empadronamiento" value={filtros.empadronamiento} onChange={handleFiltro} style={styles.select}>
          <option value="">Empadronamiento</option>
          <option value="Reempadronada">Reempadronada</option>
          <option value="En tramite ANMAC">En tramite ANMAC</option>
          <option value="Tenencia Vigente">Tenencia Vigente</option>
          <option value="Tenencia Vencida">Tenencia Vencida</option>
          <option value="En venta NUEVA">En venta NUEVA</option>
        </select>
        <select name="precio_orden" value={filtros.precio_orden} onChange={handleFiltro} style={styles.select}>
          <option value="">Ordenar por</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
        <button type="button" onClick={() => setFiltros(FILTROS_INICIALES)} style={styles.btnBorrar}>Borrar filtros</button>
      </div>
      {loading && <p>Cargando armas...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div style={styles.grid}>
        {armas.map(arma => (
          <div key={arma.id} style={styles.card(arma)}>
            {arma.destacado && (
              <div style={styles.destacado}>★ DESTACADO</div>
            )}
            {arma.fotos && arma.fotos.length > 0 && (
              <img src={arma.fotos[0]} alt="foto" style={styles.img} />
            )}
            <div style={{padding: '0 16px 10px 16px'}}>
              <div style={styles.nombre}>{arma.nombre}</div>
              <div style={{marginBottom: 6}}>
                <span style={styles.chip(chipColor(arma.tipo_arma))}>{arma.tipo_arma}</span>
                <span style={styles.chip('#1976d2')}>{arma.calibre}</span>
                <span style={styles.chip(estadoColor(arma.estado_arma))}>{arma.estado_arma}</span>
              </div>
              <div style={styles.precio}>{arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta} {arma.moneda === 'USD' ? 'Dólares' : 'Pesos AR'}</div>
              <div style={{margin: '2px 0 6px 0', color: '#90caf9', fontWeight: 600}}>{arma.ciudad && arma.provincia ? `${arma.ciudad}, ${arma.provincia}` : ''}</div>
              <div style={{fontSize: 14, color: '#fff', marginBottom: 6}}>{arma.comentarios}</div>
              {arma.estado_publicacion === 'VENDIDA' && (
                <div style={styles.vendido}>VENDIDO</div>
              )}
              {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' && (
                <div style={styles.contacto}>
                  <b>CONTACTAR</b><br/>
                  {arma.nombre}<br/>
                  {arma.telefono}<br/>
                  {arma.email}<br/>
                  {arma.ciudad}, {arma.provincia}, {arma.pais}
                </div>
              )}
              {arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO' && (
                <div style={{...styles.contacto, color:'#ffc107'}}>Contacto visible tras pago</div>
              )}
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <button style={styles.btn}>CONTACTAR</button>
                <button style={styles.btnDetalles}>VER DETALLES</button>
              </div>
              <details style={styles.detalles}>
                <summary>Ver más</summary>
                <div>
                  <b>N° Serie:</b> {arma.numero_serie}<br/>
                  <b>Empadronamiento:</b> {arma.empadronamiento}<br/>
                  {arma.fotos && arma.fotos.length > 1 && (
                    <div style={{display:'flex',gap:4,marginTop:4}}>
                      {arma.fotos.slice(1).map((url,i) => <img key={i} src={url} alt="foto" width={60} style={{borderRadius:6}} />)}
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndexArmas;
