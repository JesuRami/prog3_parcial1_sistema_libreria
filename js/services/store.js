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
    clientes: copiar(seed.clientes),
    ventas: []
  };

  function buscarPorId(coleccion, id) {
    for (var i = 0; i < coleccion.length; i++) {
      if (coleccion[i].id === id) {
        return coleccion[i];
      }
    }
    return null;
  }

  function siguienteId(coleccion) {
    var mayor = 0;
    coleccion.forEach(function (item) {
      if (item.id > mayor) {
        mayor = item.id;
      }
    });
    return mayor + 1;
  }

  function agregar(coleccion, registro) {
    registro.id = siguienteId(coleccion);
    coleccion.push(registro);
    return registro;
  }

  window.Libreria.store = {
    getEditoriales: function () { return estado.editoriales; },
    getGeneros: function () { return estado.generos; },
    getAutores: function () { return estado.autores; },
    getLibros: function () { return estado.libros; },
    getClientes: function () { return estado.clientes; },
    getVentas: function () { return estado.ventas; },
    buscarPorId: buscarPorId,
    agregarVenta: function (venta) { return agregar(estado.ventas, venta); },
    agregarLibro: function (libro) { return agregar(estado.libros, libro); },
    agregarCliente: function (cliente) { return agregar(estado.clientes, cliente); }
  };
})();
