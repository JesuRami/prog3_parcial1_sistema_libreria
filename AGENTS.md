# prog3_parcial1_sistema_libreria — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado por la skill `agent-instruction` a partir de `knowledge-base/`, `CHANGES.md` y la consigna oficial (`docs/consignas_parcial.pdf`). No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

Fuente: `knowledge-base/02_descripcion_general.md` § Stack tecnológico (tabla copiada, con la procedencia de cada restricción).

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

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

### Cómo ejecutar el proyecto

1. **Doble clic en `index.html`** → se abre en el navegador por `file://`. Ese es todo el arranque.
2. **No hay servidor, ni `npm`, ni build, ni paso de compilación**: no existe `package.json`, `node_modules`, bundler ni transpiler, y no deben crearse.
3. El README de entrega debe documentar los «pasos para abrir en el navegador sin npm» (consigna, `Formato de entrega`).
4. Requisito de runtime: navegador moderno con `localStorage` habilitado. La persistencia depende del navegador, del perfil y de la ubicación de apertura (consigna, Ejercicio 6).

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.** La fuente de verdad última es la consigna: `docs/consignas_parcial.pdf`.

| Archivo | Cuándo leerlo |
|---------|---------------|
| [README.md](knowledge-base/README.md) | Índice de la KB y resumen ejecutivo del proyecto |
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, alcance v1.0 y fuera de alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura general y contrato interno de módulos |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores y matriz de roles (rol único; no hay auth real) |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, seed inicial y estructura de `localStorage` |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas `RN-…` (CAT, LIB, CLI, VTA, HIS, PER, UI, TEC, EXC) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario `US-001`…`US-025` y los 7 casos manuales |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | 9 flujos extremo a extremo (arranque, altas, venta, persistencia…) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de carpetas, seguridad y accesibilidad |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | `DD-01`…`DD-12` y `SU-01`…`SU-12` — ⚠️ inferencias internas de la KB |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias `IN-01`…`IN-07` y preguntas abiertas priorizadas |

> ⚠️ **Los códigos `DD-*` y `SU-*` de `09_decisiones_y_supuestos.md` NO son texto de la consigna**: son supuestos y decisiones de la KB. No se promueven a requisitos ni a reglas duras; las reglas duras son solo las citadas en `CHANGES.md` § Reglas duras.

> ⚠️ `10_preguntas_abiertas.md` tiene **3 preguntas de prioridad Alta** (alcance evaluable de la entrega, versión mínima de JavaScript, claves concretas de `localStorage`). No bloquean arrancar `C-01`, pero condicionan el cierre (`C-06`): verificarlas con el docente cuando correspa.

---

## Skills Disponibles

Fuente de verdad: `.atl/skill-registry.md` (20 skills: 12 del proyecto + 8 globales).

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend / UI** | HTML semántico, formularios, CSS adaptable, accesibilidad, auditoría de UI | `html`, `accessibility`, `responsive-design`, `web-design-guidelines` |
| **Documentación / QA** | README de entrega, casos manuales, planes de prueba y reportes de bugs | `documentation`, `qa-test-planner` |
| **OpenSpec — implementación** | Aplicar, actualizar y sincronizar los artifacts de un change | `openspec-apply-change`, `openspec-update-change`, `openspec-sync-specs` |
| **OpenSpec — planificación y cierre** | Explorar, proponer y archivar changes | `openspec-explore`, `openspec-propose`, `openspec-archive-change` |
| **Orquestación — fundación (globales)** | Flujo de fundación SDD/OpenSpec, KB, roadmap, instrucciones, skills | `active-orchestrator`, `agent-instruction`, `kb-creator`, `roadmap-generator`, `discovery-research`, `find-skills`, `skill-creator`, `web-scraper` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes en 2 fases (Etapa 1: maquetación y presentación; Etapa 2: datos, operaciones y cierre), 100 puntos.
- **Camino crítico** (5): `C-01 → C-03 → C-04 → C-05 → C-06`.
- **Rama paralela**: `C-02` corre en paralelo a `C-03`…`C-05` tras `C-01` y debe cerrar antes de `C-06`.
- **Primer change**: `C-01` `estructura-y-pantallas-html` (Ejercicio 1 · 20 pts · governance BAJO · sin dependencias).

