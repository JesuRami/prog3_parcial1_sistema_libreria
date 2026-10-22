/* Datos iniciales ficticios (Ejercicio 3).
   Cada entidad tiene un `id` estable que no cambia entre recargas.
   Relaciones de libro:
   - editorialId: obligatoria, apunta a una editorial existente.
   - generoId: opcional; `null` significa «Sin clasificar».
   - autorIds: uno o más ids de autores existentes. */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  window.Libreria.seed = {
    editoriales: [
      { id: 1, nombre: 'Editorial Astral' },
      { id: 2, nombre: 'Editorial Norte' }
    ],

    generos: [
      { id: 1, nombre: 'Ciencia ficción' },
      { id: 2, nombre: 'Ensayo' }
    ],

    autores: [
      { id: 1, nombre: 'Valeria Ortiz' },
      { id: 2, nombre: 'Nicolás Ferrari' },
      { id: 3, nombre: 'Camila Sosa' }
    ],

    libros: [
      { id: 1, titulo: 'El Jardín de las Máquinas', isbn: '978-950-0001-1', precio: 1500, editorialId: 1, generoId: 1, autorIds: [1] },
      { id: 2, titulo: 'Cartografías del Silencio', isbn: '978-950-0002-2', precio: 2000, editorialId: 2, generoId: 2, autorIds: [2] },
      { id: 3, titulo: 'Manual de Senderos', isbn: '978-950-0003-3', precio: 1800, editorialId: 1, generoId: null, autorIds: [3] },
      { id: 4, titulo: 'El Peso del Agua', isbn: '978-950-0004-4', precio: 2500, editorialId: 2, generoId: 1, autorIds: [1, 2] },
      { id: 5, titulo: 'Diarios de un Viajero', isbn: '978-950-0005-5', precio: 1200, editorialId: 1, generoId: 2, autorIds: [3] },
      { id: 6, titulo: 'Códigos y Sombras', isbn: '978-950-0006-6', precio: 3000, editorialId: 2, generoId: null, autorIds: [2, 3] }
    ],

    clientes: [
      { id: 1, nombreCompleto: 'María Gómez', email: 'maria.gomez@ejemplo.com' },
      { id: 2, nombreCompleto: 'Juan Pérez', email: 'juan.perez@ejemplo.com' },
      { id: 3, nombreCompleto: 'Lucía Ramírez', email: 'lucia.ramirez@ejemplo.com' }
    ]
  };
})();
