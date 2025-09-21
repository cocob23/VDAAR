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

	// --- ESTILOS MILITAR OSCURO ---
	const styles = {
		page: { 
			width: '100vw', 
			minHeight: '100vh', 
			background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a2a1a 75%, #0a1a0a 100%)', 
			color: '#e0e0e0', 
			fontFamily: '"Roboto Mono", "Courier New", monospace', 
			padding: 0, 
			margin: 0, 
			boxSizing: 'border-box', 
			position: 'relative', 
			overflowX: 'hidden', 
			paddingBottom: 48,
			backgroundAttachment: 'fixed'
		},
		container: { maxWidth: 1200, margin: '100px auto 0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' },
		titulo: { 
			color: '#4a7c59',
			textShadow: '0 0 10px rgba(74, 124, 89, 0.5), 0 0 20px rgba(74, 124, 89, 0.3), 0 0 30px rgba(74, 124, 89, 0.1)',
			fontWeight: 900, 
			fontSize: 40, 
			textAlign: 'center', 
			margin: '0px 0 18px 0', 
			letterSpacing: '3px', 
			textTransform: 'uppercase',
			fontFamily: '"Roboto Mono", monospace'
		},
		subtitulo: { 
			color: '#a0a0a0', 
			fontWeight: 400, 
			fontSize: 18, 
			textAlign: 'center', 
			marginBottom: 32,
			letterSpacing: '1px',
			fontFamily: '"Roboto Mono", monospace'
		},
		form: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 },
		cardsRow: { 
			display: 'flex', 
			flexDirection: 'row', 
			gap: 32, 
			width: '100%', 
			justifyContent: 'center', 
			flexWrap: 'wrap',
			'@media (max-width: 700px)': {
				flexDirection: 'column',
				gap: 16,
				alignItems: 'center',
			}
		},
		card: { 
			background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 50%, rgba(15, 15, 15, 0.95) 100%)', 
			backdropFilter: 'blur(10px)',
			border: '2px solid rgba(74, 124, 89, 0.3)', 
			borderRadius: 16, 
			boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(74, 124, 89, 0.1)', 
			padding: 32, 
			minWidth: 280, 
			maxWidth: 400, 
			flex: 1, 
			color: '#e0e0e0', 
			display: 'flex', 
			flexDirection: 'column', 
			gap: 20, 
			position: 'relative',
			transition: 'all 0.3s ease'
		},
		cardTitle: { 
			color: '#4a7c59',
			textShadow: '0 0 8px rgba(74, 124, 89, 0.6)',
			fontWeight: 800, 
			fontSize: 20, 
			marginBottom: 12, 
			display: 'flex', 
			alignItems: 'center', 
			gap: 8, 
			letterSpacing: '2px',
			textTransform: 'uppercase',
			fontFamily: '"Roboto Mono", monospace'
		},
		label: { 
			fontWeight: 600, 
			marginBottom: 2, 
			color: '#c0c0c0', 
			fontSize: 14,
			textTransform: 'uppercase',
			letterSpacing: '1px',
			fontFamily: '"Roboto Mono", monospace'
		},
		input: { 
			border: '2px solid rgba(74, 124, 89, 0.4)', 
			borderRadius: 8, 
			padding: '12px 16px', 
			fontSize: 15, 
			marginBottom: 18, 
			width: '100%', 
			maxWidth: 320, 
			minWidth: 120, 
			boxSizing: 'border-box', 
			display: 'block', 
			marginLeft: 'auto', 
			marginRight: 'auto',
			background: 'rgba(15, 15, 15, 0.9)',
			transition: 'all 0.3s ease',
			color: '#e0e0e0',
			fontFamily: '"Roboto Mono", monospace'
		},
		select: { 
			border: '2px solid rgba(74, 124, 89, 0.4)', 
			borderRadius: 8, 
			padding: '12px 16px', 
			fontSize: 15, 
			marginBottom: 18, 
			width: '100%', 
			maxWidth: 320, 
			minWidth: 120, 
			boxSizing: 'border-box', 
			display: 'block', 
			marginLeft: 'auto', 
			marginRight: 'auto',
			background: 'rgba(15, 15, 15, 0.9)',
			transition: 'all 0.3s ease',
			color: '#e0e0e0',
			cursor: 'pointer',
			fontFamily: '"Roboto Mono", monospace'
		},
		radioGroup: { display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' },
		radioBtn: checked => ({ 
			background: checked 
				? 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)' 
				: 'rgba(26, 26, 26, 0.8)', 
			color: checked ? '#fff' : '#c0c0c0', 
			border: `2px solid ${checked ? '#4a7c59' : 'rgba(74, 124, 89, 0.3)'}`, 
			borderRadius: 8, 
			padding: '10px 20px', 
			fontWeight: 700, 
			cursor: 'pointer', 
			fontSize: 15, 
			outline: 'none',
			transition: 'all 0.3s ease',
			textTransform: 'uppercase',
			letterSpacing: '1px',
			boxShadow: checked ? '0 0 10px rgba(74, 124, 89, 0.5)' : 'none',
			fontFamily: '"Roboto Mono", monospace'
		}),
		textarea: { 
			border: '2px solid rgba(74, 124, 89, 0.4)', 
			borderRadius: 8, 
			padding: '16px', 
			fontSize: 15, 
			marginBottom: 8, 
			width: '100%', 
			maxWidth: 700, 
			minWidth: 180, 
			minHeight: 120, 
			boxSizing: 'border-box', 
			display: 'block', 
			marginLeft: 'auto', 
			marginRight: 'auto', 
			resize: 'vertical',
			background: 'rgba(15, 15, 15, 0.9)',
			transition: 'all 0.3s ease',
			color: '#e0e0e0',
			fontFamily: '"Roboto Mono", monospace'
		},
		imgCard: { 
			background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 30, 20, 0.95) 50%, rgba(15, 15, 15, 0.95) 100%)', 
			backdropFilter: 'blur(10px)',
			border: '2px solid rgba(74, 124, 89, 0.3)', 
			borderRadius: 16, 
			boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(74, 124, 89, 0.1)', 
			padding: 32, 
			color: '#e0e0e0', 
			marginTop: 32, 
			width: '100%', 
			maxWidth: 1150
		},
		imgTitle: { 
			color: '#4a7c59',
			textShadow: '0 0 8px rgba(74, 124, 89, 0.6)',
			fontWeight: 800, 
			fontSize: 20, 
			marginBottom: 12, 
			display: 'flex', 
			alignItems: 'center', 
			gap: 8, 
			letterSpacing: '2px',
			textTransform: 'uppercase',
			fontFamily: '"Roboto Mono", monospace'
		},
		btn: { 
			background: 'linear-gradient(135deg, #4a7c59 0%, #2d5d3d 100%)', 
			color: '#fff', 
			border: '2px solid #4a7c59', 
			borderRadius: 8, 
			padding: '16px 48px', 
			fontWeight: 800, 
			fontSize: 18, 
			marginTop: 18, 
			cursor: 'pointer', 
			letterSpacing: '2px',
			textTransform: 'uppercase',
			boxShadow: '0 0 20px rgba(74, 124, 89, 0.4), 0 8px 15px rgba(0, 0, 0, 0.3)',
			transition: 'all 0.3s ease',
			position: 'relative',
			overflow: 'hidden',
			fontFamily: '"Roboto Mono", monospace'
		},
		previewImg: { 
			borderRadius: 8, 
			border: '2px solid rgba(74, 124, 89, 0.5)', 
			margin: 2, 
			width: 80, 
			height: 60, 
			objectFit: 'cover', 
			background: '#1a1a1a',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
		},
		mensaje: { 
			marginTop: 18, 
			fontWeight: 600, 
			fontSize: 17, 
			color: '#e0e0e0', 
			textAlign: 'center',
			padding: '16px',
			borderRadius: 8,
			background: 'rgba(74, 124, 89, 0.2)',
			border: '1px solid rgba(74, 124, 89, 0.4)',
			fontFamily: '"Roboto Mono", monospace'
		}
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
							<button 
								type="submit" 
								style={styles.btn} 
								disabled={cargando}
								onMouseEnter={(e) => {
									if (!cargando) {
										e.target.style.transform = 'translateY(-2px)';
										e.target.style.boxShadow = '0 12px 35px rgba(79, 172, 254, 0.5)';
									}
								}}
								onMouseLeave={(e) => {
									if (!cargando) {
										e.target.style.transform = 'translateY(0)';
										e.target.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
									}
								}}
							>
								{cargando ? 'Enviando...' : 'ENVIAR'}
							</button>
							{mensaje && <div style={styles.mensaje}>{mensaje}</div>}
						</div>
					</form>
				</div>
			</div>
		);
}

export default FormularioArma;
