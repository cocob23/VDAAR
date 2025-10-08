import React from 'react';

export default function Footer() {
  const wrap = {
    width: '100%',
    background: '#f3f3f0',
    borderTop: '1px solid #e3e3de',
    marginTop: 24
  };
  const inner = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '18px 16px 22px',
    color: '#233042',
    boxSizing: 'border-box',
    fontSize: 14
  };
  const grid = {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.8fr 0.8fr',
    gap: 16
  };
  const gridMobile = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  };
  const sectionTitle = {
    fontFamily: 'Oswald, Inter, sans-serif',
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: 0.5,
    margin: '0 0 8px 0',
    color: '#233042'
  };
  const aStyle = { color: '#233042', textDecoration: 'none' };
  const aHover = {
    textDecoration: 'underline',
    textDecorationColor: '#bfa14a'
  };
  const linkRow = { display: 'flex', flexWrap: 'wrap', gap: 10 };

  // Simple media check (no SSR critical usage here)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <footer style={wrap} aria-label="Pie de página">
      <div style={inner}>
        <div style={isMobile ? gridMobile : grid}>
          {/* Columna 1: Texto breve SEO */}
          <section>
            <h3 style={sectionTitle}>ventadearmas.ar</h3>
            <p style={{ margin: '0 0 6px 0', lineHeight: 1.6 }}>
              Compra y venta de <strong>armas nuevas y usadas</strong> en Argentina.
              Publicá tu aviso y encontrá <em>pistolas</em>, <em>fusiles</em>, <em>escopetas</em>, <em>revólveres</em> y <em>carabinas</em>.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: 13, color: '#5b6a7a' }}>
              Usá este sitio de forma responsable y conforme a la normativa vigente. Verificá requisitos aplicables (por ejemplo, ANMaC) antes de realizar operaciones.
            </p>
          </section>

          {/* Columna 2: Explorar */}
          <section>
            <h3 style={sectionTitle}>Explorar</h3>
            <nav aria-label="Explorar categorías" style={linkRow}>
              <a href="/?tipo=Pistola" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Pistolas</a>
              <a href="/?tipo=Fusil" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Fusiles</a>
              <a href="/?tipo=Escopeta" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Escopetas</a>
              <a href="/?tipo=Revolver" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Revólveres</a>
              <a href="/?tipo=Carabina" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Carabinas</a>
            </nav>
          </section>

          {/* Columna 3: Acciones */}
          <section>
            <h3 style={sectionTitle}>Acciones</h3>
            <nav aria-label="Acciones del sitio" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/publicar" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Publicar un aviso</a>
              <a href="/contacto" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Contacto</a>
              <a href="/aviso-legal" style={aStyle} onMouseOver={e=>Object.assign(e.currentTarget.style,aHover)} onMouseOut={e=>Object.assign(e.currentTarget.style,aStyle)}>Aviso legal</a>
            </nav>
          </section>
        </div>

        <div style={{ marginTop: 10, color: '#6b7280', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>© {new Date().getFullYear()} ventadearmas.ar</span>
          <span style={{ fontSize: 12 }}>Hecho con respeto por las normas y la seguridad de los usuarios.</span>
        </div>
      </div>
    </footer>
  );
}
