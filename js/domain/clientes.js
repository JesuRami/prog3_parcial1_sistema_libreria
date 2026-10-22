/* Validación del alta de clientes (Ejercicio 4). No toca el DOM. */
(function () {
  'use strict';

  // Sin espacios exteriores y sin distinguir mayúsculas de minúsculas.
  function normalizarEmail(email) {
    return String(email).trim().toLowerCase();
  }

  // Formato básico: algo@dominio.ext, sin espacios.
  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Devuelve { errores: { campo: mensaje }, cliente }; `cliente` solo si no hay errores.
  function validarCliente(datos, clientes) {
    var errores = {};
    var nombre = String(datos.nombre).trim();
    var email = String(datos.email).trim();

    if (nombre === '') {
      errores.nombre = 'El nombre completo no puede estar vacío.';
    }

    if (email === '') {
      errores.email = 'El email no puede estar vacío.';
    } else if (!emailValido(email)) {
      errores.email = 'El email no tiene un formato válido. Ejemplo: nombre@dominio.com';
    } else {
      var repetido = clientes.some(function (cliente) {
        return normalizarEmail(cliente.email) === normalizarEmail(email);
      });
      if (repetido) {
        errores.email = 'Ya existe un cliente con ese email.';
      }
    }

    if (Object.keys(errores).length > 0) {
      return { errores: errores, cliente: null };
    }
    return { errores: errores, cliente: { nombreCompleto: nombre, email: email } };
  }

  window.Libreria.clientes = {
    normalizarEmail: normalizarEmail,
    emailValido: emailValido,
    validarCliente: validarCliente
  };
})();
