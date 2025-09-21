import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { mockArmas } from './mockData';
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
  solo_favoritos: false,
};

function Listado() {
  const [armas, setArmas] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  // --- ESTILOS PROFESIONALES PREMIUM ---
  const styles = {
    container: { 
      width: '100vw', 
      maxWidth: '100vw', 
      margin: 0, 
      padding: 0,
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f28 25%, #252b37 50%, #1a1f28 75%, #0f1419 100%)',
      minHeight: '100vh',
      fontFamily: '"Inter", "Roboto", system-ui, sans-serif'
    },
    titulo: { 
      color: '#ffffff',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)',
      fontWeight: 800, 
      fontSize: 46, 
      textAlign: 'center', 
      margin: '48px 0 36px 0', 
      letterSpacing: '2px', 
      textTransform: 'uppercase',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      '::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
        zIndex: -1
      }
    },
    filtros: {
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      padding: 28,
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      width: 'calc(100vw - 80px)',
      minWidth: 'calc(100vw - 80px)',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      marginLeft: 0,
      marginRight: 0
    },
    input: { 
      border: '2px solid rgba(255, 215, 0, 0.3)', 
      borderRadius: 12, 
      padding: '14px 18px', 
      fontSize: 16, 
      minWidth: 160,
      background: 'rgba(0, 0, 0, 0.6)',
      color: '#ffffff',
      fontWeight: 500,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      ':focus': {
        borderColor: '#ffd700',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
        outline: 'none'
      }
    },
    select: { 
      border: '2px solid rgba(255, 215, 0, 0.3)', 
      borderRadius: 12, 
      padding: '14px 18px', 
      fontSize: 16, 
      minWidth: 160,
      background: 'rgba(0, 0, 0, 0.6)',
      color: '#ffffff',
      fontWeight: 500,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: '"Inter", sans-serif',
      cursor: 'pointer',
      ':focus': {
        borderColor: '#ffd700',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
        outline: 'none'
      }
    },
    btnBorrar: { 
      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', 
      color: '#ffffff', 
      border: '2px solid #dc2626', 
      borderRadius: 12, 
      padding: '14px 28px', 
      fontWeight: 700, 
      cursor: 'pointer', 
      marginLeft: 16,
      fontSize: 16,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)'
      }
    },

    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 32,
      justifyContent: 'center',
      width: 'calc(100vw - 80px)',
      minWidth: 'calc(100vw - 80px)',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 24,
      marginBottom: 60,
      padding: '0 20px',
      boxSizing: 'border-box',
      '@media (max-width: 700px)': {
        flexDirection: 'column',
        gap: 20,
        width: '100vw',
        minWidth: '100vw',
        padding: '0 16px',
      }
    },
    card: arma => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;
      const baseStyle = {
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        boxShadow: arma.destacado 
          ? '0 20px 60px rgba(255, 215, 0, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)' 
          : '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: arma.destacado 
          ? '3px solid #ffd700' 
          : '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '"Inter", sans-serif',
        color: '#1f2937'
      };
      
      if (isMobile) {
        return {
          ...baseStyle,
          width: 'calc(100vw - 32px)',
          maxWidth: '480px',
          minHeight: '200px',
          margin: '0 auto 24px auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch'
        };
      }
      
      return {
        ...baseStyle,
        width: '380px',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px'
      };
    },
    destacado: { 
      position: 'absolute', 
      top: 0, 
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)', 
      color: '#1f2937', 
      fontWeight: 800, 
      padding: '12px 0', 
      fontSize: 14, 
      letterSpacing: '2px', 
      zIndex: 10, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 8,
      textTransform: 'uppercase',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
      fontFamily: '"Inter", sans-serif',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
    },
    img: {
      width: '100%',
      height: '240px',
      objectFit: 'contain',
      border: 'none',
      borderRadius: '20px 20px 0 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      marginBottom: 0,
      display: 'block',
      padding: '16px',
      boxSizing: 'border-box'
    },
    imgMobile: {
      width: '140px',
      height: '140px',
      minWidth: '140px',
      objectFit: 'contain',
      border: 'none',
      borderRadius: '20px 0 0 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'block',
      padding: '12px',
      boxSizing: 'border-box'
    },
    nome: { 
      fontWeight: 800, 
      fontSize: 22, 
      margin: '0 0 8px 0', 
      color: '#1f2937', 
      textAlign: 'left',
      letterSpacing: '0.5px',
      fontFamily: '"Inter", sans-serif',
      lineHeight: 1.2
    },
    precio: { 
      fontWeight: 900, 
      fontSize: 28, 
      color: '#059669',
      margin: '12px 0',
      textAlign: 'left',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      '::before': {
        content: '"💰"',
        fontSize: '20px'
      }
    },
    btn: { 
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
      color: '#ffffff', 
      border: 'none', 
      borderRadius: 12, 
      padding: '12px 24px', 
      fontWeight: 700, 
      cursor: 'pointer', 
      margin: '8px 0 0 0', 
      fontSize: 15,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily: '"Inter", sans-serif',
      width: '100%',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(5, 150, 105, 0.4)'
      }
    },
    btnDetalles: { 
      background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)', 
      color: '#1f2937', 
      border: 'none', 
      borderRadius: 12, 
      padding: '14px 28px', 
      fontWeight: 800, 
      cursor: 'pointer', 
      fontSize: 15,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: '"Inter", sans-serif',
      width: '100%',
      marginTop: 8,
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
      }
    },
    chip: color => ({ 
      display: 'inline-block', 
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, 
      color: '#ffffff', 
      borderRadius: 20, 
      padding: '6px 12px', 
      fontSize: 12, 
      fontWeight: 600, 
      margin: '0 6px 6px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: `0 2px 8px ${color}40`,
      fontFamily: '"Inter", sans-serif',
      border: `1px solid ${color}20`
    }),
    vendido: { 
      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      color: '#ffffff',
      fontSize: 16, 
      fontWeight: 800,
      padding: '12px 20px',
      borderRadius: 12,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: '"Inter", sans-serif',
      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
      margin: '12px 0',
      border: '2px solid #fecaca',
      position: 'relative',
      overflow: 'hidden',
      '::before': {
        content: '"🔴"',
        marginRight: '8px'
      }
    },
    contacto: { 
      background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderRadius: 12, 
      padding: 16,
      marginTop: 12,
      border: '2px solid rgba(5, 150, 105, 0.2)',
      color: '#1f2937',
      fontSize: 14,
      fontFamily: '"Inter", sans-serif',
      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.1)',
      position: 'relative',
      '::before': {
        content: '"📞"',
        position: 'absolute',
        top: '12px',
        right: '12px',
        fontSize: '16px'
      }
    },
    detalles: { 
      fontSize: 13, 
      background: 'rgba(0, 0, 0, 0.05)', 
      borderRadius: 12, 
      padding: 12, 
      marginTop: 12,
      border: '1px solid rgba(0, 0, 0, 0.1)',
      color: '#6b7280',
      fontFamily: '"Inter", sans-serif'
    }
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('firearmsFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('firearmsFavorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (armaId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(armaId)) {
        newFavorites.delete(armaId);
      } else {
        newFavorites.add(armaId);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    fetchArmas();
    // eslint-disable-next-line
  }, [filtros, favorites]);

  const fetchArmas = async () => {
    setLoading(true);
    
    // Use mock data for development when Supabase is not available
    try {
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
      if (error) throw error;
      setArmas(data);
    } catch (error) {
      console.log('Using mock data due to connection error:', error.message);
      // Apply filters to mock data
      let filteredData = mockArmas.filter(arma => 
        ['PUBLICADA_SIN_CONTACTO', 'PUBLICADA_CON_CONTACTO', 'VENDIDA'].includes(arma.estado_publicacion)
      );
      
      if (filtros.tipo_arma) filteredData = filteredData.filter(arma => arma.tipo_arma === filtros.tipo_arma);
      if (filtros.marca) filteredData = filteredData.filter(arma => arma.marca.toLowerCase().includes(filtros.marca.toLowerCase()));
      if (filtros.calibre) filteredData = filteredData.filter(arma => arma.calibre.toLowerCase().includes(filtros.calibre.toLowerCase()));
      if (filtros.estado_arma) filteredData = filteredData.filter(arma => arma.estado_arma === filtros.estado_arma);
      if (filtros.empadronamiento) filteredData = filteredData.filter(arma => arma.empadronamiento === filtros.empadronamiento);
      if (filtros.busqueda) {
        const search = filtros.busqueda.toLowerCase();
        filteredData = filteredData.filter(arma => 
          arma.nombre.toLowerCase().includes(search) ||
          arma.marca.toLowerCase().includes(search) ||
          arma.modelo.toLowerCase().includes(search)
        );
      }
      
      // Apply sorting
      if (filtros.precio_orden === 'asc') {
        filteredData.sort((a, b) => a.precio_venta - b.precio_venta);
      } else if (filtros.precio_orden === 'desc') {
        filteredData.sort((a, b) => b.precio_venta - a.precio_venta);
      } else {
        filteredData.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
      }
      
      // Apply favorites filter
      if (filtros.solo_favoritos) {
        filteredData = filteredData.filter(arma => favorites.has(arma.id));
      }
      
      setArmas(filteredData);
      setError('');
    }
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
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 12,
              background: filtros.solo_favoritos ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <input
                type="checkbox"
                checked={filtros.solo_favoritos}
                onChange={(e) => setFiltros(f => ({ ...f, solo_favoritos: e.target.checked }))}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 18 }}>
                {filtros.solo_favoritos ? '❤️' : '🤍'}
              </span>
              Solo Favoritos
              {favorites.size > 0 && (
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '4px 8px',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {favorites.size}
                </span>
              )}
            </label>
          </div>
          {loading && <p>Cargando armas...</p>}
          {error && <p style={{color:'red'}}>{error}</p>}
          <div style={{...styles.grid, padding:'0 20px'}}>
            {armas.map(arma => {
              const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;
              return (
                <div 
                  key={arma.id} 
                  style={styles.card(arma)}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = arma.destacado 
                        ? '0 25px 70px rgba(255, 215, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2)' 
                        : '0 15px 50px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = arma.destacado 
                        ? '0 20px 60px rgba(255, 215, 0, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)' 
                        : '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)';
                    }
                  }}
                >
                  {arma.destacado && (
                    <div style={styles.destacado}>
                      <span>⭐</span>
                      DESTACADO
                    </div>
                  )}
                  
                  <button 
                    style={{
                      position: 'absolute',
                      top: arma.destacado ? 50 : 16,
                      right: 16,
                      background: favorites.has(arma.id) 
                        ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      color: favorites.has(arma.id) ? '#ffffff' : '#6b7280',
                      border: 'none',
                      borderRadius: '50%',
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: 18,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 5,
                      ':hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(arma.id);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    title={favorites.has(arma.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {favorites.has(arma.id) ? '❤️' : '🤍'}
                  </button>
                  
                  {arma.fotos && arma.fotos.length > 0 && (
                    <img 
                      src={arma.fotos[0]} 
                      alt="foto" 
                      style={isMobile ? styles.imgMobile : styles.img}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEwxMDAgMTI1TDc1IDEwMEwxMDAgNzVaIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0Ij5TaW4gZm90bzwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  )}
                  
                  <div style={{
                    padding: isMobile ? '16px' : '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12
                  }}>
                    <div>
                      <div style={{
                        ...styles.nome,
                        fontSize: isMobile ? 18 : 22,
                        marginTop: arma.destacado && !isMobile ? 40 : 0
                      }}>
                        {arma.marca} {arma.modelo}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6,
                        marginBottom: 12
                      }}>
                        <span style={{...styles.chip(chipColor(arma.tipo_arma)), fontSize: isMobile ? 10 : 12}}>
                          {arma.tipo_arma}
                        </span>
                        <span style={{...styles.chip('#3b82f6'), fontSize: isMobile ? 10 : 12}}>
                          {arma.calibre}
                        </span>
                        <span style={{...styles.chip(estadoColor(arma.estado_arma)), fontSize: isMobile ? 10 : 12}}>
                          {arma.estado_arma}
                        </span>
                      </div>
                      
                      <div style={{
                        ...styles.precio,
                        fontSize: isMobile ? 20 : 28
                      }}>
                        {arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta?.toLocaleString()} 
                        <span style={{fontSize: '16px', color: '#6b7280', fontWeight: 500}}>
                          {arma.moneda === 'USD' ? 'USD' : 'ARS'}
                        </span>
                      </div>
                      
                      <div style={{
                        color: '#6b7280',
                        fontSize: isMobile ? 13 : 14,
                        fontWeight: 500,
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        📍 {arma.ciudad && arma.provincia ? `${arma.ciudad}, ${arma.provincia}` : 'Ubicación no especificada'}
                      </div>
                      
                      <div style={{
                        fontSize: isMobile ? 13 : 14, 
                        color: '#4b5563', 
                        lineHeight: 1.5,
                        marginBottom: 12,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {arma.comentarios || 'Sin descripción disponible'}
                      </div>
                    </div>
                    
                    {arma.estado_publicacion === 'VENDIDA' && (
                      <div style={{
                        ...styles.vendido,
                        fontSize: isMobile ? 14 : 16
                      }}>
                        🔴 VENDIDO
                      </div>
                    )}
                    
                    {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' && (
                      <div style={{
                        ...styles.contacto,
                        fontSize: isMobile ? 12 : 14
                      }}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>📞 CONTACTAR VENDEDOR</div>
                        <div style={{fontSize: 12, color: '#6b7280'}}>
                          Tel: {arma.telefono}<br/>
                          Email: {arma.email}
                        </div>
                      </div>
                    )}
                    
                    {arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO' && (
                      <div style={{
                        ...styles.contacto,
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                        border: '2px solid rgba(255, 215, 0, 0.3)',
                        color: '#92400e',
                        textAlign: 'center',
                        fontSize: isMobile ? 12 : 14,
                        fontWeight: 600
                      }}>
                        🔒 Contacto disponible tras verificación
                      </div>
                    )}
                    
                    <button 
                      style={{
                        ...styles.btnDetalles,
                        fontSize: isMobile ? 13 : 15,
                        padding: isMobile ? '12px 20px' : '14px 28px'
                      }} 
                      onClick={() => navigate(`/arma/${arma.id}`)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                      }}
                    >
                      Ver Detalles Completos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Listado;
