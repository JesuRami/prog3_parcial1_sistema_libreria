/* Formularios de alta de libros y clientes (Ejercicio 4).
   Controla el envío con preventDefault, muestra los errores junto a cada campo
   y en un resumen, y solo guarda el registro si todas las comprobaciones pasan. */
(function () {
  'use strict';

  var Libreria = window.Libreria;

  function limpiarErrores(formulario, resumen) {
    Array.prototype.forEach.call(formulario.querySelectorAll('.error-campo'), function (p) {
      p.textContent = '';
    });
    Array.prototype.forEach.call(formulario.querySelectorAll('[aria-invalid]'), function (campo) {
      campo.removeAttribute('aria-invalid');
    });
    while (resumen.firstChild) {
      resumen.removeChild(resumen.firstChild);
    }
    resumen.hidden = true;
  }

  // `campos` mapea cada clave de error con { prefijo, control }, para ubicar
  // el <p> de error y marcar el control inválido.
  function mostrarErrores(formulario, resumen, prefijo, errores) {
    var primero = null;
    Object.keys(errores).forEach(function (campo) {
      var parrafo = document.getElementById('error-' + prefijo + '-' + campo);
      var control = formulario.elements[campo];
      var item = document.createElement('li');

      parrafo.textContent = errores[campo];
      item.textContent = errores[campo];
      resumen.appendChild(item);

      // Los autores son un grupo de checkboxes: no se marca un control único.
      if (control && !control.length && control.setAttribute) {
        control.setAttribute('aria-invalid', 'true');
        if (!primero) { primero = control; }
      } else if (!primero && control && control[0]) {
        primero = control[0];
      }
    });
    resumen.hidden = false;
    if (primero) {
      primero.focus();
    }
  }

  function mostrarResultado(elemento, texto, esError) {
    elemento.textContent = texto;
    elemento.className = esError ? 'mensaje mensaje--error' : 'mensaje';
    elemento.hidden = false;
  }

  function ocultarResultado(elemento) {
    elemento.textContent = '';
    elemento.hidden = true;
  }

  function datosLibro(formulario) {
    var autores = Array.prototype.filter.call(
      formulario.querySelectorAll('input[name="autores"]'),
      function (check) { return check.checked; }
    ).map(function (check) { return check.value; });

    return {
      titulo: formulario.elements.titulo.value,
      isbn: formulario.elements.isbn.value,
      precio: formulario.elements.precio.value,
      editorial: formulario.elements.editorial.value,
      genero: formulario.elements.genero.value,
      autores: autores
    };
  }

  function iniciarFormularioLibro(alCambiar) {
    var formulario = document.getElementById('form-libro');
    var resumen = document.getElementById('errores-libro');
    var resultado = document.getElementById('resultado-libro');
    var store = Libreria.store;

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      limpiarErrores(formulario, resumen);
      ocultarResultado(resultado);

      var validacion = Libreria.libros.validarLibro(datosLibro(formulario), {
        libros: store.getLibros(),
        editoriales: store.getEditoriales(),
        generos: store.getGeneros(),
        autores: store.getAutores()
      });

      if (validacion.libro === null) {
        mostrarErrores(formulario, resumen, 'libro', validacion.errores);
        mostrarResultado(resultado, 'No se guardó el libro: revisá los campos marcados.', true);
        return;
      }

      var guardado = store.agregarLibro(validacion.libro);
      formulario.reset();
      alCambiar();
      mostrarResultado(resultado, 'Libro «' + guardado.titulo + '» guardado correctamente.', false);
      formulario.elements.titulo.focus();
    });

    formulario.addEventListener('reset', function () {
      limpiarErrores(formulario, resumen);
      ocultarResultado(resultado);
    });
  }

  function iniciarFormularioCliente(alCambiar) {
    var formulario = document.getElementById('form-cliente');
    var resumen = document.getElementById('errores-cliente');
    var resultado = document.getElementById('resultado-cliente');
    var store = Libreria.store;

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      limpiarErrores(formulario, resumen);
      ocultarResultado(resultado);

      var validacion = Libreria.clientes.validarCliente({
        nombre: formulario.elements.nombre.value,
        email: formulario.elements.email.value
      }, store.getClientes());

      if (validacion.cliente === null) {
        mostrarErrores(formulario, resumen, 'cliente', validacion.errores);
        mostrarResultado(resultado, 'No se guardó el cliente: revisá los campos marcados.', true);
        return;
      }

      var guardado = store.agregarCliente(validacion.cliente);
      formulario.reset();
      alCambiar();
      mostrarResultado(resultado, 'Cliente «' + guardado.nombreCompleto + '» guardado correctamente.', false);
      formulario.elements.nombre.focus();
    });

    formulario.addEventListener('reset', function () {
      limpiarErrores(formulario, resumen);
      ocultarResultado(resultado);
    });
  }

  Libreria.forms = {
    iniciarFormularioLibro: iniciarFormularioLibro,
    iniciarFormularioCliente: iniciarFormularioCliente
  };
})();
