/* Persistencia de las colecciones en localStorage (Ejercicio 6).
   Cada colección se guarda como JSON bajo una clave propia: `libreria.<nombre>`.
   Reglas (knowledge-base/04_modelo_de_datos.md § Estructura de persistencia):
   - Semilla idempotente: la primera vez se escribe el seed; las siguientes se
     lee lo guardado y no se reescribe, así no se duplican los datos iniciales.
   - Corrupción: si el JSON no se puede parsear o no es un array, se descarta
     esa colección y quien llama vuelve a cargar el seed.
   - Sin datos sensibles: todo el contenido es ficticio y de práctica. */
(function () {
  'use strict';

  var PREFIJO = 'libreria.';

  function clave(nombre) {
    return PREFIJO + nombre;
  }

  // Devuelve el array guardado, o null si la clave no existe, el valor no es
  // un array o el JSON está corrupto. Nunca lanza: el arranque siempre sigue.
  function leer(nombre) {
    var crudo;
    try {
      crudo = window.localStorage.getItem(clave(nombre));
    } catch (e) {
      return null; // localStorage bloqueado por el navegador
    }
    if (crudo === null) {
      return null;
    }
    try {
      var valor = JSON.parse(crudo);
      return Array.isArray(valor) ? valor : null;
    } catch (e) {
      return null;
    }
  }

  // Guarda la colección completa. Devuelve false si el navegador no permite
  // escribir (modo privado, cuota llena): la aplicación continúa en memoria y
  // la operación del usuario no se interrumpe.
  function escribir(nombre, valor) {
    try {
      window.localStorage.setItem(clave(nombre), JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Comprueba si el navegador permite leer y escribir. Se usa solo para el
  // aviso de la interfaz: las operaciones reales ya toleran fallos.
  function disponible() {
    try {
      var prueba = clave('__prueba');
      window.localStorage.setItem(prueba, '1');
      var leido = window.localStorage.getItem(prueba);
      window.localStorage.removeItem(prueba);
      return leido === '1';
    } catch (e) {
      return false;
    }
  }

  window.Libreria.persistencia = {
    clave: clave,
    disponible: disponible,
    leer: leer,
    escribir: escribir
  };
})();
