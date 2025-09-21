// Eliminado useEffect fuera de componente
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const camposIniciales = {
	nombre: '',
	pais: '',
	ciudad: '',
	provincia: '',
	telefono: '',
	email: '',
	precio_venta: '',
	moneda: 'USD',
	marca: '',
	modelo: '',
	numero_serie: '',
	tipo_arma: '',
	calibre: '',
	estado_arma: '',
	empadronamiento: '',
	comentarios: '',
	fotos: []
};

const opcionesTipoArma = [
	'Pistola','Revolver', 'Fusil', 'Carabina', 'Escopeta', 'Mira telescopica', 'Otro'
];
const opcionesEstadoArma = ['Nueva', 'Usada'];
const opcionesEmpadronamiento = [
	'Reempadronada', 'En tramite ANMAC', 'Tenencia Vigente', 'Tenencia Vencida', 'En venta NUEVA'
];

function FormularioArma() {
	useEffect(() => {
		// Forzar overflowX hidden en body y html para evitar scroll lateral
		document.body.style.overflowX = 'hidden';
		document.documentElement.style.overflowX = 'hidden';
		return () => {
			document.body.style.overflowX = '';
			document.documentElement.style.overflowX = '';
		};
	}, []);
	const [campos, setCampos] = useState(camposIniciales);
	const [fotosPreview, setFotosPreview] = useState([]);
	const [mensaje, setMensaje] = useState('');
	const [cargando, setCargando] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCampos({ ...campos, [name]: value });
	};

		const handleFotos = (e) => {
			const nuevosArchivos = Array.from(e.target.files);
			// Acumular los archivos anteriores y los nuevos, hasta 10
			const acumulados = [...(campos.fotos || []), ...nuevosArchivos].slice(0, 10);
			setCampos({ ...campos, fotos: acumulados });
			setFotosPreview(acumulados.map(file => URL.createObjectURL(file)));
			// Limpiar el input para permitir volver a cargar el mismo archivo si se quiere
			e.target.value = '';
		};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setCargando(true);
		setMensaje('');

		// Subir fotos a Supabase Storage y obtener URLs públicas
		let fotosUrls = [];
		if (campos.fotos && campos.fotos.length > 0) {
			for (let i = 0; i < campos.fotos.length; i++) {
				const foto = campos.fotos[i];
				const nombreArchivo = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${foto.name}`;
				const { data: uploadData, error: uploadError } = await supabase.storage
					.from('armas-fotos')
					.upload(nombreArchivo, foto, { cacheControl: '3600', upsert: false });
				if (uploadError) {
					setMensaje('Error al subir la foto: ' + uploadError.message);
					setCargando(false);
					return;
				}
				// Obtener URL pública temporal
				const { data: urlData } = supabase.storage.from('armas-fotos').getPublicUrl(nombreArchivo);
				fotosUrls.push(urlData.publicUrl);
			}
		}

		const { fotos, ...datosArma } = campos;
		const { data, error } = await supabase
			.from('armas')
			.insert([{ ...datosArma, fotos: fotosUrls }]);

		if (error) {
			setMensaje('Error al enviar: ' + error.message);
		} else {
			setMensaje('¡Arma enviada correctamente!');
			setCampos(camposIniciales);
			setFotosPreview([]);
		}
		setCargando(false);
	};

	// --- ESTILOS ---
	const styles = {
		page: { width: '100vw', minHeight: '100vh', background: '#e6eaf2', color: '#223a5e', fontFamily: 'inherit', padding: 0, margin: 0, boxSizing: 'border-box', position: 'relative', overflowX: 'hidden', paddingBottom: 48 },
		container: { maxWidth: 1200, margin: '120px auto 0 auto', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' },
		// btnVolver eliminado
		titulo: { color: '#ffc107', fontWeight: 700, fontSize: 36, textAlign: 'center', margin: '0px 0 18px 0', letterSpacing: 1, textShadow: '1px 1px 2px #222', textTransform: 'uppercase' },
		subtitulo: { color: '#223a5e', fontWeight: 400, fontSize: 18, textAlign: 'center', marginBottom: 32 },
		form: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 },
			cardsRow: { display: 'flex', flexDirection: 'row', gap: 32, width: '100%', justifyContent: 'center', flexWrap: 'wrap',
				'@media (max-width: 700px)': {
					flexDirection: 'column',
					gap: 16,
					alignItems: 'center',
				}
			},
			card: { background: '#223a5e', border: '2.5px solid #ffc107', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 24, minWidth: 260, maxWidth: 370, flex: 1, color: '#fff', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative',
				'@media (max-width: 700px)': {
					minWidth: '90vw',
					maxWidth: '98vw',
					margin: '0 auto 12px auto',
					padding: 12,
				}
			},
		cardTitle: { color: '#ffc107', fontWeight: 700, fontSize: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: 0.5 },
		label: { fontWeight: 600, marginBottom: 2, color: '#ffc107', fontSize: 14 },
		input: { border: '1px solid #bbb', borderRadius: 6, padding: '8px 12px', fontSize: 15, marginBottom: 18, width: '90%', maxWidth: 320, minWidth: 120, boxSizing: 'border-box', display: 'block', marginLeft: 'auto', marginRight: 'auto' },
		select: { border: '1px solid #bbb', borderRadius: 6, padding: '8px 12px', fontSize: 15, marginBottom: 18, width: '90%', maxWidth: 320, minWidth: 120, boxSizing: 'border-box', display: 'block', marginLeft: 'auto', marginRight: 'auto' },
		radioGroup: { display: 'flex', gap: 16, marginBottom: 8 },
		radioBtn: checked => ({ background: checked ? '#556b2f' : '#fff', color: checked ? '#fff' : '#223a5e', border: '1.5px solid #556b2f', borderRadius: 8, padding: '7px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 15, outline: 'none' }),
		textarea: { border: '1px solid #bbb', borderRadius: 6, padding: '8px 12px', fontSize: 15, marginBottom: 8, width: '96%', maxWidth: 700, minWidth: 180, minHeight: 120, boxSizing: 'border-box', display: 'block', marginLeft: 'auto', marginRight: 'auto', resize: 'none' },
			imgCard: { background: '#223a5e', border: '2.5px solid #ffc107', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 24, color: '#fff', marginTop: 32, width: '100%', maxWidth: 1150,
				'@media (max-width: 700px)': {
					maxWidth: '98vw',
					minWidth: '90vw',
					padding: 12,
				}
			},
		imgTitle: { color: '#ffc107', fontWeight: 700, fontSize: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: 0.5 },
		btn: { background: '#556b2f', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 38px', fontWeight: 700, fontSize: 18, marginTop: 18, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 2px 8px #0002' },
		previewImg: { borderRadius: 8, border: '1.5px solid #ffc107', margin: 2, width: 80, height: 60, objectFit: 'cover', background: '#fff' },
		mensaje: { marginTop: 18, fontWeight: 600, fontSize: 17, color: '#223a5e', textAlign: 'center' }
	};

		const handleVolver = () => window.history.back();

		return (
				<div style={styles.page}>
					<div style={styles.container}>
				<h2 style={styles.titulo}>PUBLICAR ARMA</h2>
					<div style={styles.subtitulo}>Complete todos los campos obligatorios para publicar su arma</div>
					<form style={styles.form} onSubmit={handleSubmit}>
						<div style={styles.cardsRow}>
							{/* Información de Contacto */}
							<div style={styles.card}>
								<div style={styles.cardTitle}><span role="img" aria-label="contacto">📞</span> Información de Contacto</div>
								<label style={styles.label}>NOMBRE DE CONTACTO *</label>
								<input style={styles.input} name="nombre" placeholder="Ingrese su nombre completo" value={campos.nombre} onChange={handleChange} required />
								<label style={styles.label}>CIUDAD *</label>
								<input style={styles.input} name="ciudad" placeholder="Ciudad" value={campos.ciudad} onChange={handleChange} required />
								<label style={styles.label}>PROVINCIA *</label>
								<input style={styles.input} name="provincia" placeholder="Provincia" value={campos.provincia} onChange={handleChange} required />
								<label style={styles.label}>TELÉFONO *</label>
								<input style={styles.input} name="telefono" placeholder="11-1234-5678" value={campos.telefono} onChange={handleChange} required />
								<label style={styles.label}>EMAIL *</label>
								<input style={styles.input} name="email" type="email" placeholder="ejemplo@correo.com" value={campos.email} onChange={handleChange} required />
							</div>
							{/* Información del Arma */}
							<div style={styles.card}>
								<div style={styles.cardTitle}><span role="img" aria-label="arma">🟢</span> Información del Arma</div>
								<label style={styles.label}>MARCA *</label>
								<input style={styles.input} name="marca" placeholder="Ej: Glock, Beretta," value={campos.marca} onChange={handleChange} required />
								<label style={styles.label}>MODELO *</label>
								<input style={styles.input} name="modelo" placeholder="Ej: 17, 92FS, etc." value={campos.modelo} onChange={handleChange} required />
								<label style={styles.label}>NÚMERO DE SERIE *</label>
								<input style={styles.input} name="numero_serie" placeholder="Número de serie del arma" value={campos.numero_serie} onChange={handleChange} required />
								<label style={styles.label}>TIPO DE ARMA *</label>
								<select style={styles.select} name="tipo_arma" value={campos.tipo_arma} onChange={handleChange} required>
									<option value="">Tipo de arma</option>
									{opcionesTipoArma.map(op => <option key={op} value={op}>{op}</option>)}
								</select>
								<label style={styles.label}>CALIBRE *</label>
								<input style={styles.input} name="calibre" placeholder="Ej: 9mm, .45 ACP," value={campos.calibre} onChange={handleChange} required />
								<label style={styles.label}>ESTADO *</label>
								<div style={styles.radioGroup}>
									{opcionesEstadoArma.map(op => (
										<button type="button" key={op} style={styles.radioBtn(campos.estado_arma === op)} onClick={() => setCampos({ ...campos, estado_arma: op })}>{op.toUpperCase()}</button>
									))}
								</div>
							</div>
							{/* Precio y Documentación */}
							<div style={styles.card}>
								<div style={styles.cardTitle}><span role="img" aria-label="precio">💰</span> Precio y Documentación</div>
								<label style={styles.label}>PRECIO DE VENTA *</label>
								<input style={styles.input} name="precio_venta" type="number" placeholder="0" value={campos.precio_venta} onChange={handleChange} required />
								<label style={styles.label}>MONEDA *</label>
								<select style={styles.select} name="moneda" value={campos.moneda} onChange={handleChange} required>
									<option value="USD">Dólares (USD)</option>
									<option value="ARS">Pesos Argentinos</option>
								</select>
								<label style={styles.label}>EMPADRONAMIENTO / REGISTRO *</label>
								<select style={styles.select} name="empadronamiento" value={campos.empadronamiento} onChange={handleChange} required>
									<option value="">Seleccione estado</option>
									{opcionesEmpadronamiento.map(op => <option key={op} value={op}>{op}</option>)}
								</select>
							</div>
						</div>
						{/* Imágenes y Detalles */}
						<div style={styles.imgCard}>
							<div style={styles.imgTitle}><span role="img" aria-label="imagenes">🖼️</span> Imágenes y Detalles</div>
							<label style={styles.label}>IMÁGENES DEL ARMA * (MÁXIMO 10)</label>
							<input style={{marginBottom:12}} name="fotos" type="file" accept="image/*" multiple onChange={handleFotos} />
							<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
								{fotosPreview.map((src, i) => (
									<img key={i} src={src} alt="preview" style={styles.previewImg} />
								))}
							</div>
							<label style={styles.label}>COMENTARIOS Y DETALLES</label>
							<textarea style={styles.textarea} name="comentarios" placeholder="Incluya detalles importantes, estado, etc." value={campos.comentarios} onChange={handleChange} />
							<button type="submit" style={styles.btn} disabled={cargando}>{cargando ? 'Enviando...' : 'ENVIAR'}</button>
							{mensaje && <div style={styles.mensaje}>{mensaje}</div>}
						</div>
					</form>
				</div>
			</div>
		);
}

export default FormularioArma;
