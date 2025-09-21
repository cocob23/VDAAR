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
    titulo: { 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 800, 
      fontSize: 42, 
      textAlign: 'center', 
      margin: '48px 0 32px 0', 
      letterSpacing: '2px', 
      textTransform: 'uppercase',
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    filtros: {
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: 24,
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 32,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: 'calc(100vw - 80px)',
      minWidth: 'calc(100vw - 80px)',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      justifyContent: 'center',
      marginLeft: 0,
      marginRight: 0
    },
    input: { 
      border: '2px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: 12, 
      padding: '12px 16px', 
      fontSize: 15, 
      minWidth: 140,
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a2e',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    'input:focus': {
      outline: 'none',
      borderColor: '#4facfe',
      boxShadow: '0 0 0 3px rgba(79, 172, 254, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    select: { 
      border: '2px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: 12, 
      padding: '12px 16px', 
      fontSize: 15, 
      minWidth: 140,
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a2e',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer'
    },
    'select:focus': {
      outline: 'none',
      borderColor: '#4facfe',
      boxShadow: '0 0 0 3px rgba(79, 172, 254, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    btnBorrar: { 
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
      color: '#fff', 
      border: 'none', 
      borderRadius: 12, 
      padding: '12px 24px', 
      fontWeight: 600, 
      cursor: 'pointer', 
      marginLeft: 12,
      fontSize: 15,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(238, 90, 36, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden'
    },
    'btnBorrar:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(238, 90, 36, 0.4)'
    },

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
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          color: '#1a1a2e',
          padding: 0,
          width: 320,
          maxWidth: '98vw',
          boxShadow: arma.destacado 
            ? '0 16px 40px rgba(79, 172, 254, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
        };
      }
      // MOBILE: diseño horizontal, foto grande, info alineada, botón destacado
      return {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        color: '#1a1a2e',
        width: '98vw',
        maxWidth: 500,
        minHeight: 140,
        margin: '0 auto 20px auto',
        boxShadow: arma.destacado 
          ? '0 16px 40px rgba(79, 172, 254, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    },
    destacado: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
      color: '#1a1a2e', 
      fontWeight: 800, 
      padding: '8px 20px 8px 16px', 
      borderRadius: '0 0 16px 0', 
      fontSize: 14, 
      letterSpacing: '1px', 
      zIndex: 2, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      textTransform: 'uppercase',
      boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
    },
    img: {
      width: 'calc(100% - 32px)',
      height: 200,
      objectFit: 'contain',
      border: 'none',
      borderRadius: '16px 16px 0 0',
      background: '#fff',
      margin: '16px 16px 0 16px',
      display: 'block',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    imgMobile: {
      width: '38vw',
      height: 'auto',
      aspectRatio: '1.2/1',
      maxWidth: 170,
      minWidth: 110,
      objectFit: 'contain',
      border: 'none',
      borderRadius: 16,
      background: '#fff',
      margin: '12px 0 12px 16px',
      display: 'block',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    nombre: { 
      fontWeight: 700, 
      fontSize: 20, 
      margin: '16px 0 8px 0', 
      color: '#1a1a2e', 
      textAlign: 'center',
      letterSpacing: '0.5px'
    },
    precio: { 
      fontWeight: 800, 
      fontSize: 24, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '8px 0 0 0',
      textAlign: 'center'
    },
    btn: { 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
      color: '#1a1a2e', 
      border: 'none', 
      borderRadius: 12, 
      padding: '12px 24px', 
      fontWeight: 700, 
      cursor: 'pointer', 
      margin: '12px 8px 16px 0', 
      fontSize: 15,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    btnDetalles: { 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: '#fff', 
      border: 'none', 
      borderRadius: 12, 
      padding: '12px 24px', 
      fontWeight: 700, 
      cursor: 'pointer', 
      fontSize: 15,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    chip: color => ({ 
      display: 'inline-block', 
      background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`, 
      color: '#fff', 
      borderRadius: 20, 
      padding: '6px 12px', 
      fontSize: 12, 
      fontWeight: 600, 
      margin: '0 6px 6px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: `0 2px 8px ${color}33`
    }),
    vendido: { 
      marginTop: 12, 
      fontWeight: 800, 
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: 20, 
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    contacto: { 
      marginTop: 12, 
      fontSize: 14, 
      background: 'rgba(255, 255, 255, 0.8)', 
      borderRadius: 12, 
      padding: 12,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#1a1a2e'
    },
    detalles: { 
      fontSize: 13, 
      background: 'rgba(255, 255, 255, 0.6)', 
      borderRadius: 12, 
      padding: 12, 
      marginTop: 8,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#1a1a2e'
    }
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
            <button 
              type="button" 
              onClick={() => setFiltros(FILTROS_INICIALES)} 
              style={styles.btnBorrar}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(238, 90, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 36, 0.3)';
              }}
            >
              Borrar filtros
            </button>
          </div>
          {loading && <p>Cargando armas...</p>}
          {error && <p style={{color:'red'}}>{error}</p>}
          <div style={{...styles.grid, padding:'0 0px'}}>
            {armas.map(arma => (
              <div 
                key={arma.id} 
                style={styles.card(arma)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = arma.destacado 
                    ? '0 20px 50px rgba(79, 172, 254, 0.4), 0 12px 20px rgba(0, 0, 0, 0.15)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = arma.destacado 
                    ? '0 16px 40px rgba(79, 172, 254, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
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
                    color: '#1a1a2e',
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
