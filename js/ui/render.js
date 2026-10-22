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
    agregarDato(datos, 'Autor, es', libro.autores);
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

  function crearOpcion(valor, texto) {
    var opcion = document.createElement('option');
    opcion.value = String(valor);
    opcion.textContent = texto;
    return opcion;
  }

  // Reconstruye un <select> conservando su primera opción (el marcador
  // «Elegí…» / «Sin clasificar») y la selección previa si todavía existe.
  function renderOpciones(select, items, obtenerTexto) {
    var previo = select.value;
    while (select.options.length > 1) {
      select.remove(1);
    }
    items.forEach(function (item) {
      select.appendChild(crearOpcion(item.id, obtenerTexto(item)));
    });
    select.value = previo;
  }

  // Reconstruye las sugerencias de un <datalist> en orden alfabético
  // (insensible a mayúsculas y tildes). No toca el valor del <input>
  // asociado, para no corromper lo que el usuario esté escribiendo.
  function renderDatalist(datalist, items, obtenerTexto) {
    var textos = items.map(function (item) {
      return obtenerTexto(item);
    });
    textos.sort(function (a, b) {
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    });
    vaciar(datalist);
    textos.forEach(function (texto) {
      var opcion = document.createElement('option');
      opcion.value = texto;
      datalist.appendChild(opcion);
    });
  }

  // Reconstruye el grupo de casillas de autores. La lista se muestra en
  // orden alfabético (insensible a mayúsculas y tildes) y conserva las
  // casillas que el usuario ya había marcado; `resaltarId` fuerza la
  // marca del autor recién agregado.
  function renderAutores(contenedor, autores, resaltarId) {
    var marcados = Array.prototype.filter.call(
      contenedor.querySelectorAll('input[name="autores"]'),
      function (check) { return check.checked; }
    ).map(function (check) { return check.value; });

    var ordenados = autores.slice().sort(function (a, b) {
      return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });
    vaciar(contenedor);
    ordenados.forEach(function (autor) {
      var item = document.createElement('li');
      var etiqueta = crearElemento('label', undefined, 'check');
      var check = document.createElement('input');
      check.type = 'checkbox';
      check.name = 'autores';
      check.value = String(autor.id);
      check.checked = marcados.indexOf(check.value) !== -1 || autor.id === resaltarId;
      etiqueta.appendChild(check);
      etiqueta.appendChild(document.createTextNode(' ' + autor.nombre));
      item.appendChild(etiqueta);
      contenedor.appendChild(item);
    });
  }

  function renderTabla(cuerpo, mensajeVacio, filas) {
    vaciar(cuerpo);
    filas.forEach(function (celdas) {
      var fila = document.createElement('tr');
      celdas.forEach(function (celda) {
        fila.appendChild(crearElemento('td', celda.texto, celda.clase));
      });
      cuerpo.appendChild(fila);
    });
    mensajeVacio.hidden = filas.length !== 0;
  }

  // `libros` ya viene proyectado (textos listos para mostrar).
  function renderTablaLibros(libros) {
    renderTabla(
      document.getElementById('tabla-libros'),
      document.getElementById('msg-libros-vacio'),
      libros.map(function (l) {
        return [
          { texto: l.titulo }, { texto: l.isbn }, { texto: l.editorial },
          { texto: l.genero }, { texto: l.autores }, { texto: l.precio, clase: 'num' }
        ];
      })
    );
  }

  function renderTablaClientes(clientes) {
    renderTabla(
      document.getElementById('tabla-clientes'),
      document.getElementById('msg-clientes-vacio'),
      clientes.map(function (c) {
        return [{ texto: c.nombreCompleto }, { texto: c.email }];
      })
    );
  }

  window.Libreria.render = {
    renderCatalogo: renderCatalogo,
    renderOpciones: renderOpciones,
    renderDatalist: renderDatalist,
    renderAutores: renderAutores,
    renderTablaLibros: renderTablaLibros,
    renderTablaClientes: renderTablaClientes
  };
})();
