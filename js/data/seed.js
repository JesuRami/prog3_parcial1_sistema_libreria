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

    // Géneros en orden alfabético: los 2 iniciales + los 28 agregados a
    // pedido del propietario (22/10/2026), sin duplicados. Los ids se
    // renumeraron por posición alfabética y las relaciones del seed se
    // actualizaron al mismo tiempo, para mantener la integridad referencial.
    generos: [
      { id: 1, nombre: 'Actualidad' },
      { id: 2, nombre: 'Arte' },
      { id: 3, nombre: 'Autoayuda' },
      { id: 4, nombre: 'Aventura' },
      { id: 5, nombre: 'Biografía' },
      { id: 6, nombre: 'Ciencia' },
      { id: 7, nombre: 'Ciencia ficción' },
      { id: 8, nombre: 'Cocina' },
      { id: 9, nombre: 'Comedia' },
      { id: 10, nombre: 'Distopía' },
      { id: 11, nombre: 'Divulgativo' },
      { id: 12, nombre: 'Economía' },
      { id: 13, nombre: 'Ensayo' },
      { id: 14, nombre: 'Épica' },
      { id: 15, nombre: 'Fábula' },
      { id: 16, nombre: 'Fantasía' },
      { id: 17, nombre: 'Filosofía' },
      { id: 18, nombre: 'Historia' },
      { id: 19, nombre: 'Leyenda' },
      { id: 20, nombre: 'Manual' },
      { id: 21, nombre: 'Misterio' },
      { id: 22, nombre: 'Poesía' },
      { id: 23, nombre: 'Romance' },
      { id: 24, nombre: 'Salud y deporte' },
      { id: 25, nombre: 'Sociedad' },
      { id: 26, nombre: 'Teatro' },
      { id: 27, nombre: 'Thriller' },
      { id: 28, nombre: 'Tragedia' },
      { id: 29, nombre: 'Tragicomedia' },
      { id: 30, nombre: 'Viajes' }
    ],

    autores: [
      { id: 1, nombre: 'Valeria Ortiz' },
      { id: 2, nombre: 'Nicolás Ferrari' },
      { id: 3, nombre: 'Camila Sosa' }
    ],

    libros: [
      { id: 1, titulo: 'El Jardín de las Máquinas', isbn: '978-950-0001-1', precio: 1500, editorialId: 1, generoId: 7, autorIds: [1] },
      { id: 2, titulo: 'Cartografías del Silencio', isbn: '978-950-0002-2', precio: 2000, editorialId: 2, generoId: 13, autorIds: [2] },
      { id: 3, titulo: 'Manual de Senderos', isbn: '978-950-0003-3', precio: 1800, editorialId: 1, generoId: null, autorIds: [3] },
      { id: 4, titulo: 'El Peso del Agua', isbn: '978-950-0004-4', precio: 2500, editorialId: 2, generoId: 7, autorIds: [1, 2] },
      { id: 5, titulo: 'Diarios de un Viajero', isbn: '978-950-0005-5', precio: 1200, editorialId: 1, generoId: 13, autorIds: [3] },
      { id: 6, titulo: 'Códigos y Sombras', isbn: '978-950-0006-6', precio: 3000, editorialId: 2, generoId: null, autorIds: [2, 3] }
    ],

    clientes: [
      { id: 1, nombreCompleto: 'María Gómez', email: 'maria.gomez@ejemplo.com' },
      { id: 2, nombreCompleto: 'Juan Pérez', email: 'juan.perez@ejemplo.com' },
      { id: 3, nombreCompleto: 'Lucía Ramírez', email: 'lucia.ramirez@ejemplo.com' }
    ]
  };
})();
