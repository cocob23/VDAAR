import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from './supabaseClient';
import { CALIBRES } from './constants';
import { useLocation, useNavigate } from 'react-router-dom';

            const FILTROS_INICIALES = {
              tipo_arma: '',
              marca: '',
              calibre: '',
              estado_arma: '',
              empadronamiento: '',
              precio_orden: 'recientes',
              busqueda: '',
            };

            function Listado() {
              const [armas, setArmas] = useState([]);
              const [filtros, setFiltros] = useState(FILTROS_INICIALES);
              const [loading, setLoading] = useState(true);
              const [error, setError] = useState('');
              const [showMobileFilters, setShowMobileFilters] = useState(false);
              const navigate = useNavigate();
              const location = useLocation();

              const baseUrl = 'https://ventadearmas.ar';
              const qParam = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('q') || '';
              const tipoParam = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('tipo') || '';
              const pageTitle = (qParam || tipoParam)
                ? `Armas ${tipoParam ? `${tipoParam.toLowerCase()} ` : ''}${qParam ? `- búsqueda: ${qParam}` : ''} | ventadearmas.ar`
                : 'Armas en venta en Argentina | ventadearmas.ar';
              const pageDescription = (qParam || tipoParam)
                ? `Listado de armas ${tipoParam || ''} en Argentina${qParam ? ` que coinciden con "${qParam}"` : ''}. Comprá y vendé en ventadearmas.ar`
                : 'Compra y venta de armas en Argentina. Encontrá pistolas, escopetas, carabinas y más en ventadearmas.ar';
              const canonicalUrl = `${baseUrl}/`;
              const orgJsonLd = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Venta de Armas',
                url: baseUrl,
                logo: `${baseUrl}/favicon.png`
              };
              const siteJsonLd = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'ventadearmas.ar',
                url: baseUrl,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${baseUrl}/?q={search_term_string}`,
                  'query-input': 'required name=search_term_string'
                }
              };

              const styles = {
                container: { width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 },
              titulo: { color: '#e6c86b', fontWeight: 700, fontSize: 28, textAlign: 'center', margin: '16px 0 8px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222' },
                layout: { maxWidth: 1200, margin: '0 auto', padding: '0 16px 24px 16px', display: 'flex', gap: 24, boxSizing: 'border-box' },
                sidebar: { width: 280, background: '#f3f3f0', border: '1px solid #ddd', borderRadius: 8, padding: 16, height: 'fit-content', boxShadow: '0 2px 8px #0002', display: (typeof window !== 'undefined' && window.innerWidth <= 700) ? 'none' : 'block' },
                sTitle: { fontFamily: 'Oswald, Inter, sans-serif', color: '#233042', fontSize: 14, letterSpacing: 1, fontWeight: 900, margin: '12px 0 8px 0' },
                sep: { height: 1, background: '#ddd', margin: '10px 0' },
                input: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120, width: '100%', boxSizing: 'border-box' },
                select: { border: '1px solid #bbb', borderRadius: 6, padding: '7px 10px', fontSize: 15, minWidth: 120, width: '100%' },
                goBtn: { background: '#b68a49', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 800, cursor: 'pointer' },
                btnBorrar: { background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', marginTop: 8 },
                main: { flex: 1 },
                grid: { display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', width: '100%', marginTop: 8, marginBottom: 32 },
                card: arma => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;
                  if (!isMobile) {
                    return { border: '3px solid #bfa14a', borderRadius: 14, background: '#2f3d2b', color: '#fff', padding: 0, width: 300, maxWidth: '98vw', boxShadow: arma.destacado ? '0 0 16px #ffc10755' : '0 2px 8px #0002', position: 'relative', overflow: 'hidden', marginBottom: 8, display: 'flex', flexDirection: 'column' };
                  }
                  return { border: '1px solid #e0e0e0', borderRadius: 14, background: '#ffffff', color: '#233042', width: 'calc(100vw - 32px)', maxWidth: 520, margin: '8px 16px 16px 16px', boxShadow: arma.destacado ? '0 2px 12px #ffc10755' : '0 2px 8px #0002', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', position: 'relative' };
                },
                destacado: { position: 'absolute', top: 0, left: 0, background: '#bfa14a', color: '#222', fontWeight: 700, padding: '4px 16px 4px 10px', borderRadius: '0 0 12px 0', fontSize: 15, letterSpacing: 1, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 },
                img: { width: 'calc(100% - 32px)', height: 180, objectFit: 'contain', border: '1px solid #bfa14a', borderRadius: 0, background: '#fff', margin: '16px 16px 0 16px', display: 'block' },
                imgMobile: { width: '100%', height: 200, objectFit: 'contain', background: '#fff', display: 'block' },
                nombre: { fontWeight: 700, fontSize: 20, margin: '12px 0 2px 0', color: '#e6c86b', textAlign: 'center' },
                precio: { fontWeight: 700, fontSize: 20, color: '#e6c86b', margin: '8px 0 0 0' },
                btnDetalles: { background: 'linear-gradient(90deg, #bfa14a 0%, #e6c86b 100%)', color: '#2f3d2b', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 800, cursor: 'pointer', fontSize: 15 },
                chip: color => ({ display: 'inline-block', background: color, color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600, margin: '0 4px 4px 0' }),
                vendido: { marginTop: 8, fontWeight: 'bold', color: 'red', fontSize: 18, textAlign: 'center' },
                contacto: { marginTop: 8, fontSize: 14, background: '#fff2', borderRadius: 8, padding: 8 },
                detalles: { fontSize: 13, background: '#fff1', borderRadius: 8, padding: 8, marginTop: 8 },
              };

              useEffect(() => {
                fetchArmas();
                // eslint-disable-next-line
              }, [filtros]);

              useEffect(() => {
                const params = new URLSearchParams(location.search);
                const q = (params.get('q') || '').trim();
                const tipo = (params.get('tipo') || '').trim();
                setFiltros(f => {
                  let changed = false;
                  const next = { ...f };
                  if (q && q !== f.busqueda) { next.busqueda = q; changed = true; }
                  if (tipo !== f.tipo_arma) { next.tipo_arma = tipo; changed = true; }
                  return changed ? next : f;
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [location.search]);

              const fetchArmas = async () => {
                setLoading(true);
                try {
                  let query = supabase.from('armas').select('*').in('estado_publicacion', ['PUBLICADA_SIN_CONTACTO', 'PUBLICADA_CON_CONTACTO', 'VENDIDA']);
                  if (filtros.tipo_arma) query = query.eq('tipo_arma', filtros.tipo_arma);
                  if (filtros.marca) query = query.ilike('marca', `%${filtros.marca}%`);
                  if (filtros.calibre) query = query.ilike('calibre', `%${filtros.calibre}%`);
                  if (filtros.estado_arma) query = query.eq('estado_arma', filtros.estado_arma);
                  if (filtros.empadronamiento) query = query.eq('empadronamiento', filtros.empadronamiento);
                  if (filtros.busqueda) query = query.or(`nombre.ilike.%${filtros.busqueda}%,marca.ilike.%${filtros.busqueda}%,modelo.ilike.%${filtros.busqueda}%`);
                  if (filtros.precio_orden === 'asc' || filtros.precio_orden === 'desc') query = query.order('precio_venta', { ascending: filtros.precio_orden === 'asc' });
                  else query = query.order('fecha_creacion', { ascending: false });
                  const { data, error } = await query;
                  if (error) setError(error.message); else setArmas(data || []);
                } catch (_e) {
                  setError('No se pudo cargar las publicaciones. Revisá tu conexión.');
                  setArmas([]);
                } finally {
                  setLoading(false);
                }
              };

              const handleFiltro = (e) => {
                const { name, value } = e.target;
                setFiltros(f => ({ ...f, [name]: value }));
                try {
                  const params = new URLSearchParams(location.search);
                  if (name === 'tipo_arma') {
                    if (value) params.set('tipo', value); else params.delete('tipo');
                  }
                  if (name === 'busqueda') {
                    if (value) params.set('q', value); else params.delete('q');
                  }
                  navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
                } catch (_) {}
              };
              const borrarFiltros = () => {
                setFiltros(FILTROS_INICIALES);
                try {
                  const params = new URLSearchParams(location.search);
                  params.delete('tipo');
                  params.delete('q');
                  navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
                } catch (_) {}
              };

              const chipColor = tipo => {
                switch(tipo) {
                  case 'Fusil': return '#8d6e63';
                  case 'Revolver': return '#795548';
                  case 'Pistola': return '#6b7b4c';
                  case 'Carabina': return '#4e5a3a';
                  case 'Escopeta': return '#9e8e4d';
                  case 'Mira telescopica': return '#5e6a4a';
                  default: return '#4a4f4a';
                }
              };
              const estadoColor = estado => estado === 'Nueva' ? '#6b7b4c' : '#bfa14a';

              return (
                <>
                  <Helmet>
                    <html lang="es" />
                    <title>{pageTitle}</title>
                    <meta name="description" content={pageDescription} />
                    <link rel="canonical" href={canonicalUrl} />
                    <meta property="og:title" content={pageTitle} />
                    <meta property="og:description" content={pageDescription} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={canonicalUrl} />
                    <meta property="og:image" content={`${baseUrl}/favicon.png`} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={pageTitle} />
                    <meta name="twitter:description" content={pageDescription} />
                    <meta name="twitter:image" content={`${baseUrl}/favicon.png`} />
                    <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
                    <script type="application/ld+json">{JSON.stringify(siteJsonLd)}</script>
                  </Helmet>
                  <div style={{paddingTop:64, margin:0, width:'100vw', minWidth:'100vw', boxSizing:'border-box'}}>
                    <div style={{width:'100vw', minWidth:'100vw', margin:0, padding:0, boxSizing:'border-box'}}>
                      <h2 style={styles.titulo}>{armas.length} RESULTADOS</h2>
                      <button style={{ display: (typeof window !== 'undefined' && window.innerWidth <= 700) ? 'block' : 'none', background: '#bfa14a', color: '#233042', border: '1px solid #bfa14a', borderRadius: 12, padding: '14px 16px', margin: '8px 16px', width: 'calc(100% - 32px)', textAlign: 'center', fontWeight: 800, boxShadow: '0 2px 8px #0002', letterSpacing: 0.5 }} onClick={()=>setShowMobileFilters(true)}>Ver/Filtrar opciones</button>
                      <div style={styles.layout}>
                        <aside style={styles.sidebar}>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:18, fontWeight:900, letterSpacing:1, marginBottom:8}}>CATEGORÍAS</div>
                          <div style={{display:'flex', flexDirection:'column', gap:6}}>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="" checked={!filtros.tipo_arma} onChange={handleFiltro}/>
                              <span style={{fontWeight: !filtros.tipo_arma ? 800 : 500}}>Todas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Pistola" checked={filtros.tipo_arma==='Pistola'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Pistola' ? 800 : 500}}>Pistolas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Fusil" checked={filtros.tipo_arma==='Fusil'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Fusil' ? 800 : 500}}>Fusiles</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Escopeta" checked={filtros.tipo_arma==='Escopeta'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Escopeta' ? 800 : 500}}>Escopetas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Carabina" checked={filtros.tipo_arma==='Carabina'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Carabina' ? 800 : 500}}>Carabinas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Revolver" checked={filtros.tipo_arma==='Revolver'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Revolver' ? 800 : 500}}>Revólveres</span>
                            </label>
                          </div>
                          <div style={styles.sep}></div>
                          <div style={styles.sTitle}>FILTRAR POR PALABRA CLAVE</div>
                          <div style={{display:'flex', gap:8}}>
                            <input name="busqueda" placeholder="buscar marca o modelo" value={filtros.busqueda} onChange={handleFiltro} style={{...styles.input, flex:1}} />
                            <button style={styles.goBtn} onClick={()=>setFiltros(f=>({...f}))}>BUSCAR</button>
                          </div>
                          <div style={styles.sep}></div>
                          <div style={styles.sTitle}>MARCA</div>
                          <input name="marca" placeholder="marca" value={filtros.marca} onChange={handleFiltro} style={styles.input} />
                          <div style={styles.sep}></div>
                          <div style={styles.sTitle}>CALIBRE</div>
                          <select name="calibre" value={filtros.calibre} onChange={handleFiltro} style={styles.select}>
                            <option value="">Todos</option>
                            {CALIBRES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <div style={styles.sep}></div>
                          <div style={styles.sTitle}>ORDENAR POR</div>
                          <select name="precio_orden" value={filtros.precio_orden} onChange={handleFiltro} style={styles.select}>
                            <option value="recientes">Destacados (Recientes)</option>
                            <option value="asc">Precio: menor a mayor</option>
                            <option value="desc">Precio: mayor a menor</option>
                          </select>
                          <button type="button" onClick={borrarFiltros} style={styles.btnBorrar}>Borrar filtros</button>
                        </aside>

                        <section style={styles.main}>
                          {loading && <p>Cargando armas...</p>}
                          {error && <p style={{color:'red'}}>{error}</p>}
                          <div style={styles.grid}>
                            {armas.map(arma => (
                              <div key={arma.id} style={styles.card(arma)}>
                                {arma.destacado && (<div style={styles.destacado}>★ DESTACADO</div>)}
                                {arma.fotos && arma.fotos.length > 0 && (
                                  <img src={arma.fotos[0]} alt="foto" style={typeof window !== 'undefined' && window.innerWidth <= 700 ? styles.imgMobile : styles.img} />
                                )}
                                <div style={{
                                  padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? '12px 12px 14px 12px' : '0 16px 10px 16px',
                                  width: '100%', boxSizing: 'border-box',
                                  minWidth: typeof window !== 'undefined' && window.innerWidth <= 700 ? 0 : undefined,
                                  maxWidth: typeof window !== 'undefined' && window.innerWidth <= 700 ? '100%' : undefined,
                                  overflow: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'hidden' : undefined,
                                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                  height: typeof window !== 'undefined' && window.innerWidth <= 700 ? '100%' : undefined,
                                  alignItems: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'flex-start' : undefined,
                                }}>
                                  <div style={{ fontWeight: 700, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 15 : 20, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '0 0 2px 0' : '12px 0 2px 0', color: '#ffc107', textAlign: 'left', letterSpacing: 1, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {arma.marca} {arma.modelo}
                                  </div>
                                  <div style={{ marginBottom: typeof window !== 'undefined' && window.innerWidth <= 700 ? 2 : 6, textAlign: 'left', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    <span style={{...styles.chip(chipColor(arma.tipo_arma)), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.tipo_arma}</span>
                                    <span style={{...styles.chip('#4a4f4a'), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.calibre}</span>
                                    <span style={{...styles.chip(estadoColor(arma.estado_arma)), fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 13}}>{arma.estado_arma}</span>
                                  </div>
                                  <div style={{ ...styles.precio, textAlign: 'left', fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 14 : 20, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0 0 0' : '8px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {arma.moneda === 'USD' ? 'US$' : '$'} {arma.precio_venta} {arma.moneda === 'USD' ? 'Dólares' : 'Pesos AR'}
                                  </div>
                                  <div style={{ margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0 2px 0' : '2px 0 6px 0', color: '#90caf9', fontWeight: 600, textAlign: 'left', fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 12 : 14 }}>
                                    {arma.ciudad && arma.provincia ? `${arma.ciudad}, ${arma.provincia}` : ''}
                                  </div>
                                  <div style={{fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, color: typeof window !== 'undefined' && window.innerWidth <= 700 ? '#233042' : '#fff', marginBottom: typeof window !== 'undefined' && window.innerWidth <= 700 ? 2 : 6, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{arma.comentarios}</div>
                                  {arma.estado_publicacion === 'VENDIDA' && (<div style={{...styles.vendido, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 13 : 18, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '2px 0' : '8px 0 0 0'}}>VENDIDO</div>)}
                                  {arma.estado_publicacion === 'PUBLICADA_CON_CONTACTO' && (
                                    <div style={{...styles.contacto, background: typeof window !== 'undefined' && window.innerWidth <= 700 ? '#f5f5f5' : '#fff2', color: typeof window !== 'undefined' && window.innerWidth <= 700 ? '#233042' : undefined, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? 6 : 8, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '6px 0' : 8}}>
                                      <b>CONTACTAR</b><br/>
                                      {arma.nombre}<br/>
                                      {arma.telefono}<br/>
                                      {arma.email}<br/>
                                      {arma.ciudad}, {arma.provincia}, {arma.pais}
                                    </div>
                                  )}
                                  {arma.estado_publicacion === 'PUBLICADA_SIN_CONTACTO' && (<div style={{...styles.contacto, background: typeof window !== 'undefined' && window.innerWidth <= 700 ? '#fffbe6' : '#fff2', color:'#8a6d00', fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 11 : 14, padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? 6 : 8, margin: typeof window !== 'undefined' && window.innerWidth <= 700 ? '6px 0' : 8}}>Contacto visible tras pago</div>)}
                                  <div style={{ display: 'flex', gap: 8, marginTop: typeof window !== 'undefined' && window.innerWidth <= 700 ? 6 : 10, width: '100%', justifyContent: typeof window !== 'undefined' && window.innerWidth <= 700 ? 'flex-end' : 'flex-start' }}>
                                    <button style={{ ...styles.btnDetalles, fontSize: typeof window !== 'undefined' && window.innerWidth <= 700 ? 13 : 15, padding: typeof window !== 'undefined' && window.innerWidth <= 700 ? '8px 14px' : '8px 18px', minWidth: 80, margin: 0, borderRadius: 8, fontWeight: 700, background: '#ffc107', color: '#223a5e', border: 'none', boxShadow: typeof window !== 'undefined' && window.innerWidth <= 700 ? '0 2px 8px #0002' : undefined }} onClick={() => navigate(`/arma/${arma.id}`)}>VER DETALLES</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 120, display: showMobileFilters ? 'block' : 'none' }}>
                        <div style={{ height: 56, background: '#2f3d2b', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between' }}>
                          <button onClick={()=>setShowMobileFilters(false)} style={{background:'transparent', border:'none', color:'#fff', fontSize:22, fontWeight:900, cursor:'pointer'}}>✕</button>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', fontSize:18, fontWeight:900, letterSpacing:1}}>VER/FILTRAR OPCIONES</div>
                          <div style={{width:28}}></div>
                        </div>
                        <div style={{ padding: 16 }}>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'0 0 8px 0'}}>MOSTRAR</div>
                          <select disabled style={{...styles.select, opacity:0.7}}>
                            <option>24 por página</option>
                          </select>
                          <div style={styles.sep}></div>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'12px 0 8px 0'}}>ORDENAR POR</div>
                          <select name="precio_orden" value={filtros.precio_orden} onChange={handleFiltro} style={styles.select}>
                            <option value="recientes">Destacados (Recientes)</option>
                            <option value="asc">Precio: menor a mayor</option>
                            <option value="desc">Precio: mayor a menor</option>
                          </select>
                          <div style={styles.sep}></div>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'12px 0 8px 0'}}>CATEGORÍAS</div>
                          <div style={{display:'flex', flexDirection:'column', gap:6}}>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="" checked={!filtros.tipo_arma} onChange={handleFiltro}/>
                              <span style={{fontWeight: !filtros.tipo_arma ? 800 : 500}}>Todas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Pistola" checked={filtros.tipo_arma==='Pistola'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Pistola' ? 800 : 500}}>Pistolas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Fusil" checked={filtros.tipo_arma==='Fusil'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Fusil' ? 800 : 500}}>Fusiles</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Escopeta" checked={filtros.tipo_arma==='Escopeta'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Escopeta' ? 800 : 500}}>Escopetas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Carabina" checked={filtros.tipo_arma==='Carabina'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Carabina' ? 800 : 500}}>Carabinas</span>
                            </label>
                            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                              <input style={{accentColor:'#bfa14a', width:18, height:18, appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto', cursor:'pointer'}} type="radio" name="tipo_arma" value="Revolver" checked={filtros.tipo_arma==='Revolver'} onChange={handleFiltro}/>
                              <span style={{fontWeight: filtros.tipo_arma==='Revolver' ? 800 : 500}}>Revólveres</span>
                            </label>
                          </div>
                          <div style={styles.sep}></div>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'12px 0 8px 0'}}>FILTRAR POR PALABRA CLAVE</div>
                          <input name="busqueda" placeholder="buscar marca o modelo" value={filtros.busqueda} onChange={handleFiltro} style={styles.input} />
                          <div style={styles.sep}></div>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'12px 0 8px 0'}}>MARCA</div>
                          <input name="marca" placeholder="marca" value={filtros.marca} onChange={handleFiltro} style={styles.input} />
                          <div style={styles.sep}></div>
                          <div style={{fontFamily:'Oswald, Inter, sans-serif', color:'#233042', fontSize:14, letterSpacing:1, fontWeight:900, margin:'12px 0 8px 0'}}>CALIBRE</div>
                          <select name="calibre" value={filtros.calibre} onChange={handleFiltro} style={styles.select}>
                            <option value="">Todos</option>
                            {CALIBRES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <div style={{display:'flex', gap:8, marginTop:12}}>
                            <button style={{...styles.goBtn, flex:1}} onClick={()=>setShowMobileFilters(false)}>Aplicar</button>
                            <button style={{...styles.btnBorrar, flex:1}} onClick={()=>{ setShowMobileFilters(false); borrarFiltros(); }}>Borrar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }

export default Listado;
