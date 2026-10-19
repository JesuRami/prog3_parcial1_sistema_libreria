# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|--------|---------------|---------|
| **SPA de una vista con secciones** | `index.html` con 5 `<section>` bajo `<main>` | La consigna permite páginas o secciones; una sola página cumple con el punto de entrada único y simplifica la navegación y el README. |
| **Store central en memoria (fuente única de verdad)** | `js/services/store.js` | Toda vista lee del mismo estado; evita duplicar datos entre módulos y permite re-renderizar de forma consistente tras cada alta o confirmación. |
| **Repositorio de persistencia** | `js/services/storage.js` | Aísla el acceso a `localStorage` (lectura, escritura, sembrado idempotente, recuperación ante JSON corrupto). El dominio no sabe que existe `localStorage`. |
| **Render por proyección** | `js/ui/render.js` | El catálogo y los listados se construyen a partir de los arrays, no desde HTML estático (RN-CAT-04). Cada entidad tiene una función de proyección (libro → vista de catálogo, renglón → fila). |
| **Escritura segura en el DOM** | `textContent` / `createElement` en `js/ui/render.js` | Los datos escritos por el usuario se insertan **como texto**, nunca como HTML (RN-TEC-09, RN-LIB-15). |
| **Event delegation** | Listeners en contenedores (catálogo, listados, historial, renglones) | Un solo listener por vista en lugar de uno por fila; sobrevive al re-render y mantiene el código acotado. |
| **Módulos de dominio con funciones puras** | `js/domain/*.js` | Validaciones y cálculos separados de la DOM: reglas testeables de forma aislada y reutilizables. |
| **Snack/toast + región `aria-live`** para mensajes | `js/ui/forms.js` | Un único lugar para los mensajes de éxito, rechazo y lista vacía, con foco visible y texto legible (RN-UI-05, RN-UI-13). |
| **Snapshot / desnormalización controlada** | `Venta.renglones[].precioUnitario`, `libroTitulo`, `Venta.clienteNombre` | Garantiza que el historial sea inmutable frente a cambios del catálogo (RN-VTA-11, RN-HIS-03). |
| **Seed idempotente** | `js/data/seed.js` + arranque | La semilla se escribe solo si la clave de la colección no existe ⇒ recargar nunca duplica los datos iniciales (RN-PER-03). |
| **CSS por tokens + componentes** | `css/base.css`, `css/layout.css`, `css/components.css`, `css/responsive.css` | Identidad visual coherente y reutilización de clases (RN-UI-06, RN-UI-07). |
| **Contenedor con scroll propio para tablas** | `.tabla-envoltura { overflow-x: auto; }` | La tabla ancha se desplaza dentro de sí misma sin generar scroll horizontal de página (RN-UI-11). |

## Estructura de directorios

```
sistema-libreria/
├── index.html                     # punto de entrada (DD-08: SPA con 5 secciones)
├── README.md                      # entrega: autores, apertura, navegación, casos manuales
├── css/
│   ├── base.css                   # reset, custom properties, tipografía, foco visible
│   ├── layout.css                 # header / nav / main, grilla y flex del layout
│   ├── components.css             # tarjetas, formularios, botones, tablas, badges, mensajes
│   └── responsive.css             # media queries 320px / 768px / 1280px
├── js/
│   ├── data/
│   │   └── seed.js                # datos iniciales ficticios (6+ libros, 2 editor., 2 gén., 3 aut., 3 client.)
│   ├── services/
│   │   ├── store.js               # estado en memoria + API interna (getters y altas)
│   │   └── storage.js             # localStorage: leer, escribir, sembrar, recuperar
│   ├── domain/
│   │   ├── catalogo.js            # filtrado por título + proyección de la vista de catálogo
│   │   ├── libros.js              # validaciones del alta de libros
│   │   ├── clientes.js            # validaciones del alta de clientes
│   │   └── ventas.js              # renglones, cálculos, confirmación
│   ├── ui/
│   │   ├── render.js              # construcción del DOM (textContent)
│   │   ├── forms.js               # binding de formularios, errores y mensajes
│   │   └── nav.js                 # navegación entre vistas
│   └── main.js                    # arranque: seed → persistencia → render inicial
└── assets/
    └── img/                       # recursos locales (portadas, íconos propios)
```

