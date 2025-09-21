import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './Navbar';

const styles = {
  page: { 
    width: '100vw', 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a2a1a 75%, #0a1a0a 100%)', 
    backgroundAttachment: 'fixed',
    color: '#e0e0e0', 
    boxSizing: 'border-box', 
    padding: 0, 
    margin: 0, 
    overflowX: 'hidden',
    fontFamily: '"Roboto Mono", monospace'
  },
  btnVolver: { 
    position: 'absolute', 
    top: 99, 
    left: 10, 
    background: 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)', 
    color: '#fff', 
    border: '2px solid #4a7c59', 
    borderRadius: 8, 
    padding: '8px 16px', 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontSize: 15, 
    zIndex: 10,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: '"Roboto Mono", monospace',
    boxShadow: '0 0 15px rgba(74, 124, 89, 0.4)'
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1300,
    margin: '120px auto 0 auto',
    gap: 48,
    boxSizing: 'border-box',
    padding: '0 16px',
  },
  mainMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '98vw',
    margin: '90px auto 0 auto',
    gap: 12,
    boxSizing: 'border-box',
    padding: '0 2vw',
  },
  imgBox: {
    flex: '0 0 800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
    maxWidth: '100%',
  },
  imgBoxMobile: {
    width: '100%',
    minHeight: 220,
    maxWidth: '98vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 760,
    height: 540,
    objectFit: 'contain',
    border: '2px solid rgba(74, 124, 89, 0.5)',
    borderRadius: 12,
    background: '#1a1a1a',
    marginBottom: 16,
    cursor: 'zoom-in',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
  },
  imgMobile: {
    width: '98vw',
    height: 220,
    maxWidth: '98vw',
    minWidth: '90vw',
    objectFit: 'contain',
    border: '2px solid rgba(74, 124, 89, 0.5)',
    borderRadius: 12,
    background: '#1a1a1a',
    marginBottom: 12,
    cursor: 'zoom-in',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
  },
  galeriaBtns: { display: 'flex', gap: 12, marginTop: 8 },
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    width: '100vw', 
    height: '100vh', 
    background: 'rgba(0,0,0,0.9)', 
    zIndex: 1000, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden', 
    padding: 0, 
    margin: 0 
  },
  modalImg: { 
    maxWidth: '98vw', 
    maxHeight: '92vh', 
    borderRadius: 16, 
    border: '4px solid #4a7c59', 
    background: '#1a1a1a', 
    boxShadow: '0 0 50px rgba(74, 124, 89, 0.5)', 
    display: 'block', 
    margin: '0 auto' 
  },
  galeriaBtn: { 
    background: 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)', 
    color: '#fff', 
    border: '2px solid #4a7c59', 
    borderRadius: 8, 
    padding: '8px 18px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: '"Roboto Mono", monospace',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 10px rgba(74, 124, 89, 0.4)'
  },
  infoBox: { 
    flex: 1, 
    minWidth: 320, 
    maxWidth: 600, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 18, 
    alignItems: 'flex-start', 
    marginTop: 24,
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(20, 30, 20, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: 24,
    border: '2px solid rgba(74, 124, 89, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
  },
  infoBoxMobile: { 
    width: '100%', 
    maxWidth: 600, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 14, 
    alignItems: 'flex-start', 
    marginTop: 10, 
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(20, 30, 20, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    border: '2px solid rgba(74, 124, 89, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
  },
  titulo: { 
    color: '#4a7c59', 
    fontWeight: 800, 
    fontSize: 38, 
    marginBottom: 8, 
    letterSpacing: 2, 
    textShadow: '0 0 10px rgba(74, 124, 89, 0.5)', 
    textAlign: 'left',
    fontFamily: '"Roboto Mono", monospace',
    textTransform: 'uppercase'
  },
  tituloMobile: { 
    color: '#4a7c59', 
    fontWeight: 800, 
    fontSize: 28, 
    margin: '0 0 8px 0', 
    letterSpacing: 2, 
    textShadow: '0 0 10px rgba(74, 124, 89, 0.5)', 
    textAlign: 'center', 
    width: '100%',
    fontFamily: '"Roboto Mono", monospace',
    textTransform: 'uppercase'
  },
  info: { 
    fontSize: 20, 
    marginBottom: 0, 
    textAlign: 'left', 
    color: '#e0e0e0',
    fontFamily: '"Roboto Mono", monospace'
  },
  infoMobile: { 
    fontSize: 16, 
    marginBottom: 0, 
    textAlign: 'left', 
    color: '#e0e0e0',
    fontFamily: '"Roboto Mono", monospace'
  },
  contacto: { 
    background: 'rgba(74, 124, 89, 0.2)', 
    borderRadius: 10, 
    padding: 16, 
    marginTop: 18, 
    color: '#e0e0e0', 
    fontSize: 18, 
    width: '100%',
    border: '1px solid rgba(74, 124, 89, 0.4)',
    fontFamily: '"Roboto Mono", monospace'
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
      const { data } = await supabase.from('armas').select('*').eq('id', id).single();
      setArma(data);
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
            {fotos.length > 0 && (
              <img
                src={fotos[fotoIdx]}
                alt={`foto${fotoIdx+1}`}
                style={isMobile ? styles.imgMobile : styles.img}
                onClick={() => setModalOpen(true)}
                title="Click para agrandar"
              />
            )}
            {fotos.length > 0 && (
              <div style={styles.galeriaBtns}>
                <button style={styles.galeriaBtn} onClick={mostrarAnterior}>&lt;</button>
                <span style={{color:'#ffc107', fontWeight:700, fontSize:18}}>{fotoIdx+1} / {fotos.length}</span>
                <button style={styles.galeriaBtn} onClick={mostrarSiguiente}>&gt;</button>
              </div>
            )}
          </div>
          <div style={isMobile ? styles.infoBoxMobile : styles.infoBox}>
            {!isMobile && (
              <div style={styles.titulo}>{arma.marca} {arma.modelo}</div>
            )}
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Tipo:</b> {arma.tipo_arma}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Calibre:</b> {arma.calibre}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Estado:</b> {arma.estado_arma}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Precio:</b> {arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta} {arma.moneda === 'USD' ? 'Dólares' : 'Pesos AR'}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Ubicación:</b> {arma.ciudad}, {arma.provincia}, {arma.pais}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Comentarios:</b> {arma.comentarios}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>Empadronamiento:</b> {arma.empadronamiento}</div>
            <div style={isMobile ? styles.infoMobile : styles.info}><b>N° Serie:</b> {arma.numero_serie}</div>
            {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' ? (
              <div style={styles.contacto}>
                <b>Contacto</b><br/>
                {arma.nombre}<br/>
                {arma.telefono}<br/>
                {arma.email}<br/>
              </div>
            ) : arma.estado_publicacion === 'VENDIDA' ? (
              <div style={{...styles.contacto, color:'red', textAlign:'center', fontWeight:700, fontSize:22}}>
                VENDIDA
              </div>
            ) : (
              <div style={{...styles.contacto, color:'#ffc107', textAlign:'center'}}>
                Contacto visible tras pago
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
                  <button style={styles.galeriaBtn} onClick={e => {e.stopPropagation();mostrarAnterior();}}>&lt;</button>
                  <span style={{color:'#ffc107', fontWeight:700, fontSize:22}}>{fotoIdx+1} / {fotos.length}</span>
                  <button style={styles.galeriaBtn} onClick={e => {e.stopPropagation();mostrarSiguiente();}}>&gt;</button>
                </div>
              )}
              <button style={{marginTop:16,background:'#223a5e',color:'#fff',border:'none',borderRadius:8,padding:'8px 28px',fontSize:16,fontWeight:600,cursor:'pointer'}} onClick={() => setModalOpen(false)}>Cerrar</button>
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
