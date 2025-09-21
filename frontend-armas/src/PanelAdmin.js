import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function PanelAdmin() {
  const [armas, setArmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);

  // Estilos militares para el panel admin
  const styles = {
    container: {
      maxWidth: '95%',
      margin: '40px auto',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f1a0f 100%)',
      minHeight: '100vh',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid rgba(74, 124, 89, 0.3)',
      fontFamily: '"Roboto Mono", monospace'
    },
    title: {
      color: '#4a7c59',
      textShadow: '0 0 10px rgba(74, 124, 89, 0.5)',
      fontWeight: 800,
      fontSize: 32,
      textAlign: 'center',
      margin: '0 0 30px 0',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: '"Roboto Mono", monospace'
    },
    weaponCard: {
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 100%)',
      border: '2px solid rgba(74, 124, 89, 0.4)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      color: '#e0e0e0'
    },
    weaponHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    weaponTitle: {
      color: '#4a7c59',
      fontWeight: 800,
      fontSize: '24px',
      marginBottom: '8px',
      textShadow: '0 0 8px rgba(74, 124, 89, 0.4)',
      fontFamily: '"Roboto Mono", monospace'
    },
    weaponInfo: {
      flex: 1,
      minWidth: '300px'
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: status === 'PUBLICADA_CON_CONTACTO' ? '#4a7c59' : 
                 status === 'PUBLICADA_SIN_CONTACTO' ? '#7a6f32' :
                 status === 'VENDIDA' ? '#8b0000' : '#555',
      color: '#fff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      fontFamily: '"Roboto Mono", monospace'
    }),
    actionButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '16px'
    },
    button: (disabled = false, variant = 'default') => ({
      background: disabled ? '#333' : 
                 variant === 'danger' ? 'linear-gradient(135deg, #8b0000 0%, #660000 100%)' :
                 variant === 'success' ? 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)' :
                 variant === 'warning' ? 'linear-gradient(135deg, #7a6f32 0%, #5d5424 100%)' :
                 'linear-gradient(135deg, #555 0%, #333 100%)',
      color: disabled ? '#666' : '#fff',
      border: `2px solid ${disabled ? '#333' : 
                          variant === 'danger' ? '#8b0000' :
                          variant === 'success' ? '#4a7c59' :
                          variant === 'warning' ? '#7a6f32' : '#555'}`,
      borderRadius: '6px',
      padding: '10px 16px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: '"Roboto Mono", monospace'
    }),
    detailsSection: {
      marginTop: '20px',
      padding: '20px',
      background: 'rgba(15, 15, 15, 0.8)',
      borderRadius: '8px',
      border: '1px solid rgba(74, 124, 89, 0.2)'
    },
    jsonContainer: {
      background: '#0f0f0f',
      border: '1px solid rgba(74, 124, 89, 0.3)',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '16px',
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#e0e0e0',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    dataGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    dataItem: {
      background: 'rgba(74, 124, 89, 0.1)',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid rgba(74, 124, 89, 0.3)'
    },
    dataLabel: {
      color: '#4a7c59',
      fontWeight: 'bold',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '4px',
      fontFamily: '"Roboto Mono", monospace'
    },
    dataValue: {
      color: '#c0c0c0',
      fontSize: '13px',
      fontFamily: '"Roboto Mono", monospace'
    },
    photosContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '16px'
    },
    photoThumbnail: {
      width: '150px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '2px solid rgba(74, 124, 89, 0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
    },
    expandedImageOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    },
    expandedImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      borderRadius: '12px',
      border: '3px solid #4a7c59',
      boxShadow: '0 0 50px rgba(74, 124, 89, 0.5)'
    },
    loading: {
      textAlign: 'center',
      color: '#4a7c59',
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: '"Roboto Mono", monospace'
    },
    error: {
      color: '#ff4444',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: '"Roboto Mono", monospace'
    },
    noWeapons: {
      textAlign: 'center',
      color: '#999',
      fontSize: '16px',
      fontFamily: '"Roboto Mono", monospace'
    }
  };

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

  const formatearDatos = (arma) => {
    const datos = { ...arma };
    delete datos.fotos; // Las mostramos por separado
    
    return Object.entries(datos).map(([key, value]) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value ? String(value) : 'N/A'
    }));
  };

  if (loading) return <div style={styles.container}><p style={styles.loading}>Cargando armas...</p></div>;
  if (error) return <div style={styles.container}><p style={styles.error}>{error}</p></div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Panel de Administración Militar</h2>
      {armas.length === 0 && <p style={styles.noWeapons}>No hay armas registradas en el sistema.</p>}
      
      {armas.map(arma => (
        <div key={arma.id} style={styles.weaponCard}>
          <div style={styles.weaponHeader}>
            <div style={styles.weaponInfo}>
              <div style={styles.weaponTitle}>
                🔫 {arma.nombre || arma.marca} {arma.modelo}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={styles.statusBadge(arma.estado_publicacion)}>
                  {arma.estado_publicacion}
                </span>
              </div>
              <div style={{ color: '#999', fontSize: '14px', fontFamily: '"Roboto Mono", monospace' }}>
                📅 Creada: {new Date(arma.fecha_creacion).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={styles.actionButtons}>
            <button 
              onClick={() => cambiarEstado(arma.id, 'RECHAZADA')} 
              disabled={arma.estado_publicacion === 'RECHAZADA'}
              style={styles.button(arma.estado_publicacion === 'RECHAZADA', 'danger')}
            >
              ❌ Rechazar
            </button>
            <button 
              onClick={() => cambiarEstado(arma.id, 'PUBLICADA_SIN_CONTACTO')} 
              disabled={arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO'}
              style={styles.button(arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO', 'warning')}
            >
              📋 Pub. Sin Contacto
            </button>
            <button 
              onClick={() => cambiarEstado(arma.id, 'PUBLICADA_CON_CONTACTO')} 
              disabled={arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO'}
              style={styles.button(arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO', 'success')}
            >
              ✅ Pub. Con Contacto
            </button>
            <button 
              onClick={() => marcarVendida(arma.id)} 
              disabled={arma.estado_publicacion === 'VENDIDA'}
              style={styles.button(arma.estado_publicacion === 'VENDIDA', 'danger')}
            >
              💰 Marcar Vendida
            </button>
          </div>

          {/* Datos organizados */}
          <details style={styles.detailsSection}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              color: '#4a7c59', 
              fontSize: '16px',
              marginBottom: '16px',
              fontFamily: '"Roboto Mono", monospace'
            }}>
              📊 Ver Detalles Completos
            </summary>
            
            {/* Grid de datos organizados */}
            <div style={styles.dataGrid}>
              {formatearDatos(arma).map(({ key, label, value }) => (
                <div key={key} style={styles.dataItem}>
                  <div style={styles.dataLabel}>{label}:</div>
                  <div style={styles.dataValue}>{value}</div>
                </div>
              ))}
            </div>

            {/* JSON completo para referencia técnica */}
            <details>
              <summary style={{ 
                cursor: 'pointer', 
                color: '#4a7c59', 
                fontWeight: 'bold',
                marginBottom: '12px',
                fontFamily: '"Roboto Mono", monospace'
              }}>
                🔧 JSON Técnico
              </summary>
              <div style={styles.jsonContainer}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                  {JSON.stringify(arma, null, 2)}
                </pre>
              </div>
            </details>

            {/* Fotos ampliadas */}
            {arma.fotos && arma.fotos.length > 0 && (
              <div>
                <div style={{ 
                  color: '#4a7c59', 
                  fontWeight: 'bold', 
                  marginBottom: '12px',
                  fontSize: '16px',
                  fontFamily: '"Roboto Mono", monospace'
                }}>
                  📷 Imágenes ({arma.fotos.length})
                </div>
                <div style={styles.photosContainer}>
                  {arma.fotos.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt={`Foto ${i + 1}`} 
                      style={styles.photoThumbnail}
                      onClick={() => setExpandedImage(url)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.borderColor = '#4a7c59';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.borderColor = 'rgba(74, 124, 89, 0.5)';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </details>
        </div>
      ))}

      {/* Modal para imagen expandida */}
      {expandedImage && (
        <div 
          style={styles.expandedImageOverlay}
          onClick={() => setExpandedImage(null)}
        >
          <img 
            src={expandedImage} 
            alt="Imagen expandida" 
            style={styles.expandedImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;