### Correspondencia con el formato de entrega exigido

| Exigido por la consigna | Presente en la estructura |
|--------------------------|---------------------------|
| `index.html` | `index.html` |
| "los demás HTML si corresponden" | No aplica: SPA de una vista (se documenta la decisión en `09`) |
| carpeta de CSS | `css/` |
| carpeta de JavaScript | `js/` |
| recursos locales | `assets/` |
| `README.md` | `README.md` |
| "sin dependencias instaladas ni herramientas de compilación" | No hay `package.json`, ni `node_modules`, ni bundler |

## Seguridad

| Aspecto | Enfoque |
|---------|---------|
| **Autenticación** | **No aplica.** La consigna dice explícitamente que no se requiere un inicio de sesión real. No hay usuarios, sesiones, cookies ni tokens. |
| **Autorización** | **No aplica.** Un único rol implícito (operador) con permisos completos sobre los datos de su navegador. Ver la matriz en `03_actores_y_roles.md`. |
| **Validación de input** | Validación en JavaScript **en el cliente**, en el módulo de dominio, con mensajes en texto cerca del formulario. La consigna es explícita: son validaciones de práctica y "no representan seguridad ni integridad garantizada por un servidor" (RN-EXC-01). |
| **Inyección en el DOM** | Mitigada por construcción: los datos de usuario se insertan con `textContent` / `value`, nunca con `innerHTML` ni `insertAdjacentHTML` (RN-TEC-09). Los textos de error se construyen con `textContent` también. |
| **Almacenamiento de datos** | `localStorage` es de solo texto, accesible desde cualquier script de la misma origen: es adecuado para datos ficticios de práctica y **no** para información sensible. El README debe declarar este límite (RN-PER-04). |
| **Secrets management** | **No aplica.** No hay claves, tokens, credenciales ni configuración sensible. No hay `.env`, ni variables de entorno, ni backend. |
| **Dependencias externas** | Cero. Sin CDNs, sin librerías, sin frameworks ⇒ sin superficie de ataque de terceros y sin peticiones salientes. |
| **Verificación de integridad referencial** | Las validaciones comprueban que editorial, género, autores, libro y cliente existan en los datos locales, aun si el DOM fue manipulado (RN-LIB-07, RN-LIB-08, RN-LIB-10, RN-VTA-01, RN-VTA-02). |

## Variables de entorno

**No aplica: el proyecto no usa variables de entorno.** No hay proceso de build, ni servidor, ni configuración por ambiente, ni secretos.

| Variable | Descripción | Ejemplo | Sensible |
|----------|-------------|---------|----------|
| — | — | — | — |

### Configuración equivalente realmente usada

Como no hay variables de entorno, la configuración es **estática en el código**:

| Elemento | Ubicación propuesta | Sensible |
|----------|--------------------|----------|
| Claves de `localStorage` | `js/services/storage.js` (constante `PREFIJO = 'libreria.'`) | No |
| Seed de datos | `js/data/seed.js` | No |
| Mensajes de error y de resultado | `js/domain/*.js` (o un módulo `js/ui/mensajes.js`) | No |
| Paleta y escalas de espaciado/tipografía | `css/base.css` (custom properties CSS) | No |

## Accesibilidad — decisiones asociadas

- Foco visible por defecto: `:focus-visible` con contorno de alto contraste en `css/base.css`.
- Errores con texto **y** icono/estilo (nunca solo color); cada error se anuncia en una región `aria-live="polite"`.
- Cada campo con `<label for>`; los grupos de checkboxes de autores usan `<fieldset>` + `<legend>`.
- Tablas con `<thead>`, `<th scope="col">` y `<caption>` cuando aportan contexto.
- Navegación por teclado nativa (`<nav>` con enlaces y botones `<button type="button">`).
- Imágenes informativas con `alt` descriptivo; decorativas con `alt=""` y `aria-hidden="true"`.
