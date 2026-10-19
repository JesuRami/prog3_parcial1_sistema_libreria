# Descripción General

## Stack tecnológico

| Capa | Tecnologías | Versión mínima | Origen de la restricción en la consigna |
|------|-------------|-----------------|------------------------------------------|
| Estructura | HTML5 semántico (`header`, `nav`, `main`, `section`, tablas con encabezados, formularios etiquetados) | HTML5 | *"Se utilizan únicamente HTML, CSS y JavaScript nativos"* |
| Estilos | CSS3: custom properties, Flexbox y/o Grid, media queries, clases reutilizables | CSS3 | Ejercicio 2 |
| Comportamiento | JavaScript nativo, sin dependencias | ES2020+ (**supuesto SU-01**) | *"No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript"* |
| Persistencia | API `localStorage` del navegador | — | Ejercicio 6 |
| Modelo de datos en memoria | Arrays y objetos JavaScript con identificadores estables | — | Ejercicio 3 |
| Assets | Imágenes y recursos locales incluidos en el proyecto | — | Contexto y alcance |
| Build / dependencias | Ninguno | — | *"No se incluyen dependencias instaladas ni herramientas de compilación"* |
| Backend / API / DB | Ninguno | — | *"No se requiere API, base de datos, servidor ni conexión con el backend"* |

> No hay framework, bundler, transpiler, linter, formateador, gestor de paquetes ni sistema de tests en el stack: cualquier herramienta de ese tipo violaría el alcance técnico y la consigna lo advierte explícitamente en los criterios de evaluación.

## Arquitectura general

Aplicación web de una sola página (SPA de una vista) con secciones navegables, estado en memoria y persistencia en `localStorage`.

```
┌─────────────────────────────────────────────────────────────────────┐
│ index.html  — punto de entrada único                                │
│  ├── <header>   identidad de la librería                            │
│  ├── <nav>      navegación visible entre las 5 vistas                │
│  └── <main>                                                           │
│        ├── <section id="catalogo">  buscador + grilla de libros      │
│        ├── <section id="libros">    formulario de alta + listado     │
│        ├── <section id="clientes">   formulario de alta + listado     │
│        ├── <section id="ventas">    cliente + renglones + resumen    │
│        └── <section id="historial">  listado + detalle de ventas     │
└─────────────────────────────────────────────────────────────────────┘
          │ carga ordenada de scripts nativos (sin bundler)
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ js/                                                                   │
│  ├── data/seed.js         datos iniciales ficticios                  │
│  ├── services/store.js    estado en memoria + contrato interno API   │
│  ├── services/storage.js  lectura/escritura en localStorage          │
│  ├── domain/catalogo.js   render del catálogo + filtro por título    │
│  ├── domain/libros.js     validaciones y alta de libros              │
│  ├── domain/clientes.js   validaciones y alta de clientes            │
│  ├── domain/ventas.js     renglones, cálculos, confirmación, historial│
│  ├── ui/render.js         construcción de DOM (textContent)          │
│  ├── ui/forms.js          binding de formularios y mensajes de error  │
│  ├── ui/nav.js            navegación entre vistas                     │
│  └── main.js              arranque: seed → persistencia → render     │
└─────────────────────────────────────────────────────────────────────┘
          │ read / write por colección
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ localStorage  (acotado al navegador + perfil + ubicación de apertura)│
│  ├── libreria.libros      ├── libreria.clientes                      │
│  └── libreria.ventas                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Justificación de las decisiones de alto nivel

1. **SPA de una sola página con secciones**: la consigna permite explícitamente "varias páginas o secciones de una misma página". Una sola página cumple con los dos formatos de entrega ("carpeta con `index.html`, los demás HTML si corresponden") y simplifica el punto de entrada único exigido.
2. **Scripts clásicos en orden de carga** en lugar de ES Modules: los módulos ES se bloquean por CORS al abrir `file://` en Chrome/Edge, y la consigna exige entregar pasos para abrir `index.html` **sin npm**. Ver `DD-03` en `09_decisiones_y_supuestos.md`.
3. **Store central en memoria + repositorio de `localStorage`**: separa el estado volátil de la persistencia, permite re-renderizar desde una única fuente de verdad y evita que cada módulo escriba por su cuenta en el almacenamiento del navegador.
4. **Reglas de negocio en `domain/`**: concentrations de validación y cálculo, testables de forma aislada y coherentes con la valorización de "funciones acotadas" y "separación entre estructura, estilos y comportamiento".
5. **Render con `textContent`**: el enunciado exige que "los datos escritos por usuarios se insertan como texto en el DOM"; usar `textContent` lo garantiza por construcción.
6. **Sin capa de red**: no hay `fetch`, no hay CORS, no hay estados de carga asíncrono. Toda la asincronía real es la del usuario.

## Integraciones externas

| Servicio | Propósito | Tipo |
|----------|-----------|------|
| **Ninguno** | El sistema no consume ni expone servicios externos. `localStorage` es una API del navegador, no un servicio externo. | — |

La consigna prohíbe explícitamente CDNs de CSS y JavaScript, y no requiere API, base de datos, servidor ni conexión con el backend. Cualquier recurso (fuentes, imágenes, iconos) debe ser **local** y estar incluido en el proyecto.

## API REST

**No aplica.** El sistema no expone ni consume una API: no hay servidor, rutas HTTP ni contratos de red.

El equivalente funcional es el **contrato interno de módulos** del `store`, que los módulos de dominio y de UI consumen en lugar de llamar a un backend:

| Módulo | Responsabilidad | Operaciones de referencia |
|---------|-----------------|----------------------------|
| `services/store` | Estado en memoria + sincronización con `localStorage` | `getLibros()`, `getClientes()`, `getVentas()`, `getEditoriales()`, `getGeneros()`, `getAutores()`, `agregarLibro()`, `agregarCliente()`, `agregarVenta()`, `reset()` |
| `domain/libros` | Validación del alta de libros | `validarLibro(datos, contexto) → { válido, errores }` |
| `domain/clientes` | Validación del alta de clientes | `validarCliente(datos, contexto) → { válido, errores }` |
| `domain/ventas` | Renglones, cálculos y confirmación | `agregarRenglon()`, `quitarRenglon()`, `actualizarCantidad()`, `calcularTotal()`, `confirmarVenta()` |
| `domain/catalogo` | Filtrado y proyección de la vista de catálogo | `filtrarPorTitulo(libros, texto)`, `proyectarLibro(libro, contexto)` |
| `ui/render` | Construcción de DOM | `renderCatalogo()`, `renderListadoLibros()`, `renderListadoClientes()`, `renderRenglones()`, `renderHistorial()`, `renderDetalleVenta()` |
| `ui/forms` | Binding y mensajes | `mostrarErrores()`, `limpiarErrores()`, `mostrarMensaje()` |

> Los nombres de módulo y función son **propuesta de la KB**, no texto literal de la consigna: la consigna exige "eventos y funciones con responsabilidades reconocibles" pero no fija nombres. Ver `SU-03` en `09_decisiones_y_supuestos.md`.
