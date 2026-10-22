/* Lógica del catálogo (Ejercicio 3): filtro por título y proyección de un
   libro a los datos que muestra la vista. No toca el DOM. */
(function () {
  'use strict';

  var SIN_CLASIFICAR = 'Sin clasificar';

  function normalizarBusqueda(texto) {
    return String(texto).trim().toLowerCase();
  }

  // Búsqueda vacía devuelve todos los libros; si no, coincidencias parciales
  // en el título sin distinguir mayúsculas de minúsculas.
  function filtrarPorTitulo(libros, texto) {
    var busqueda = normalizarBusqueda(texto);
    if (busqueda === '') {
      return libros.slice();
    }
    return libros.filter(function (libro) {
      return libro.titulo.toLowerCase().indexOf(busqueda) !== -1;
    });
  }

  function formatearPrecio(precio) {
    return '$ ' + Number(precio).toFixed(2);
  }

  // `contexto` trae las colecciones para resolver las relaciones del libro.
  function proyectarLibro(libro, contexto) {
    var buscar = window.Libreria.store.buscarPorId;
    var editorial = buscar(contexto.editoriales, libro.editorialId);
    var genero = libro.generoId === null ? null : buscar(contexto.generos, libro.generoId);
    var nombresAutores = libro.autorIds.map(function (autorId) {
      var autor = buscar(contexto.autores, autorId);
      return autor ? autor.nombre : '';
    }).filter(function (nombre) {
      return nombre !== '';
    });

    return {
      id: libro.id,
      titulo: libro.titulo,
      isbn: libro.isbn,
      editorial: editorial ? editorial.nombre : '',
      genero: genero ? genero.nombre : SIN_CLASIFICAR,
      autores: nombresAutores.join(', '),
      precio: formatearPrecio(libro.precio)
    };
  }

  window.Libreria.catalogo = {
    SIN_CLASIFICAR: SIN_CLASIFICAR,
    normalizarBusqueda: normalizarBusqueda,
    filtrarPorTitulo: filtrarPorTitulo,
    formatearPrecio: formatearPrecio,
    proyectarLibro: proyectarLibro
  };
})();