| ID | Change | Ejercicio | Puntos | Dependencias |
|----|--------|-----------|--------|--------------|
| C-01 | `estructura-y-pantallas-html` | 1 · Estructura y pantallas HTML | 20 | ninguna |
| C-02 | `presentacion-con-css-adaptable` | 2 · Presentación con CSS y uso adaptable | 20 | C-01 |
| C-03 | `datos-locales-catalogo-y-filtro` | 3 · Datos locales, catálogo y filtro | 15 | C-01 |
| C-04 | `alta-de-libros-y-clientes` | 4 · Alta de libros y clientes | 15 | C-03 |
| C-05 | `venta-simulada-e-historial` | 5 · Venta simulada e historial | 20 | C-03, C-04 |
| C-06 | `persistencia-verificacion-y-documentacion` | 6 · Persistencia, verificación y documentación | 10 | C-02, C-03, C-04, C-05 |

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md) (dependencias + sección «Leer antes») y en `docs/consignas_parcial.pdf` el `Ejercicio N` del change con su fila en `Criterios de evaluación`.

Para arrancar: `/opsx:propose C-01-estructura-y-pantallas-html`

---

## Reglas Duras

> No existe `~/.claude/CLAUDE.md` global en este entorno: no hay reglas universales heredadas que referenciar. Si se crea un global, este bloque debe reducirse a lo que ese global no cubra.

Son contrato; romperlas es un defecto. **Fuente completa con citas verbatim**: [CHANGES.md](CHANGES.md) § Reglas duras (22 filas, de consigna y alcance técnico). La regla 23 no proviene de la consigna: es una decisión del dueño del repositorio. Formato `NUNCA X → hacer Y`:

