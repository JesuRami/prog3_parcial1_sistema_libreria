/* Vista de ventas e historial (Ejercicio 5). El borrador de la venta vive en
   memoria de esta vista; solo la venta confirmada pasa al store.
   Todo texto se inserta con textContent. */
(function () {
  'use strict';

  var Libreria = window.Libreria;
  var formatear = Libreria.catalogo.formatearPrecio;

  var renglones = [];
  var ventaMostrada = null;

  function el(id) {
    return document.getElementById(id);
  }

  function crear(etiqueta, texto, clase) {
    var elemento = document.createElement(etiqueta);
    if (texto !== undefined) { elemento.textContent = texto; }
    if (clase) { elemento.className = clase; }
    return elemento;
  }

  function vaciar(contenedor) {
    while (contenedor.firstChild) { contenedor.removeChild(contenedor.firstChild); }
  }

  function libroDe(id) {
    return Libreria.store.buscarPorId(Libreria.store.getLibros(), id);
  }

  function precioDe(libroId) {
    return libroDe(libroId).precio;
  }

  function celdaTexto(texto, clase) {
    return crear('td', texto, clase);
  }

  function textoSoloLectores(texto) {
    return crear('span', texto, 'solo-lectores');
  }

  // ---- Errores y resultado --------------------------------------------

  function limpiarError(campo) {
    el('error-venta-' + campo).textContent = '';
    var control = el('venta-' + campo);
    if (control) { control.removeAttribute('aria-invalid'); }
  }

  function mostrarError(campo, texto) {
    el('error-venta-' + campo).textContent = texto;
    el('venta-' + campo).setAttribute('aria-invalid', 'true');
  }

  function mostrarResumenErrores(mensajes) {
    var lista = el('errores-venta');
    vaciar(lista);
    mensajes.forEach(function (mensaje) { lista.appendChild(crear('li', mensaje)); });
    lista.hidden = mensajes.length === 0;
  }

  function mostrarResultado(texto, esError) {
    var parrafo = el('resultado-venta');
    parrafo.textContent = texto;
    parrafo.className = esError ? 'mensaje mensaje--error' : 'mensaje';
    parrafo.hidden = false;
  }

  function ocultarResultado() {
    var parrafo = el('resultado-venta');
    parrafo.textContent = '';
    parrafo.hidden = true;
  }

  function limpiarMensajes() {
    ['cliente', 'libro', 'cantidad'].forEach(limpiarError);
    mostrarResumenErrores([]);
    ocultarResultado();
  }

  // ---- Borrador de la venta -------------------------------------------

  function crearFilaRenglon(renglon) {
    var libro = libroDe(renglon.libroId);
    var fila = document.createElement('tr');
    var idCampo = 'cantidad-renglon-' + libro.id;

    var celdaCantidad = crear('td', undefined, 'num');
    var etiqueta = crear('label', 'Cantidad de ' + libro.titulo, 'solo-lectores');
    etiqueta.htmlFor = idCampo;
    var campo = document.createElement('input');
    campo.className = 'cantidad';
    campo.type = 'number';
    campo.id = idCampo;
    campo.min = '1';
    campo.step = '1';
    campo.value = renglon.texto;
    campo.setAttribute('data-libro-id', String(libro.id));
    if (renglon.cantidad === null) { campo.setAttribute('aria-invalid', 'true'); }
    celdaCantidad.appendChild(etiqueta);
    celdaCantidad.appendChild(campo);

    var subtotal = renglon.cantidad === null
      ? 'Cantidad inválida'
      : formatear(Libreria.ventas.calcularSubtotal(renglon.cantidad, libro.precio));

    var boton = crear('button', 'Quitar', 'boton boton--secundario boton--chico');
    boton.type = 'button';
    boton.setAttribute('data-quitar', String(libro.id));
    boton.appendChild(textoSoloLectores(' ' + libro.titulo));

    fila.appendChild(celdaTexto(libro.titulo));
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaTexto(formatear(libro.precio), 'num'));
    fila.appendChild(celdaTexto(subtotal, 'num'));
    var celdaAccion = crear('td');
    celdaAccion.appendChild(boton);
    fila.appendChild(celdaAccion);
    return fila;
  }

  function renderBorrador() {
    var cuerpo = el('tabla-renglones');
    vaciar(cuerpo);
    renglones.forEach(function (renglon) { cuerpo.appendChild(crearFilaRenglon(renglon)); });
    el('msg-renglones-vacio').hidden = renglones.length !== 0;

    var total = formatear(Libreria.ventas.calcularTotal(renglones, precioDe));
    var select = el('venta-cliente');
    var opcion = select.options[select.selectedIndex];

    el('venta-total').textContent = total;
    el('resumen-total').textContent = total;
    el('resumen-renglones').textContent = String(renglones.length);
    el('resumen-cliente').textContent = select.value === '' ? 'Sin elegir' : opcion.textContent;
  }

  function agregarRenglon() {
    limpiarError('libro');
    limpiarError('cantidad');
    mostrarResumenErrores([]);
    ocultarResultado();

    var validacion = Libreria.ventas.validarRenglon(
      el('venta-libro').value, el('venta-cantidad').value, Libreria.store.getLibros());

    if (Object.keys(validacion.errores).length > 0) {
      Object.keys(validacion.errores).forEach(function (campo) {
        mostrarError(campo, validacion.errores[campo]);
      });
      el(validacion.errores.libro ? 'venta-libro' : 'venta-cantidad').focus();
      return;
    }

    var duplicado = Libreria.ventas.agregarRenglon(renglones, validacion.libroId, validacion.cantidad);
    renderBorrador();
    el('venta-libro').value = '';
    el('venta-cantidad').value = '1';
    if (duplicado) {
      mostrarResultado('Ese libro ya estaba en la venta: se sumó la cantidad al renglón existente.', false);
    }
  }

  function alCambiarCantidad(evento) {
    var campo = evento.target;
    if (!campo.hasAttribute('data-libro-id')) { return; }
    var libroId = Number(campo.getAttribute('data-libro-id'));
    var cantidad = Libreria.ventas.parsearCantidad(campo.value);

    renglones.forEach(function (renglon) {
      if (renglon.libroId === libroId) {
        renglon.cantidad = cantidad;
        renglon.texto = campo.value;
      }
    });
    mostrarResumenErrores(cantidad === null
      ? ['La cantidad debe ser un número entero mayor que cero.'] : []);
    ocultarResultado();
    renderBorrador();
    if (cantidad === null) { el('cantidad-renglon-' + libroId).focus(); }
  }

  function alQuitar(evento) {
    var boton = evento.target.closest('button[data-quitar]');
    if (!boton) { return; }
    var libroId = Number(boton.getAttribute('data-quitar'));
    renglones = renglones.filter(function (renglon) { return renglon.libroId !== libroId; });
    mostrarResumenErrores([]);
    ocultarResultado();
    renderBorrador();
    el('venta-libro').focus();
  }

  // ---- Confirmación ----------------------------------------------------

  function confirmarVenta(evento) {
    evento.preventDefault();
    limpiarMensajes();

    var store = Libreria.store;
    var errores = Libreria.ventas.validarVenta(el('venta-cliente').value, renglones, store.getClientes());
    var claves = Object.keys(errores);

    if (claves.length > 0) {
      if (errores.cliente) { mostrarError('cliente', errores.cliente); }
      mostrarResumenErrores(claves.map(function (clave) { return errores[clave]; }));
      mostrarResultado('No se confirmó la venta: revisá los mensajes.', true);
      return;
    }

    var cliente = store.buscarPorId(store.getClientes(), Number(el('venta-cliente').value));
    var venta = store.agregarVenta(
      Libreria.ventas.construirVenta(cliente, renglones, store.getLibros(), new Date()));

    el('form-venta').reset();
    renglones = [];
    ventaMostrada = null;
    renderBorrador();
    renderHistorial();
    mostrarResultado('Venta ' + Libreria.ventas.formatearIdentificador(venta.id) +
      ' confirmada. Total: ' + formatear(venta.total) + '.', false);
  }

  function alVaciar() {
    renglones = [];
    limpiarMensajes();
    // El reset restaura los valores después del evento: se redibuja al terminar.
    setTimeout(renderBorrador, 0);
  }

  // ---- Historial ---------------------------------------------------------

  function renderHistorial() {
    var ventas = Libreria.store.getVentas();
    var cuerpo = el('tabla-historial');
    vaciar(cuerpo);

    ventas.forEach(function (venta) {
      var identificador = Libreria.ventas.formatearIdentificador(venta.id);
      var fila = document.createElement('tr');
      var boton = crear('button', 'Ver detalle', 'boton boton--secundario boton--chico');
      boton.type = 'button';
      boton.setAttribute('data-detalle', String(venta.id));
      boton.appendChild(textoSoloLectores(' de la venta ' + identificador));
      var celdaBoton = crear('td');
      celdaBoton.appendChild(boton);

      fila.appendChild(celdaTexto(identificador));
      fila.appendChild(celdaTexto(Libreria.ventas.formatearFecha(venta.fecha)));
      fila.appendChild(celdaTexto(venta.clienteNombre));
      fila.appendChild(celdaTexto(formatear(venta.total), 'num'));
      fila.appendChild(celdaBoton);
      cuerpo.appendChild(fila);
    });

    el('msg-historial-vacio').hidden = ventas.length !== 0;
    renderDetalle();
  }

  function renderDetalle() {
    var venta = ventaMostrada === null ? null
      : Libreria.store.buscarPorId(Libreria.store.getVentas(), ventaMostrada);
    var seccion = el('detalle-venta');
    var hayVentas = Libreria.store.getVentas().length > 0;
    var envoltura = seccion.querySelector('.tabla-envoltura');

    seccion.hidden = !hayVentas;
    el('msg-detalle-vacio').hidden = venta !== null;
    el('detalle-resumen').hidden = venta === null;
    envoltura.hidden = venta === null;

    if (venta === null) {
      el('t-detalle').textContent = 'Detalle de la venta';
      return;
    }

    el('t-detalle').textContent = 'Detalle de la venta ' + Libreria.ventas.formatearIdentificador(venta.id);
    el('detalle-resumen').textContent = 'Cliente: ' + venta.clienteNombre +
      ' · Fecha: ' + Libreria.ventas.formatearFecha(venta.fecha);

    var cuerpo = el('tabla-detalle');
    vaciar(cuerpo);
    venta.renglones.forEach(function (renglon) {
      var fila = document.createElement('tr');
      fila.appendChild(celdaTexto(renglon.titulo));
      fila.appendChild(celdaTexto(String(renglon.cantidad), 'num'));
      fila.appendChild(celdaTexto(formatear(renglon.precioUnitario), 'num'));
      fila.appendChild(celdaTexto(formatear(renglon.subtotal), 'num'));
      cuerpo.appendChild(fila);
    });
    el('detalle-total').textContent = formatear(venta.total);
  }

  function alVerDetalle(evento) {
    var boton = evento.target.closest('button[data-detalle]');
    if (!boton) { return; }
    ventaMostrada = Number(boton.getAttribute('data-detalle'));
    renderDetalle();
    el('t-detalle').scrollIntoView({ block: 'nearest' });
  }

  function iniciar() {
    var formulario = el('form-venta');
    formulario.addEventListener('submit', confirmarVenta);
    formulario.addEventListener('reset', alVaciar);
    el('btn-agregar-renglon').addEventListener('click', agregarRenglon);
    el('venta-cliente').addEventListener('change', function () {
      limpiarError('cliente');
      renderBorrador();
    });
    el('tabla-renglones').addEventListener('change', alCambiarCantidad);
    el('tabla-renglones').addEventListener('click', alQuitar);
    el('tabla-historial').addEventListener('click', alVerDetalle);

    renderBorrador();
    renderHistorial();
  }

  Libreria.ventasUi = { iniciar: iniciar, renderBorrador: renderBorrador };
})();
