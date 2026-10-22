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
    aviso.textContent = 'El catálogo ya usa los datos locales y el buscador por título. Las demás vistas siguen siendo maqueta con ejemplos estáticos.';
  }

  function iniciar() {
    var formulario = document.getElementById('form-busqueda');
    var campo = document.getElementById('busqueda-titulo');

    formulario.addEventListener('submit', alEnviarBusqueda);
    formulario.addEventListener('reset', alLimpiarBusqueda);
    campo.addEventListener('input', actualizarCatalogo);

    actualizarAvisoDeMaqueta();
    actualizarCatalogo();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
