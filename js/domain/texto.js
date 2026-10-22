/* Utilidades de texto compartidas por el dominio: comparación de nombres
   insensible a mayúsculas y tildes (usada por el filtro del catálogo y por
   el control anti-redundante del alta de libros). */
(function () {
  'use strict';

  // Quita los acentos diacríticos (á=a, é=e, í=i, ó=o, ú=u, ü=u). La ñ y
  // la Ñ se recomponen antes: su virgulilla (U+0303) es parte de la letra
  // y no debe confundirse con una n sin tilde.
  function quitarTildes(texto) {
    var descompuesto = String(texto).normalize('NFD');
    descompuesto = descompuesto.replace(/N\u0303/g, '\u00d1');
    descompuesto = descompuesto.replace(/n\u0303/g, '\u00f1');
    return descompuesto.replace(/[\u0300-\u036f]/g, '');
  }

  window.Libreria.texto = {
    quitarTildes: quitarTildes
  };
})();
