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
    const USER_STATE_KEY = 'securecam_user_converted'; // Registra si ya es un cliente convertido

    // 3. FUNCIÓN DE INICIALIZACIÓN
    function init() {
        console.log("🔒 SecureCam Core inicializado correctamente...");
        
        // Verificar primero si el usuario ya envió una cotización antes
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
        // Retorna true si existe la marca en el almacenamiento local
        return localStorage.getItem(USER_STATE_KEY) === 'true';
    }

    function mostrarMensajeDeAgradecimientoDirecto() {
        if (formulario && mensajeExito) {
            formulario.classList.add('hidden'); // Ocultamos el formulario por completo
            mensajeExito.classList.remove('hidden'); // Mostramos la caja de éxito
            
            // Intentamos recuperar el nombre guardado para personalizar el mensaje
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            const nombreUsuario = datosGuardados ? JSON.parse(datosGuardados).nombre : "Cliente";

            mensajeExito.innerHTML = `
                <div style="padding: 2rem; border: 2px dashed #2563eb; border-radius: 8px; background-color: #f0fdf4;">
                    <h3 style="color: #16a34a; margin-bottom: 0.5rem;">✅ ¡Tienes una solicitud activa!</h3>
                    <p>Hola <strong>${nombreUsuario}</strong>, ya hemos recibido tus datos para la cotización de tus cámaras de seguridad. Un asesor técnico de SecureCam se comunicará contigo muy pronto.</p>
                </div>
            `;
        }
    }

    function manejarEnvioFormulario(event) {
        event.preventDefault();
        console.log("Simulando envío de datos a la API...");

        // Al enviar con éxito, marcamos al usuario como "convertido" en el caché
        localStorage.setItem(USER_STATE_KEY, 'true');

        // Ejecutamos el cambio visual inmediato de la interfaz
        mostrarMensajeDeAgradecimientoDirecto();
    }

    // Lanzamiento oficial de la aplicación al cargar el documento
    document.addEventListener('DOMContentLoaded', init);

})();