/**
 * SecureCam - Sistema de Monitoreo Inteligente
 * Lógica Principal con encapsulamiento IIFE
 * Desarrollado por: Yeison Albeiro Melo Cruz
 */

(function () {
    'use strict';

    // 1. SELECTORES DE ELEMENTOS DEL DOM
    const formulario = document.getElementById('form-cotizacion');
    const mensajeExito = document.getElementById('mensaje-exito');

    // 2. CONFIGURACIÓN DE NAMESPACES EN LOCALSTORAGE (Requisito E3.2)
    const STORAGE_KEY = 'securecam_form_data';
    const USER_STATE_KEY = 'securecam_user_converted';

    // 3. FUNCIÓN DE INICIALIZACIÓN
    function init() {
        console.log("🔒 SecureCam Core inicializado correctamente...");
        
        if (comprobarEstadoUsuarioConvertido()) {
            mostrarMensajeDeAgradecimientoDirecto();
        } else if (formulario) {
            configurarEventos();
            cargarDatosPrevios();
        }
    }

    // 4. MANEJADORES DE EVENTOS
    function configurarEventos() {
        formulario.addEventListener('input', guardarDatosEnTiempoReal);
        formulario.addEventListener('submit', manejarEnvioFormulario);
    }

    // 5. LÓGICA DE PERSISTENCIA (AUTOGUARDADO)
    function guardarDatosEnTiempoReal() {
        const datosFormulario = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            planInteres: document.getElementById('plan-interes').value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosFormulario));
    }

    function cargarDatosPrevios() {
        const datosGuardados = localStorage.getItem(STORAGE_KEY);
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                if (datos.nombre) document.getElementById('nombre').value = datos.nombre;
                if (datos.telefono) document.getElementById('telefono').value = datos.telefono;
                if (datos.planInteres) document.getElementById('plan-interes').value = datos.planInteres;
                console.log("⚡ Campos de cotización restaurados desde el caché.");
            } catch (error) {
                console.error("Error al cargar localStorage", error);
            }
        }
    }

    // 6. CONTROL DE ESTADO DE CONVERSIÓN
    function comprobarEstadoUsuarioConvertido() {
        return localStorage.getItem(USER_STATE_KEY) === 'true';
    }

    function mostrarMensajeDeAgradecimientoDirecto() {
        if (formulario && mensajeExito) {
            formulario.classList.add('hidden');
            mensajeExito.classList.remove('hidden');
            
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            const nombreUsuario = datosGuardados ? JSON.parse(datosGuardados).nombre : "Cliente";

            mensajeExito.innerHTML = `
                <div style="padding: 2rem; border: 2px dashed #2563eb; border-radius: 8px; background-color: #f0fdf4; text-align: left;">
                    <h3 style="color: #16a34a; margin-bottom: 0.5rem;">✅ ¡Tienes una solicitud activa!</h3>
                    <p>Hola <strong>${nombreUsuario}</strong>, ya hemos recibido tus datos para la cotización de tus cámaras de seguridad. Un asesor técnico de SecureCam se comunicará contigo muy pronto.</p>
                </div>
            `;
        }
    }

    // NUEVA FUNCIÓN OPTIMIZADA: Envío asíncrono y limpieza selectiva de caché
    function manejarEnvioFormulario(event) {
        event.preventDefault();
        console.log("📡 Iniciando envío de datos asíncronos mediante POST...");

        // Estructura de datos recopilada para enviar a la API externa
        const datosAEnviar = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            plan: document.getElementById('plan-interes').value
        };

        // Simulación técnica del Fetch POST hacia servicio de leads (Formspree/Endpoint)
        // En la entrega final aquí pondrás la URL real del servicio
        fetch('https://formspree.io/f/tu_endpoint_simulado', {
            method: 'POST',
            body: JSON.stringify(datosAEnviar),
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            console.log("🚀 Datos enviados con éxito a la API externa.");
            
            // ACCIONES REQUERIDAS DE PERSISTENCIA:
            // 1. Marcamos que el usuario ya completó la conversión
            localStorage.setItem(USER_STATE_KEY, 'true');
            
            // 2. Limpiamos SOLO el borrador temporal de los inputs para liberar memoria
            localStorage.removeItem(STORAGE_KEY);
            
            // 3. Actualizamos la interfaz del usuario inmediatamente
            mostrarMensajeDeAgradecimientoDirecto();
        }).catch(error => {
            console.error("Error simulado en la red, aplicando contingencia de éxito local:", error);
            // Contingencia para que funcione de manera local antes de configurar el backend real:
            localStorage.setItem(USER_STATE_KEY, 'true');
            mostrarMensajeDeAgradecimientoDirecto();
        });
    }

    document.addEventListener('DOMContentLoaded', init);

})();