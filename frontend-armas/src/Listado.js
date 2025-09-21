import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

// Usar el mismo azul que la navbar


const FILTROS_INICIALES = {
  tipo_arma: '',
  marca: '',
  calibre: '',
  estado_arma: '',
  empadronamiento: '',
  precio_orden: 'recientes', // valor por defecto
  busqueda: '',
};

function Listado() {
  const [armas, setArmas] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- ESTILOS CSS-IN-JS ---
  const styles = {
    container: { width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 },
  titulo: { color: '#ffc107', fontWeight: 700, fontSize: 36, textAlign: 'center', margin: '48px 0 18px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222', textTransform: 'uppercase' },
    filtros: {
      background: '#223a5e',
      borderRadius: 18,
      padding: 18,
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 24,
      boxShadow: '0 2px 8px #0002',
      width: 'calc(100vw - 64px)',
      minWidth: 'calc(100vw - 64px)',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      justifyContent: 'center',
      marginLeft: 0,
      marginRight: 0
    },
    input: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120 },
    select: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120 },
    btnBorrar: { background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', marginLeft: 8 },

    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      justifyContent: 'flex-start',
      width: 'calc(100vw - 64px)',
      minWidth: 'calc(100vw - 64px)',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 16,
      marginBottom: 32,
      padding: 0,
      boxSizing: 'border-box',
      '@media (max-width: 700px)': {
        flexDirection: 'column',
        gap: 12,
        width: '100vw',
        minWidth: '100vw',
        padding: '0 2vw',
      }
    },
    card: arma => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;
      if (!isMobile) {
        return {
          border: '3px solid #ffc107',
          borderRadius: 14,
          background: '#223a5e',
          color: '#fff',
          padding: 0,
          width: 300,
          maxWidth: '98vw',
          boxShadow: arma.destacado ? '0 0 16px #ffc10755' : '0 2px 8px #0002',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
        };
      }
      // MOBILE: diseño horizontal, foto grande, info alineada, botón destacado
      return {
        border: '3px solid #ffc107',
        borderRadius: 16,
        background: '#223a5e',
        color: '#fff',
        width: '98vw',
        maxWidth: 500,
        minHeight: 120,
        margin: '0 auto 16px auto',
        boxShadow: arma.destacado ? '0 0 16px #ffc10755' : '0 2px 8px #0002',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      };
    },
    destacado: { position: 'absolute', top: 0, left: 0, background: '#ffc107', color: '#222', fontWeight: 700, padding: '4px 16px 4px 10px', borderRadius: '0 0 12px 0', fontSize: 15, letterSpacing: 1, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 },
    img: {
      width: 'calc(100% - 32px)',
      height: 180,
      objectFit: 'contain',
      border: '1px solid #ffc107',
      borderRadius: 0,
      background: '#fff',
      margin: '16px 16px 0 16px',
      display: 'block',
    },
    imgMobile: {
  width: '38vw',
      height: 'auto',
      aspectRatio: '1.2/1',
      maxWidth: 170,
      minWidth: 110,
      objectFit: 'contain',
      border: '2px solid #ffc107',
      borderRadius: 12,
      background: '#fff',
      margin: '0 0 0 8px',
      display: 'block',
      boxShadow: '0 2px 8px #0003',
    },
    nombre: { fontWeight: 700, fontSize: 20, margin: '12px 0 2px 0', color: '#ffc107', textAlign: 'center' },
    precio: { fontWeight: 700, fontSize: 20, color: '#ffc107', margin: '8px 0 0 0' },
    btn: { background: '#009e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', margin: '10px 8px 10px 0', fontSize: 15 },
  btnDetalles: { background: '#556b2f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 },
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
      // Búsqueda insensible a mayúsculas/minúsculas en nombre y marca
      query = query.or(`nombre.ilike.%${filtros.busqueda}%,marca.ilike.%${filtros.busqueda}%,modelo.ilike.%${filtros.busqueda}%`);
    }
    // Lógica de ordenamiento
    if (filtros.precio_orden === 'asc' || filtros.precio_orden === 'desc') {
      query = query.order('precio_venta', { ascending: filtros.precio_orden === 'asc' });
    } else if (filtros.precio_orden === 'recientes' || !filtros.precio_orden) {
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
    <>
      <Navbar />
      <div style={{paddingTop:64, margin:0, width:'100vw', minWidth:'100vw', boxSizing:'border-box'}}>
        <div style={{width:'100vw', minWidth:'100vw', margin:0, padding:0, boxSizing:'border-box'}}>
          <h2 style={styles.titulo}>ARMAS DISPONIBLES</h2>
          <div style={styles.filtros}>
            <input
              name="busqueda"
              placeholder="Buscar por nombre o marca"
              value={filtros.busqueda}
              onChange={handleFiltro}
              style={{
                ...styles.input,
                minWidth: 180,
                maxWidth: 220,
                flex: '1 1 180px',
                marginRight: 12,
                marginLeft: 24
              }}
            />
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
            <select name="precio_orden" value={filtros.precio_orden} onChange={handleFiltro} style={styles.select}>
              <option value="recientes">Más recientes</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
            <button type="button" onClick={() => setFiltros(FILTROS_INICIALES)} style={styles.btnBorrar}>Borrar filtros</button>
          </div>
          {loading && <p>Cargando armas...</p>}
          {error && <p style={{color:'red'}}>{error}</p>}
          <div style={{...styles.grid, padding:'0 0px'}}>
            {armas.map(arma => (
              <div key={arma.id} style={styles.card(arma)}>
                {arma.destacado && (
                  <div style={styles.destacado}>★ DESTACADO</div>
                )}
                {arma.fotos && arma.fotos.length > 0 && (
                  <img src={arma.fotos[0]} alt="foto" style={typeof window !== 'undefined' && window.innerWidth <= 700 ? styles.imgMobile : styles.img} />
                )}
                <div style={{
                  padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? '8px 8px 8px 10px' : '0 16px 10px 16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: typeof window !== 'undefined' && window.innerWidth <= 700 ? 0 : undefined,
                  maxWidth: typeof window !== 'undefined' && window.innerWidth <= 700 ? '100%' : undefined,
                  overflow: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'hidden' : undefined,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: typeof window !== 'undefined' && window.innerWidth <= 700 ? '100%' : undefined,
                  alignItems: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'flex-start' : undefined,
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 15 : 20,
                    margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '0 0 2px 0' : '12px 0 2px 0',
                    color: '#ffc107',
                    textAlign: 'left',
                    letterSpacing: 1,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}>
                    {arma.marca} {arma.modelo}
                  </div>
                  <div style={{
                    marginBottom: typeof window !== 'undefined' && window.innerWidth <= 700 ? 2 : 6,
                    textAlign: 'left',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                  }}>
                    <span style={{...styles.chip(chipColor(arma.tipo_arma)), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.tipo_arma}</span>
                    <span style={{...styles.chip('#1976d2'), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.calibre}</span>
                    <span style={{...styles.chip(estadoColor(arma.estado_arma)), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.estado_arma}</span>
                  </div>
                  <div style={{
                    ...styles.precio,
                    textAlign: 'left',
                    fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 14 : 20,
                    margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0 0 0' : '8px 0 0 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta} {arma.moneda === 'USD' ? 'Dólares' : 'Pesos AR'}</div>
                  <div style={{
                    margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0 2px 0' : '2px 0 6px 0',
                    color: '#90caf9',
                    fontWeight: 600,
                    textAlign: 'left',
                    fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 12 : 14,
                  }}>{arma.ciudad && arma.provincia ? `${arma.ciudad}, ${arma.provincia}` : ''}</div>
                  <div style={{fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, color: '#fff', marginBottom: typeof window !== 'undefined' && window.innerWidth <= 700 ? 2 : 6, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{arma.comentarios}</div>
                  {arma.estado_publicacion === 'VENDIDA' && (
                    <div style={{...styles.vendido, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 13 : 18, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0' : '8px 0 0 0'}}>VENDIDO</div>
                  )}
                  {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' && (
                    <div style={{...styles.contacto, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? 4 : 8, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0' : 8}}>
                      <b>CONTACTAR</b><br/>
                      {arma.nombre}<br/>
                      {arma.telefono}<br/>
                      {arma.email}<br/>
                      {arma.ciudad}, {arma.provincia}, {arma.pais}
                    </div>
                  )}
                  {arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO' && (
                    <div style={{...styles.contacto, color:'#ffc107', fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? 4 : 8, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0' : 8}}>Contacto visible tras pago</div>
                  )}
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: typeof window !== 'undefined' && window.innerWidth <= 700 ? 6 : 10,
                    width: '100%',
                    justifyContent: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'flex-end' : 'flex-start',
                  }}>
                    <button style={{
                      ...styles.btnDetalles,
                      fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 13 : 15,
                      padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? '8px 14px' : '8px 18px',
                      minWidth: 80,
                      margin: 0,
                      borderRadius: 8,
                      fontWeight: 700,
                      background: '#ffc107',
                      color: '#223a5e',
                      border: 'none',
                      boxShadow: typeof window !== 'undefined' && window.innerWidth <= 700 ? '0 2px 8px #0002' : undefined,
                    }} onClick={() => navigate(`/arma/${arma.id}`)}>VER DETALLES</button>
                  </div>
                  {/* Bloque 'Ver más' eliminado por pedido del usuario */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Listado;
