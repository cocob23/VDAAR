import React, { useEffect, useState } from 'react';

function AvisoLegal() {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/avisoLegal.txt')
      .then(res => res.text())
      .then(setTexto)
      .finally(() => setLoading(false));
  }, []);

  return (
  <div style={{maxWidth:900,margin:'110px auto 40px auto'}}>
      <h2>Aviso Legal</h2>
      <div style={{background:'#f8f8f8',padding:18,borderRadius:8,marginBottom:24,maxHeight:500,overflowY:'auto',fontSize:14}}>
        {loading ? <p>Cargando...</p> : <pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{texto}</pre>}
      </div>
    </div>
  );
}

export default AvisoLegal;
