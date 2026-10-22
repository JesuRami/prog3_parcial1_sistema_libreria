/* Construcción de DOM. Todo texto se inserta con textContent, nunca con
   innerHTML, para que los datos escritos por usuarios se muestren como texto. */
(function () {
  'use strict';

  function crearElemento(etiqueta, texto, clase) {
    var elemento = document.createElement(etiqueta);
    if (texto !== undefined) {
      elemento.textContent = texto;
    }
    if (clase) {
      elemento.className = clase;
    }
    return elemento;
  }

  function vaciar(contenedor) {
    while (contenedor.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }
  }

  function agregarDato(lista, termino, descripcion, claseDescripcion) {
    lista.appendChild(crearElemento('dt', termino));
    lista.appendChild(crearElemento('dd', descripcion, claseDescripcion));
  }

  function crearTarjetaLibro(libro) {
    var item = document.createElement('li');
    var tarjeta = crearElemento('article', undefined, 'tarjeta tarjeta-libro');
    var datos = crearElemento('dl', undefined, 'datos');

    tarjeta.appendChild(crearElemento('h3', libro.titulo));
    agregarDato(datos, 'ISBN', libro.isbn);
    agregarDato(datos, 'Editorial', libro.editorial);
    agregarDato(datos, 'Género', libro.genero);
    agregarDato(datos, 'Autores', libro.autores);
    agregarDato(datos, 'Precio', libro.precio, 'precio');
    tarjeta.appendChild(datos);
    item.appendChild(tarjeta);
    return item;
  }

  function textoContador(mostrados, total, hayBusqueda) {
    var palabra = total === 1 ? 'libro' : 'libros';
    if (hayBusqueda) {
      return 'Mostrando ' + mostrados + ' de ' + total + ' ' + palabra + '.';
    }
    return 'Mostrando ' + mostrados + ' ' + palabra + '.';
  }

  // `libros` ya viene proyectado y filtrado; `total` es la cantidad de libros
  // del catálogo completo, para distinguir «sin libros» de «sin resultados».
  function renderCatalogo(libros, total, hayBusqueda) {
    var lista = document.getElementById('lista-catalogo');
    var contador = document.getElementById('catalogo-contador');
    var mensajeVacio = document.getElementById('msg-catalogo-vacio');
    var mensajeSinResultados = document.getElementById('msg-catalogo-sin-resultados');

    vaciar(lista);
    libros.forEach(function (libro) {
      lista.appendChild(crearTarjetaLibro(libro));
    });

    contador.textContent = textoContador(libros.length, total, hayBusqueda);
    mensajeVacio.hidden = total !== 0;
    mensajeSinResultados.hidden = !(total > 0 && libros.length === 0);
  }

  window.Libreria.render = {
    renderCatalogo: renderCatalogo
  };
})();
