/* Lógica de la venta simulada (Ejercicio 5). No toca el DOM.
   Un renglón en borrador es { libroId, cantidad, texto }: `cantidad` es un
   entero válido o null, y `texto` lo que escribió la persona en el campo. */
(function () {
  'use strict';

  var Libreria = window.Libreria;

  // Entero mayor que cero; cualquier otra cosa devuelve null.
  function parsearCantidad(texto) {
    var limpio = String(texto).trim();
    if (!/^\d+$/.test(limpio)) {
      return null;
    }
    var cantidad = Number(limpio);
    return cantidad > 0 ? cantidad : null;
  }

  function redondear(importe) {
    return Math.round(importe * 100) / 100;
  }

  function calcularSubtotal(cantidad, precioUnitario) {
    return redondear(cantidad * precioUnitario);
  }

  // Solo suma renglones con cantidad válida.
  function calcularTotal(renglones, precioDe) {
    var total = 0;
    renglones.forEach(function (renglon) {
      if (renglon.cantidad !== null) {
        total += calcularSubtotal(renglon.cantidad, precioDe(renglon.libroId));
      }
    });
    return redondear(total);
  }

  function buscarRenglon(renglones, libroId) {
    for (var i = 0; i < renglones.length; i++) {
      if (renglones[i].libroId === libroId) {
        return renglones[i];
      }
    }
    return null;
  }

  // Valida el renglón a agregar. Devuelve { errores, libroId, cantidad }.
  function validarRenglon(libroTexto, cantidadTexto, libros) {
    var errores = {};
    var libroId = Number(libroTexto);
    var cantidad = parsearCantidad(cantidadTexto);

    if (libroTexto === '') {
      errores.libro = 'Elegí un libro.';
    } else if (Libreria.store.buscarPorId(libros, libroId) === null) {
      errores.libro = 'El libro elegido no existe.';
    }
    if (cantidad === null) {
      errores.cantidad = 'La cantidad debe ser un número entero mayor que cero.';
    }
    return { errores: errores, libroId: libroId, cantidad: cantidad };
  }

  // Agrega el renglón; si el libro ya estaba, suma la cantidad al existente.
  // Devuelve true si fue un duplicado (para informarlo).
  function agregarRenglon(renglones, libroId, cantidad) {
    var existente = buscarRenglon(renglones, libroId);
    if (existente) {
      existente.cantidad = (existente.cantidad || 0) + cantidad;
      existente.texto = String(existente.cantidad);
      return true;
    }
    renglones.push({ libroId: libroId, cantidad: cantidad, texto: String(cantidad) });
    return false;
  }

  // Devuelve la lista de mensajes que impiden confirmar (vacía si se puede).
  function validarVenta(clienteTexto, renglones, clientes) {
    var errores = {};
    if (clienteTexto === '') {
      errores.cliente = 'Elegí un cliente.';
    } else if (Libreria.store.buscarPorId(clientes, Number(clienteTexto)) === null) {
      errores.cliente = 'El cliente elegido no existe.';
    }
    if (renglones.length === 0) {
      errores.renglones = 'Agregá al menos un renglón.';
    } else if (renglones.some(function (r) { return r.cantidad === null; })) {
      errores.cantidades = 'Corregí las cantidades: deben ser enteros mayores que cero.';
    }
    return errores;
  }

  // Arma la venta a guardar copiando precio y textos descriptivos (snapshot),
  // para que el historial no dependa de cambios posteriores en el catálogo.
  function construirVenta(cliente, renglones, libros, fecha) {
    var copia = renglones.map(function (renglon) {
      var libro = Libreria.store.buscarPorId(libros, renglon.libroId);
      return {
        libroId: libro.id,
        titulo: libro.titulo,
        cantidad: renglon.cantidad,
        precioUnitario: libro.precio,
        subtotal: calcularSubtotal(renglon.cantidad, libro.precio)
      };
    });
    var total = redondear(copia.reduce(function (suma, r) { return suma + r.subtotal; }, 0));

    return {
      fecha: fecha.toISOString(),
      clienteId: cliente.id,
      clienteNombre: cliente.nombreCompleto,
      renglones: copia,
      total: total
    };
  }

  function dosDigitos(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function formatearFecha(iso) {
    var f = new Date(iso);
    return dosDigitos(f.getDate()) + '/' + dosDigitos(f.getMonth() + 1) + '/' + f.getFullYear() +
      ' ' + dosDigitos(f.getHours()) + ':' + dosDigitos(f.getMinutes());
  }

  function formatearIdentificador(id) {
    return 'V-' + ('0000' + id).slice(-4);
  }

  Libreria.ventas = {
    parsearCantidad: parsearCantidad,
    calcularSubtotal: calcularSubtotal,
    calcularTotal: calcularTotal,
    validarRenglon: validarRenglon,
    agregarRenglon: agregarRenglon,
    validarVenta: validarVenta,
    construirVenta: construirVenta,
    formatearFecha: formatearFecha,
    formatearIdentificador: formatearIdentificador
  };
})();
