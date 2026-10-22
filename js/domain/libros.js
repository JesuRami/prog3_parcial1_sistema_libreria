/* Validación del alta de libros (Ejercicio 4). No toca el DOM.
   `datos` trae los textos crudos del formulario; `contexto` las colecciones
   locales contra las que se verifica la existencia de cada relación. */
(function () {
  'use strict';

  // El ISBN se compara sin espacios ni guiones y sin distinguir mayúsculas
  // (la X final de un ISBN-10 puede venir en minúscula).
  function normalizarIsbn(isbn) {
    return String(isbn).replace(/[\s-]/g, '').toUpperCase();
  }

  function parsearPrecio(texto) {
    var limpio = String(texto).trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(limpio)) {
      return NaN;
    }
    return Number(limpio);
  }

  function existe(coleccion, id) {
    return window.Libreria.store.buscarPorId(coleccion, id) !== null;
  }

  // Devuelve { errores: { campo: mensaje }, libro }; `libro` solo si no hay errores.
  function validarLibro(datos, contexto) {
    var errores = {};
    var titulo = String(datos.titulo).trim();
    var isbn = String(datos.isbn).trim();
    var precio = parsearPrecio(datos.precio);
    var editorialId = Number(datos.editorial);
    var generoId = datos.genero === '' ? null : Number(datos.genero);
    var autorIds = datos.autores.map(Number);

    if (titulo === '') {
      errores.titulo = 'El título no puede estar vacío.';
    }

    if (normalizarIsbn(isbn) === '') {
      errores.isbn = 'El ISBN no puede estar vacío.';
    } else {
      var repetido = contexto.libros.some(function (libro) {
        return normalizarIsbn(libro.isbn) === normalizarIsbn(isbn);
      });
      if (repetido) {
        errores.isbn = 'Ya existe un libro con ese ISBN.';
      }
    }

    if (String(datos.precio).trim() === '') {
      errores.precio = 'El precio no puede estar vacío.';
    } else if (isNaN(precio)) {
      errores.precio = 'El precio debe ser un número. Ejemplo: 1500.50';
    } else if (precio <= 0) {
      errores.precio = 'El precio debe ser mayor que cero.';
    }

    if (datos.editorial === '') {
      errores.editorial = 'Elegí una editorial.';
    } else if (!existe(contexto.editoriales, editorialId)) {
      errores.editorial = 'La editorial elegida no existe.';
    }

    if (generoId !== null && !existe(contexto.generos, generoId)) {
      errores.genero = 'El género elegido no existe.';
    }

    if (autorIds.length === 0) {
      errores.autores = 'Elegí al menos un autor.';
    } else if (!autorIds.every(function (id) { return existe(contexto.autores, id); })) {
      errores.autores = 'Alguno de los autores elegidos no existe.';
    }

    if (Object.keys(errores).length > 0) {
      return { errores: errores, libro: null };
    }
    return {
      errores: errores,
      libro: {
        titulo: titulo,
        isbn: isbn,
        precio: precio,
        editorialId: editorialId,
        generoId: generoId,
        autorIds: autorIds
      }
    };
  }

  window.Libreria.libros = {
    normalizarIsbn: normalizarIsbn,
    parsearPrecio: parsearPrecio,
    validarLibro: validarLibro
  };
})();
