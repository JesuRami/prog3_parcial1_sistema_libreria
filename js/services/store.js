/* Estado en memoria de la aplicación.
   Parte de lo guardado en localStorage; si una colección no está guardada
   (primer inicio) se escribe el seed y no se vuelve a escribir al recargar:
   así no se duplican los datos iniciales (Ejercicio 6). */
(function () {
  'use strict';

  var seed = window.Libreria.seed;
  var persistencia = window.Libreria.persistencia;

  function copiar(coleccion) {
    return JSON.parse(JSON.stringify(coleccion));
  }

  function cargar(nombre, semilla) {
    var guardado = persistencia.leer(nombre);
    if (guardado !== null) {
      return guardado;
    }
    var inicial = copiar(semilla);
    persistencia.escribir(nombre, inicial);
    return inicial;
  }

  var estado = {
    editoriales: cargar('editoriales', seed.editoriales),
    generos: cargar('generos', seed.generos),
    autores: cargar('autores', seed.autores),
    libros: cargar('libros', seed.libros),
    clientes: cargar('clientes', seed.clientes),
    ventas: cargar('ventas', [])
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

  function agregar(nombre, registro) {
    var coleccion = estado[nombre];
    registro.id = siguienteId(coleccion);
    coleccion.push(registro);
    persistencia.escribir(nombre, coleccion);
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
    agregarVenta: function (venta) { return agregar('ventas', venta); },
    agregarLibro: function (libro) { return agregar('libros', libro); },
    agregarCliente: function (cliente) { return agregar('clientes', cliente); },
    // Excepción de la regla 16: la editorial nueva del alta de libro se suma
    // al conjunto local en el momento de guardar (propietario: 22/10/2026).
    agregarEditorial: function (editorial) { return agregar('editoriales', editorial); },
    // Autor nuevo desde el formulario de alta de libro (excepción de la
    // regla 16, decisión del propietario 22/10/2026).
    agregarAutor: function (autor) { return agregar('autores', autor); }
  };
})();
