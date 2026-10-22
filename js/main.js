/* Arranque de la aplicación y eventos del catálogo (Ejercicio 3). */
(function () {
  'use strict';

  var Libreria = window.Libreria;

  function actualizarCatalogo() {
    var campo = document.getElementById('busqueda-titulo');
    var texto = campo.value;
    var libros = Libreria.store.getLibros();
    var contexto = {
      editoriales: Libreria.store.getEditoriales(),
      generos: Libreria.store.getGeneros(),
      autores: Libreria.store.getAutores()
    };
    var proyectados = Libreria.catalogo.filtrarPorTitulo(libros, texto).map(function (libro) {
      return Libreria.catalogo.proyectarLibro(libro, contexto);
    });
    var hayBusqueda = Libreria.catalogo.normalizarBusqueda(texto) !== '';

    Libreria.render.renderCatalogo(proyectados, libros.length, hayBusqueda);
  }

  function alEnviarBusqueda(evento) {
    evento.preventDefault();
    actualizarCatalogo();
  }

  // El evento reset se dispara antes de vaciar el campo: se espera al
  // siguiente ciclo para leer el valor ya limpio.
  function alLimpiarBusqueda() {
    setTimeout(actualizarCatalogo, 0);
  }

  function actualizarAvisoDeMaqueta() {
    var aviso = document.getElementById('aviso-maqueta');
    aviso.textContent = 'Catálogo, altas, ventas e historial ya funcionan con los datos locales. Todavía no se guardan en localStorage: al recargar la página se pierden los registros nuevos.';
  }

  // Redibuja todo lo que depende de libros y clientes, sin recargar la página.
  function actualizarListadosYOpciones() {
    var store = Libreria.store;
    var contexto = {
      editoriales: store.getEditoriales(),
      generos: store.getGeneros(),
      autores: store.getAutores()
    };
    var clientes = store.getClientes();
    var libros = store.getLibros();

    Libreria.render.renderTablaLibros(libros.map(function (libro) {
      return Libreria.catalogo.proyectarLibro(libro, contexto);
    }));
    Libreria.render.renderTablaClientes(clientes);

    Libreria.render.renderOpciones(document.getElementById('libro-editorial'), contexto.editoriales, function (e) { return e.nombre; });
    Libreria.render.renderOpciones(document.getElementById('libro-genero'), contexto.generos, function (g) { return g.nombre; });
    Libreria.render.renderAutores(document.querySelector('#libro-autores .lista-check'), contexto.autores);

    Libreria.render.renderOpciones(document.getElementById('venta-cliente'), clientes, function (c) { return c.nombreCompleto; });
    Libreria.render.renderOpciones(document.getElementById('venta-libro'), libros, function (l) { return l.titulo; });

    actualizarCatalogo();
  }

  function iniciar() {
    var formulario = document.getElementById('form-busqueda');
    var campo = document.getElementById('busqueda-titulo');

    formulario.addEventListener('submit', alEnviarBusqueda);
    formulario.addEventListener('reset', alLimpiarBusqueda);
    campo.addEventListener('input', actualizarCatalogo);

    Libreria.forms.iniciarFormularioLibro(actualizarListadosYOpciones);
    Libreria.forms.iniciarFormularioCliente(actualizarListadosYOpciones);
    Libreria.ventasUi.iniciar();

    actualizarAvisoDeMaqueta();
    actualizarListadosYOpciones();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
