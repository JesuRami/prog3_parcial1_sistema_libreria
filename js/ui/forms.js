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

    iniciarAltaAutorNuevo();

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

      var libro = validacion.libro;
      // Editorial nueva: se suma al conjunto local en el mismo alta, para que
      // el libro quede relacionado con una editorial existente (consigna,
      // Ejercicio 4: «la editorial … existan en los datos locales»).
      var mensaje = 'Libro «' + libro.titulo + '» guardado correctamente.';
      if (libro.editorialNueva) {
        var editorialNueva = store.agregarEditorial({ nombre: libro.editorialNueva });
        libro.editorialId = editorialNueva.id;
        mensaje += ' Editorial nueva agregada: «' + editorialNueva.nombre + '».';
        delete libro.editorialNueva;
      }

      var guardado = store.agregarLibro(libro);
      formulario.reset();
      alCambiar();
      mostrarResultado(resultado, mensaje, false);
      formulario.elements.titulo.focus();
    });

    formulario.addEventListener('reset', function () {
      limpiarErrores(formulario, resumen);
      ocultarResultado(resultado);
    });
  }

  // Alta de un autor nuevo desde el formulario de libro (excepción de la
  // regla 16): se suma al conjunto local y aparece marcado en las casillas,
  // listo para combinarse con cualquier otro autor en el mismo alta.
  // Resuelve sus propias dependencias (store, textos, render): no depende
  // de variables locales de otra función.
  function iniciarAltaAutorNuevo() {
    var entrada = document.getElementById('autor-nuevo');
    var boton = document.getElementById('agregar-autor');
    var aviso = document.getElementById('error-autor-nuevo');
    var casillas = document.querySelector('#libro-autores .lista-check');
    var sugerencias = document.getElementById('opciones-autores');
    var store = Libreria.store;

    if (!entrada || !boton || !aviso || !casillas || !sugerencias) {
      return;
    }

    function agregarNuevoAutor() {
      aviso.textContent = '';
      entrada.removeAttribute('aria-invalid');
      var nombre = entrada.value.replace(/\s+/g, ' ').trim();
      if (nombre === '') {
        aviso.textContent = 'Escribí el nombre del autor nuevo.';
        entrada.setAttribute('aria-invalid', 'true');
        entrada.focus();
        return;
      }

      var clave = Libreria.libros.claveDeNombre(nombre);
      var existente = null;
      store.getAutores().forEach(function (autor) {
        if (Libreria.libros.claveDeNombre(autor.nombre) === clave) {
          existente = autor;
        }
      });
      if (existente) {
        aviso.textContent = '«' + existente.nombre + '» ya está en la lista: marcalo en las casillas.';
        entrada.setAttribute('aria-invalid', 'true');
        entrada.focus();
        return;
      }

      var creado = store.agregarAutor({ nombre: nombre });
      entrada.value = '';
      Libreria.render.renderAutores(casillas, store.getAutores(), creado.id);
      Libreria.render.renderDatalist(sugerencias, store.getAutores(), function (a) { return a.nombre; });
      entrada.focus();
    }

    boton.addEventListener('click', agregarNuevoAutor);
    // Enter en el campo agrega el autor en lugar de enviar el libro.
    entrada.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        agregarNuevoAutor();
      }
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
