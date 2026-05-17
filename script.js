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

    // 2. CONFIGURACIÓN DEL NAMESPACE PARA LOCALSTORAGE (Requisito E3.2)
    const STORAGE_KEY = 'securecam_form_data';

    // 3. FUNCIÓN DE INICIALIZACIÓN
    function init() {
        console.log("🔒 SecureCam Core inicializado correctamente...");
        
        if (formulario) {
            configurarEventos();
            cargarDatosPremios(); // Restaurar caché si existe al cargar la página
        }
    }

    // 4. MANEJADORES DE EVENTOS
    function configurarEventos() {
        // Escucha cambios en tiempo real en cualquier campo del formulario para autoguardado
        formulario.addEventListener('input', guardarDatosEnTiempoReal);
        
        // Manejo del envío
        formulario.addEventListener('submit', manejarEnvioFormulario);
    }

    // 5. LÓGICA DE PERSISTENCIA (LOCALSTORAGE)
    function guardarDatosEnTiempoReal() {
        // Creamos un objeto con los valores actuales de los campos del formulario
        const datosFormulario = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            planInteres: document.getElementById('plan-interes').value
        };

        // Guardamos el objeto convertido en cadena de texto (JSON) en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosFormulario));
        console.log("💾 Datos del formulario respaldados en tiempo real...");
    }

    function cargarDatosPremios() {
        const datosGuardados = localStorage.getItem(STORAGE_KEY);

        // Si existen datos previos en el caché, los restauramos en los campos correspondientes
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                if (datos.nombre) document.getElementById('nombre').value = datos.nombre;
                if (datos.telefono) document.getElementById('telefono').value = datos.telefono;
                if (datos.planInteres) document.getElementById('plan-interes').value = datos.planInteres;
                console.log("⚡ Caché recuperado: Campos de cotización restaurados con éxito.");
            } catch (error) {
                console.error("Error al parsear los datos del localStorage:", error);
            }
        }
    }

    function manejarEnvioFormulario(event) {
        event.preventDefault();
        console.log("Procesando solicitud de cotización...");
        // La lógica de simulación de envío y control de estado de conversión vendrá en el siguiente commit
    }

    // Lanzamiento oficial de la aplicación al cargar el documento
    document.addEventListener('DOMContentLoaded', init);

})();