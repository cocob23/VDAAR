import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './Navbar';

const styles = {
  page: { 
    width: '100%', 
    minHeight: '100vh', 
    background: '#fff', 
    color: '#333', 
    boxSizing: 'border-box', 
    padding: 0, 
    margin: 0,
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 20px 40px',
    background: '#fff',
    minHeight: 'calc(100vh - 60px)'
  },
  backBtn: {
    position: 'fixed',
    top: 120,
    left: 20,
    backgroundColor: '#223a5e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
    zIndex: 999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: 40,
    marginBottom: 40
  },
  mobileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  mainImage: {
    width: '100%',
    height: 500,
    objectFit: 'contain',
    backgroundColor: '#fff',
    border: '2px solid #ffc107',
    borderRadius: 12,
    marginBottom: 16,
    cursor: 'zoom-in'
  },
  mobileImage: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    backgroundColor: '#fff',
    border: '2px solid #ffc107',
    borderRadius: 12,
    marginBottom: 16,
    cursor: 'zoom-in'
  },
  thumbnails: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  thumbnail: {
    width: 80,
    height: 60,
    objectFit: 'contain',
    backgroundColor: '#fff',
    border: '2px solid #ddd',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  thumbnailActive: {
    borderColor: '#ffc107'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  title: {
    fontFamily: "'Oswald', 'Inter', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#223a5e',
    marginBottom: 16,
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    letterSpacing: '1px',
    textAlign: 'left'
  },
  mobileTitle: {
    fontFamily: "'Oswald', 'Inter', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#223a5e',
    marginBottom: 16,
    textAlign: 'left',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    letterSpacing: '1px'
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5234',
    fontFamily: '"Roboto Condensed", sans-serif'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
    width: 'fit-content',
    minWidth: 'auto',
    position: 'relative',
    top: '-2px'
  },
  statusNew: {
    backgroundColor: '#28a745',
    color: '#fff'
  },
  statusUsed: {
    backgroundColor: '#ffc107',
    color: '#000'
  },
  statusSold: {
    backgroundColor: '#dc3545',
    color: '#fff'
  },
  specs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 20
  },
  mobileSpecs: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 20
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    border: '1px solid #e9ecef'
  },
  specLabel: {
    fontWeight: 600,
    marginBottom: 2,
    color: '#495057',
    fontSize: 12
  },
  specValue: {
    color: '#6c757d',
    fontSize: 14,
    wordWrap: 'break-word'
  },
  contactCard: {
    background: 'linear-gradient(135deg, #223a5e 0%, #2c5282 100%)',
    color: '#fff',
    padding: 24,
    borderRadius: 12,
    marginTop: 20,
    boxShadow: '0 4px 12px rgba(34, 58, 94, 0.3)'
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    color: '#ffc107',
    textAlign: 'center'
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 1.8,
    textAlign: 'center'
  },
  contactButtons: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
    justifyContent: 'center'
  },
  callBtn: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  emailBtn: {
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  description: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    border: '1px solid #e9ecef'
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
    color: '#495057'
  },
  descriptionText: {
    lineHeight: 1.6,
    color: '#6c757d'
  },
  noContactCard: {
    background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
    color: '#000',
    padding: 24,
    borderRadius: 12,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16
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

  if (loading) return (
    <div>
      <Navbar />
      <div style={{textAlign:'center', marginTop: 150, color: '#666'}}>Cargando...</div>
    </div>
  );
  
  if (!arma) return (
    <div>
      <Navbar />
      <div style={{textAlign:'center', marginTop: 150, color: '#dc3545'}}>No se encontró el arma.</div>
    </div>
  );

  const fotos = arma.fotos || [];
  const isMobile = window.innerWidth <= 768;

  const getStatusBadge = () => {
    if (arma.estado_publicacion === 'VENDIDA') {
      return <span style={{...styles.statusBadge, ...styles.statusSold}}>VENDIDO</span>;
    }
    return (
      <span style={{
        ...styles.statusBadge, 
        ...(arma.estado_arma === 'Nueva' ? styles.statusNew : styles.statusUsed)
      }}>
        {arma.estado_arma === 'Nueva' ? 'NUEVO' : 'USADO'}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <html lang="es" />
        <title>{`${arma.marca} ${arma.modelo} | ventadearmas.ar`}</title>
        <meta name="description" content={`Comprar ${arma.marca} ${arma.modelo} ${arma.calibre || ''} en ${arma.ciudad || ''} ${arma.provincia || ''}. Estado: ${arma.estado_arma}.`} />
        <link rel="canonical" href={`https://ventadearmas.ar/arma/${arma.id}`} />
        <meta property="og:title" content={`${arma.marca} ${arma.modelo}`} />
        <meta property="og:description" content={`Precio ${arma.moneda === 'USD' ? 'US$' : '$'}${arma.precio_venta}. ${arma.estado_arma}.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://ventadearmas.ar/arma/${arma.id}`} />
        {(arma.fotos && arma.fotos[0]) && <meta property="og:image" content={arma.fotos[0]} />}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${arma.marca} ${arma.modelo}`,
          description: arma.comentarios || `${arma.marca} ${arma.modelo}`,
          image: arma.fotos && arma.fotos.length ? arma.fotos : undefined,
          offers: {
            '@type': 'Offer',
            priceCurrency: arma.moneda || 'ARS',
            price: String(arma.precio_venta || ''),
            availability: arma.estado_publicacion === 'VENDIDA' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            url: `https://ventadearmas.ar/arma/${arma.id}`
          }
        })}</script>
      </Helmet>
      <Navbar />
      {/* Fondo blanco para cubrir el espacio arriba */}
      <div style={{
        position: 'fixed',
        top: 60,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        zIndex: 1
      }}></div>
      
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Volver
      </button>
      
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={isMobile ? styles.mobileContent : styles.mainContent}>
            
            {/* Sección de imágenes */}
            <div style={styles.imageSection}>
              {/* Título en móvil */}
              {isMobile && (
                <h1 style={styles.mobileTitle}>
                  {arma.marca} {arma.modelo}
                </h1>
              )}

              {fotos.length > 0 && (
                <>
                  <img
                    src={fotos[fotoIdx]}
                    alt={`${arma.marca || 'Arma'} ${arma.modelo || ''} ${arma.calibre || ''}`.trim()}
                    loading="eager"
                    style={isMobile ? styles.mobileImage : styles.mainImage}
                    onClick={() => setModalOpen(true)}
                    title="Click para ampliar"
                  />
                  {fotos.length > 1 && (
                    <div style={styles.thumbnails}>
                      {fotos.map((foto, idx) => (
                        <img
                          key={idx}
                          src={foto}
                          alt={`${arma.marca || 'Arma'} ${arma.modelo || ''} ${arma.calibre || ''} - foto ${idx + 1}`.trim()}
                          loading="lazy"
                          style={{
                            ...styles.thumbnail,
                            ...(idx === fotoIdx ? styles.thumbnailActive : {})
                          }}
                          onClick={() => setFotoIdx(idx)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Información del arma */}
            <div style={styles.infoSection}>
              {/* Título en desktop */}
              {!isMobile && (
                <h1 style={styles.title}>
                  {arma.marca} {arma.modelo}
                </h1>
              )}

              {/* Estado y precio en una línea */}
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap'}}>
                <div style={styles.price}>
                  {arma.moneda === 'USD' ? 'US$' : '$'}{arma.precio_venta}
                  {arma.moneda === 'USD' ? ' Dólares' : ' Pesos AR'}
                </div>
                {getStatusBadge()}
              </div>

              {/* Especificaciones */}
              <div style={isMobile ? styles.mobileSpecs : styles.specs}>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Tipo:</span>
                  <span style={styles.specValue}>{arma.tipo_arma}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Calibre:</span>
                  <span style={styles.specValue}>{arma.calibre}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Marca:</span>
                  <span style={styles.specValue}>{arma.marca}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Modelo:</span>
                  <span style={styles.specValue}>{arma.modelo}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Ubicación:</span>
                  <span style={styles.specValue}>{arma.ciudad}, {arma.provincia}</span>
                </div>
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Empadronamiento:</span>
                  <span style={styles.specValue}>{arma.empadronamiento}</span>
                </div>
              </div>

              {/* Tarjeta de contacto - PROTAGONISTA */}
              {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' && (
                <div style={styles.contactCard}>
                  <div style={styles.contactTitle}>
                    📞 CONTACTAR AL VENDEDOR
                  </div>
                  <div style={styles.contactInfo}>
                    <strong>{arma.nombre}</strong><br/>
                    📍 {arma.ciudad}, {arma.provincia}<br/>
                    📞 {arma.telefono}<br/>
                    ✉️ {arma.email}
                  </div>
                  <div style={styles.contactButtons}>
                    <a href={`tel:${arma.telefono}`} style={styles.callBtn}>
                      📞 Llamar
                    </a>
                    <a href={`mailto:${arma.email}?subject=${arma.marca} ${arma.modelo}`} style={styles.emailBtn}>
                      ✉️ Email
                    </a>
                  </div>
                </div>
              )}

              {arma.estado_publicacion === 'VENDIDA' && (
                <div style={styles.contactCard}>
                  <div style={{...styles.contactTitle, color: '#fff'}}>
                    🚫 ARMA VENDIDA
                  </div>
                  <div style={{...styles.contactInfo, textAlign: 'center', fontSize: 18}}>
                    Esta publicación ya no está disponible
                  </div>
                </div>
              )}

              {arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO' && (
                <div style={styles.noContactCard}>
                  🔒 Información de contacto disponible tras el pago
                </div>
              )}

              {/* Descripción/comentarios */}
              {arma.comentarios && (
                <div style={styles.description}>
                  <div style={styles.descriptionTitle}>
                    Descripción del vendedor:
                  </div>
                  <div style={styles.descriptionText}>
                    {arma.comentarios}
                  </div>
                </div>
              )}

              {/* Información adicional */}
              <div style={styles.description}>
                <div style={styles.descriptionTitle}>
                  Información adicional:
                </div>
                <div style={styles.descriptionText}>
                  <strong>Número de serie:</strong> {arma.numero_serie}<br/>
                  <strong>País:</strong> {arma.pais}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para imagen ampliada */}
        {modalOpen && fotos.length > 0 && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
            onClick={() => setModalOpen(false)}
          >
            <div style={{position: 'relative', maxWidth: '90vw', maxHeight: '90vh'}}>
              <img
                src={fotos[fotoIdx]}
                alt={`${arma.marca} ${arma.modelo}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                style={{
                  position: 'absolute',
                  top: -40,
                  right: 0,
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: 'bold'
                }}
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DetalleArma;
