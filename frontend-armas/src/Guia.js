import React from 'react';

function Guia() {
  return (
    <div style={{
      maxWidth: 700, 
      margin: '110px auto 60px auto', 
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 100%)', 
      border: '2px solid rgba(74, 124, 89, 0.4)', 
      borderRadius: 16, 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)', 
      color: '#e0e0e0', 
      padding: 32, 
      width: '100%', 
      boxSizing: 'border-box',
      fontFamily: '"Roboto Mono", monospace'
    }}>
      <h2 style={{
        color: '#4a7c59', 
        fontWeight: 800, 
        fontSize: 28, 
        marginBottom: 18, 
        textAlign: 'center',
        textShadow: '0 0 10px rgba(74, 124, 89, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: '"Roboto Mono", monospace'
      }}>
        🎯 Guía para Publicar un Aviso
      </h2>
      <ol style={{
        fontSize: 18, 
        marginBottom: 28, 
        paddingLeft: 24, 
        color: '#e0e0e0', 
        textAlign: 'left',
        fontFamily: '"Roboto Mono", monospace'
      }}>
        <li>Haz clic en el botón <b style={{color: '#4a7c59'}}>PUBLICAR</b> en la barra superior.</li>
        <li>Completa todos los campos obligatorios del formulario: datos de contacto, información del arma, precio y documentación.</li>
        <li>Sube hasta 10 fotos claras del arma. Puedes agregar imágenes de a una y se irán acumulando.</li>
        <li>Agrega comentarios o detalles relevantes en el campo correspondiente.</li>
        <li>Haz clic en <b style={{color: '#4a7c59'}}>ENVIAR</b>. Recibirás instrucciones de pago por email.</li>
        <li>Una vez acreditado el pago, tu aviso será publicado con los datos de contacto visibles.</li>
      </ol>
      <div style={{
        fontSize: 18, 
        marginTop: 24, 
        background: 'rgba(74, 124, 89, 0.2)', 
        color: '#e0e0e0', 
        borderRadius: 10, 
        padding: 18, 
        textAlign: 'center',
        border: '1px solid rgba(74, 124, 89, 0.4)',
        fontFamily: '"Roboto Mono", monospace'
      }}>
        <b style={{color: '#4a7c59'}}>¿Dudas o consultas?</b><br/>
        Escribe a: <a href="mailto:contacto@ventadearmas.com.ar" style={{color: '#4a7c59', fontWeight: 700}}>contacto@ventadearmas.com.ar</a>
      </div>
    </div>
  );
}

export default Guia;