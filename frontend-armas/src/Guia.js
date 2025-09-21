import React from 'react';

function Guia() {
  return (
    <div style={{maxWidth:700, margin:'110px auto 60px auto', background:'#223a5e', border:'2.5px solid #ffc107', borderRadius:16, boxShadow:'0 2px 16px #0002', color:'#fff', padding:32, width:'100%', boxSizing:'border-box',
      '@media (max-width: 700px)': {
        maxWidth:'98vw',
        minWidth:'90vw',
        padding:12,
      }
    }}>
      <h2 style={{color:'#ffc107', fontWeight:700, fontSize:28, marginBottom:18, textAlign:'center'}}>Guía para Publicar un Aviso</h2>
      <ol style={{fontSize:18, marginBottom:28, paddingLeft:24, color:'#fff', textAlign:'left'}}>
        <li>Haz clic en el botón <b>PUBLICAR</b> en la barra superior.</li>
        <li>Completa todos los campos obligatorios del formulario: datos de contacto, información del arma, precio y documentación.</li>
        <li>Sube hasta 10 fotos claras del arma. Puedes agregar imágenes de a una y se irán acumulando.</li>
        <li>Agrega comentarios o detalles relevantes en el campo correspondiente.</li>
        <li>Haz clic en <b>ENVIAR</b>. Recibirás instrucciones de pago por email.</li>
        <li>Una vez acreditado el pago, tu aviso será publicado con los datos de contacto visibles.</li>
      </ol>
      <div style={{fontSize:18, marginTop:24, background:'#fff2', color:'#ffffffff', borderRadius:10, padding:18, textAlign:'center'}}>
        <b>¿Dudas o consultas?</b><br/>
        Escribe a: <a href="mailto:contacto@ventadearmas.com.ar" style={{color:'#19d26cff', fontWeight:700}}>contacto@ventadearmas.com.ar</a>
      </div>
    </div>
  );
}

export default Guia;