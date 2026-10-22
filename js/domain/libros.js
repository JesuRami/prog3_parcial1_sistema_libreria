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

  // Los nombres se comparan sin mayúsculas, sin tildes y con los espacios
  // colapsados, para no dar de alta editoriales duplicadas por tipeo.
  function claveDeNombre(nombre) {
    return window.Libreria.texto.quitarTildes(nombre)
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Devuelve la editorial del conjunto local cuyo nombre coincide con el
  // texto escrito (sin distinguir mayúsculas ni tildes), o null si no está:
  // en ese caso es una editorial nueva y se suma al conjunto al guardar.
  function buscarEditorialPorNombre(texto, editoriales) {
    var clave = claveDeNombre(texto);
    if (clave === '') {
      return null;
    }
    for (var i = 0; i < editoriales.length; i++) {
      if (claveDeNombre(editoriales[i].nombre) === clave) {
        return editoriales[i];
      }
    }
    return null;
  }

  // Devuelve { errores: { campo: mensaje }, libro }; `libro` solo si no hay errores.
  function validarLibro(datos, contexto) {
    var errores = {};
    var titulo = String(datos.titulo).trim();
    var isbn = String(datos.isbn).trim();
    var precio = parsearPrecio(datos.precio);
    var editorialExistente = String(datos.editorial).trim() === ''
      ? null
      : buscarEditorialPorNombre(datos.editorial, contexto.editoriales);
    var nombreEditorial = String(datos.editorial).replace(/\s+/g, ' ').trim();
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

    if (String(datos.editorial).trim() === '') {
      errores.editorial = 'La editorial no puede estar vacía.';
    }
    // Si el texto no coincide con ninguna editorial del conjunto local es
    // una editorial nueva: se acepta y se suma al conjunto al guardar el
    // libro (excepción de la regla 16, decisión del propietario 22/10/2026).

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
        editorialId: editorialExistente ? editorialExistente.id : null,
        editorialNueva: editorialExistente ? null : nombreEditorial,
        generoId: generoId,
        autorIds: autorIds
      }
    };
  }

  window.Libreria.libros = {
    normalizarIsbn: normalizarIsbn,
    parsearPrecio: parsearPrecio,
    claveDeNombre: claveDeNombre,
    buscarEditorialPorNombre: buscarEditorialPorNombre,
    validarLibro: validarLibro
  };
})();
