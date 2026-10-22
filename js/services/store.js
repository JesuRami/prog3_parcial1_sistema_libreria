/* Estado en memoria de la aplicación.
   Parte de una copia de los datos iniciales para no modificar el seed.
   La persistencia en localStorage se agrega en el Ejercicio 6. */
(function () {
  'use strict';

  var seed = window.Libreria.seed;

  function copiar(coleccion) {
    return JSON.parse(JSON.stringify(coleccion));
  }

  var estado = {
    editoriales: copiar(seed.editoriales),
    generos: copiar(seed.generos),
    autores: copiar(seed.autores),
    libros: copiar(seed.libros),
    clientes: copiar(seed.clientes)
  };

  function buscarPorId(coleccion, id) {
    for (var i = 0; i < coleccion.length; i++) {
      if (coleccion[i].id === id) {
        return coleccion[i];
      }
    }
    return null;
  }

  window.Libreria.store = {
    getEditoriales: function () { return estado.editoriales; },
    getGeneros: function () { return estado.generos; },
    getAutores: function () { return estado.autores; },
    getLibros: function () { return estado.libros; },
    getClientes: function () { return estado.clientes; },
    buscarPorId: buscarPorId
  };
})();
