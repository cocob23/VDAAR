import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { mockArmas } from './mockData';
import Navbar from './Navbar';

const styles = {
  page: { 
    width: '100vw', 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0f1419 0%, #1a1f28 25%, #252b37 50%, #1a1f28 75%, #0f1419 100%)',
    backgroundAttachment: 'fixed',
    color: '#1f2937', 
    boxSizing: 'border-box', 
    padding: 0, 
    margin: 0, 
    overflowX: 'hidden',
    fontFamily: '"Inter", sans-serif'
  },
  btnVolver: { 
    position: 'fixed', 
    top: 80, 
    left: 20, 
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)', 
    color: '#1f2937', 
    border: '2px solid rgba(255, 215, 0, 0.3)', 
    borderRadius: 12, 
    padding: '12px 20px', 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontSize: 15, 
    zIndex: 1000,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '"Inter", sans-serif',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)'
    }
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1400,
    margin: '140px auto 40px auto',
    gap: 40,
    boxSizing: 'border-box',
    padding: '0 20px',
  },
  mainMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '98vw',
    margin: '120px auto 40px auto',
    gap: 20,
    boxSizing: 'border-box',
    padding: '0 16px',
  },
  imgBox: {
    flex: '0 0 600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    maxWidth: '100%',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  imgBoxMobile: {
    width: '100%',
    minHeight: 280,
    maxWidth: '98vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  img: {
    width: '100%',
    maxWidth: 550,
    height: 400,
    objectFit: 'contain',
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    marginBottom: 16,
    cursor: 'zoom-in',
    transition: 'all 0.3s ease',
    padding: 20,
    boxSizing: 'border-box'
  },
  imgMobile: {
    width: '100%',
    height: 250,
    maxWidth: '100%',
    objectFit: 'contain',
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    marginBottom: 16,
    cursor: 'zoom-in',
    transition: 'all 0.3s ease',
    padding: 16,
    boxSizing: 'border-box'
  },
  galeriaBtns: { 
    display: 'flex', 
    gap: 16, 
    marginTop: 12,
    alignItems: 'center'
  },
  galeriaBtn: { 
    background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)', 
    color: '#1f2937', 
    border: 'none', 
    borderRadius: 12, 
    padding: '12px 18px', 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    minWidth: 50
  },
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    width: '100vw', 
    height: '100vh', 
    background: 'rgba(0,0,0,0.95)', 
    backdropFilter: 'blur(10px)',
    zIndex: 1000, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden', 
    padding: 20, 
    margin: 0 
  },
  modalImg: { 
    maxWidth: 'calc(100vw - 40px)', 
    maxHeight: 'calc(100vh - 120px)', 
    borderRadius: 16, 
    border: '3px solid #ffd700', 
    background: '#f8fafc', 
    boxShadow: '0 0 60px rgba(255, 215, 0, 0.4)', 
    display: 'block', 
    margin: '0 auto',
    objectFit: 'contain'
  },
  infoBox: { 
    flex: 1, 
    minWidth: 320, 
    maxWidth: 600, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 20, 
    alignItems: 'flex-start', 
    marginTop: 0,
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: 32,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  infoBoxMobile: { 
    width: '100%', 
    maxWidth: 600, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 16, 
    alignItems: 'flex-start', 
    marginTop: 0, 
    padding: '24px',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  titulo: { 
    color: '#1f2937', 
    fontWeight: 800, 
    fontSize: 42, 
    marginBottom: 16, 
    letterSpacing: '1px', 
    textAlign: 'left',
    fontFamily: '"Inter", sans-serif',
    lineHeight: 1.2
  },
  tituloMobile: { 
    color: '#1f2937', 
    fontWeight: 800, 
    fontSize: 32, 
    margin: '0 0 16px 0', 
    letterSpacing: '1px', 
    textAlign: 'center', 
    width: '100%',
    fontFamily: '"Inter", sans-serif',
    lineHeight: 1.2
  },
  info: { 
    fontSize: 18, 
    marginBottom: 12, 
    textAlign: 'left', 
    color: '#374151',
    fontFamily: '"Inter", sans-serif',
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  infoMobile: { 
    fontSize: 16, 
    marginBottom: 10, 
    textAlign: 'left', 
    color: '#374151',
    fontFamily: '"Inter", sans-serif',
    lineHeight: 1.4,
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  contacto: { 
    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)', 
    borderRadius: 16, 
    padding: 20, 
    marginTop: 20, 
    color: '#1f2937', 
    fontSize: 16, 
    width: '100%',
    border: '2px solid rgba(5, 150, 105, 0.2)',
    fontFamily: '"Inter", sans-serif',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.1)'
  }
};



function DetalleArma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [arma, setArma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchArma = async () => {
      try {
        const { data, error } = await supabase.from('armas').select('*').eq('id', id).single();
        if (error) throw error;
        setArma(data);
      } catch (error) {
        console.log('Using mock data due to connection error:', error.message);
        const mockArma = mockArmas.find(arma => arma.id === parseInt(id));
        setArma(mockArma || null);
      }
      setLoading(false);
    };
    fetchArma();
  }, [id]);

  if (loading) return <div style={{color:'#223a5e',textAlign:'center',marginTop:80}}>Cargando...</div>;
  if (!arma) return <div style={{color:'red',textAlign:'center',marginTop:80}}>No se encontró el arma.</div>;

  const fotos = arma.fotos || [];
  const mostrarAnterior = () => setFotoIdx(idx => (idx > 0 ? idx - 1 : fotos.length - 1));
  const mostrarSiguiente = () => setFotoIdx(idx => (idx < fotos.length - 1 ? idx + 1 : 0));

  // Detectar si es móvil
  const isMobile = window.innerWidth <= 700;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <button style={styles.btnVolver} onClick={() => navigate(-1)}>Volver</button>
        <div style={isMobile ? styles.mainMobile : styles.main}>
          {/* Título primero en mobile */}
          {isMobile && (
            <div style={styles.tituloMobile}>{arma.marca} {arma.modelo}</div>
          )}
          <div style={isMobile ? styles.imgBoxMobile : styles.imgBox}>
            {fotos.length > 0 ? (
              <img
                src={fotos[fotoIdx]}
                alt={`foto${fotoIdx+1}`}
                style={isMobile ? styles.imgMobile : styles.img}
                onClick={() => setModalOpen(true)}
                title="Click para agrandar"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1TDIyNSAxNzVMMTc1IDIyNUwxMjUgMTc1TDE3NSAxMjVaIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE4Ij5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
                }}
              />
            ) : (
              <div style={{
                ...isMobile ? styles.imgMobile : styles.img,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#6b7280',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
              }}>
                📷 Sin imagen disponible
              </div>
            )}
            {fotos.length > 1 && (
              <div style={styles.galeriaBtns}>
                <button style={styles.galeriaBtn} onClick={mostrarAnterior}>◀</button>
                <span style={{
                  color: '#1f2937', 
                  fontWeight: 700, 
                  fontSize: 18, 
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 8,
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  {fotoIdx+1} / {fotos.length}
                </span>
                <button style={styles.galeriaBtn} onClick={mostrarSiguiente}>▶</button>
              </div>
            )}
          </div>
          <div style={isMobile ? styles.infoBoxMobile : styles.infoBox}>
            {!isMobile && (
              <div style={styles.titulo}>{arma.marca} {arma.modelo}</div>
            )}
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>🔫 Tipo:</span> {arma.tipo_arma}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>🎯 Calibre:</span> {arma.calibre}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>⚙️ Estado:</span> {arma.estado_arma}
            </div>
            <div style={{
              ...isMobile ? styles.infoMobile : styles.info,
              fontSize: isMobile ? 20 : 24,
              fontWeight: 800,
              color: '#059669',
              marginTop: 8,
              marginBottom: 16,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              borderRadius: 12,
              border: '2px solid rgba(5, 150, 105, 0.2)'
            }}>
              💰 <span style={{fontWeight: 600}}>Precio:</span> {arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta?.toLocaleString()} {arma.moneda === 'USD' ? 'USD' : 'ARS'}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>📍 Ubicación:</span> {arma.ciudad}, {arma.provincia}, {arma.pais}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>💬 Comentarios:</span> {arma.comentarios}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>📋 Empadronamiento:</span> {arma.empadronamiento}
            </div>
            <div style={isMobile ? styles.infoMobile : styles.info}>
              <span style={{fontWeight: 600}}>🔢 N° Serie:</span> {arma.numero_serie}
            </div>
            {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' ? (
              <div style={styles.contacto}>
                <div style={{fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 8}}>
                  📞 Información de Contacto
                </div>
                <div style={{lineHeight: 1.6}}>
                  <strong>Vendedor:</strong> {arma.nombre || arma.marca + ' ' + arma.modelo}<br/>
                  <strong>Teléfono:</strong> {arma.telefono}<br/>
                  <strong>Email:</strong> {arma.email}<br/>
                </div>
              </div>
            ) : arma.estado_publicacion === 'VENDIDA' ? (
              <div style={{
                ...styles.contacto, 
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                border: '2px solid rgba(220, 38, 38, 0.3)',
                color: '#991b1b',
                textAlign: 'center', 
                fontWeight: 800, 
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                🔴 ARMA VENDIDA
              </div>
            ) : (
              <div style={{
                ...styles.contacto, 
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                color: '#92400e',
                textAlign: 'center',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                🔒 Contacto disponible tras verificación
              </div>
            )}
          </div>
        </div>
        {modalOpen && (
          <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'auto',maxWidth:'100vw',maxHeight:'100vh',padding:0,margin:0}} onClick={e => e.stopPropagation()}>
              <img
                src={fotos[fotoIdx]}
                alt={`foto${fotoIdx+1}`}
                style={styles.modalImg}
              />
              {fotos.length > 0 && (
                <div style={{display:'flex',gap:18,marginTop:12,alignItems:'center',justifyContent:'center'}}>
                  <button style={styles.galeriaBtn} onClick={e => {e.stopPropagation();mostrarAnterior();}}>◀</button>
                  <span style={{
                    color: '#ffd700', 
                    fontWeight: 700, 
                    fontSize: 22,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    {fotoIdx+1} / {fotos.length}
                  </span>
                  <button style={styles.galeriaBtn} onClick={e => {e.stopPropagation();mostrarSiguiente();}}>▶</button>
                </div>
              )}
              <button 
                style={{
                  marginTop: 20,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  color: '#1f2937',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 12,
                  padding: '12px 32px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }} 
                onClick={() => setModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
        {/* Espacio extra al final para mejor visual en móvil y desktop */}
        <div style={{height: 48}}></div>
      </div>
    </>
  );
}

export default DetalleArma;