1. **NUNCA usar nada distinto de HTML, CSS y JavaScript nativos** → solo esas tres tecnologías en todo el proyecto. *(Consigna, `Contexto y alcance`: «Se utilizan únicamente HTML, CSS y JavaScript nativos.» — CHANGES.md regla 1)*
2. **NUNCA incorporar librerías, frameworks ni CDNs de CSS o JavaScript** → cero dependencias externas; el uso de librerías o frameworks incumple el alcance técnico y se informa en la evaluación. *(Consigna, `Contexto y alcance` + `Criterios de evaluación` — CHANGES.md regla 2)*
3. **NUNCA crear API, base de datos, servidor ni conexión con backend** → todo ocurre en el navegador. *(Consigna, `Contexto y alcance` — CHANGES.md regla 3)*
4. **NUNCA implementar inicio de sesión real, roles ni permisos** → la consigna no los requiere. *(Consigna, `Contexto y alcance`: «Tampoco se requiere un inicio de sesión real.» — CHANGES.md regla 4)*
5. **NUNCA gestionar stock, cobros ni facturación fiscal** → la venta es simulada y solo calcula un total. *(Consigna, `Contexto y alcance` — CHANGES.md regla 5)*
6. **NUNCA cambiar el punto de entrada** → `index.html` es la entrada del proyecto; los demás HTML solo si corresponden. *(Consigna, `Ejercicio 1` + `Formato de entrega` — CHANGES.md regla 6)*
7. **NUNCA dejar el CSS embebido en el HTML ni referenciar recursos externos** → CSS en archivos externos; estilos, scripts, imágenes y demás recursos locales e incluidos en el proyecto. *(Consigna, `Ejercicio 2`: «El CSS se mantiene en archivos externos» + `Contexto y alcance` — CHANGES.md regla 7)*
8. **NUNCA instalar dependencias ni herramientas de compilación** → abrir `index.html` en el navegador sin npm; nada de bundler, transpiler, `npm test`, runners de tests, linters obligatorios ni CI. *(Consigna, `Formato de entrega` + README: «pasos para abrir en el navegador sin npm» — CHANGES.md reglas 8 y § Verificación)*
9. **NUNCA dejar la interfaz con scroll horizontal de página completa ni controles ilegibles** → verificar a 320 px y a 1280 px: textos y controles legibles y sin desplazamiento horizontal de toda la página. *(Consigna, `Ejercicio 2` — CHANGES.md regla 9)*
10. **NUNCA que una tabla ensanche la página** → si una tabla necesita más espacio, se desplaza dentro de su propio contenedor. *(Consigna, `Ejercicio 2` — CHANGES.md regla 10)*
11. **NUNCA eliminar el foco visible ni bloquear el recorrido por teclado** → los controles conservan foco visible y se recorren con el teclado. *(Consigna, `Ejercicio 2` — CHANGES.md regla 11)*
12. **NUNCA comunicar errores solo con color** → los mensajes de error se expresan con texto y no dependen únicamente de un color. *(Consigna, `Ejercicio 2` — CHANGES.md regla 12)*
13. **NUNCA publicar imágenes informativas sin texto alternativo** → `alt` en imágenes informativas; las decorativas no repiten información innecesaria. *(Consigna, `Ejercicio 2` — CHANGES.md regla 13)*
14. **NUNCA entregar HTML sin semántica ni mensajes de estado** → encabezado, navegación y contenido principal con etiquetas semánticas; cada campo con etiqueta asociada; botones con textos que describen su acción; tablas con encabezados; mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas. *(Consigna, `Ejercicio 1` — CHANGES.md regla 14)*
15. **NUNCA insertar datos escritos por usuarios interpretando HTML** → insertarlos como texto en el DOM. *(Consigna, `Ejercicio 3`: «Los datos escritos por usuarios se insertan como texto en el DOM.» — CHANGES.md regla 15)*
16. **NUNCA usar `fetch` ni administrar altas, bajas o modificaciones de editoriales, géneros o autores** → esos conjuntos son fijos y provienen de los datos locales. *(Consigna, `Ejercicio 3` — CHANGES.md regla 16)*
17. **NUNCA implementar edición ni eliminación de libros o clientes** → la consigna no lo exige (solo altas). *(Consigna, `Ejercicio 4`: «No se exige editar ni eliminar registros.» — CHANGES.md regla 17)*
18. **NUNCA editar ni eliminar ventas confirmadas desde la interfaz, ni recalcular su precio desde el catálogo** → el precio unitario se copia al renglón como valor histórico al confirmar. *(Consigna, `Ejercicio 5` — CHANGES.md regla 18)*
19. **NUNCA comparar el ISBN crudo ni exigir dígito de control** → comparar el ISBN sin espacios ni guiones. *(Consigna, `Ejercicio 4` — CHANGES.md regla 19)*
20. **NUNCA persistir en otro medio que no sea `localStorage` ni duplicar los ejemplos iniciales al reabrir** → en el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar datos. *(Consigna, `Ejercicio 6` — CHANGES.md regla 20)*
21. **NUNCA entregar un README sin su contenido mínimo** → identificar a los autores; pasos para abrir en el navegador sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de `localStorage`; resultados de los casos manuales; procedencia de imágenes ajenas, si existen. *(Consigna, `Formato de entrega` — CHANGES.md regla 21)*
22. **NUNCA dar un caso por aprobado sin ejecutarlo** → verificar manualmente y registrar el comportamiento real (falla o funcionalidad pendiente incluida). *(Consigna, `Ejercicio 6`: «No se indica una prueba como aprobada sin ejecutarla.» — CHANGES.md regla 22)*
23. **NUNCA excluir la carpeta `openspec/` de git** → `.gitignore` NO la ignora: la carpeta siempre se versiona y se publica en el repositorio, junto con el resto del proyecto. *(Decisión del usuario — política de repositorio; corrige la versión anterior de esta regla, que la excluía)*

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias + leer el Ejercicio N en la consigna
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. Verificar manualmente los casos que cubre      → registrar el resultado real (nunca "aprobado" sin ejecutar)
6. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Jerarquía ante conflicto: **consigna (`docs/consignas_parcial.pdf`) > reglas duras de este archivo > CHANGES.md > `knowledge-base/`** — los códigos `DD-*`, `SU-*` e `IN-*` de la KB nunca prevalecen sobre el texto de la consigna.
