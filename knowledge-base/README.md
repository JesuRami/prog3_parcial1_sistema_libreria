# prog3_parcial1_sistema_libreria — Base de Conocimiento

Base de conocimiento generada en **Mode A (ingest / silencioso)** a partir del documento fuente del proyecto: `docs/consignas_parcial.pdf` — la consigna del Trabajo Práctico Integrador (TPI) de *Programación III*, unidad *HTML, CSS y JavaScript*.

> Este `README.md` es el **índice de la KB** y es documentación interna del proyecto. **No es** el `README.md` de entrega exigido por la consigna, que va en la raíz del entregable y sigue el formato definido en `06_funcionalidades.md` (US-024).

## Índice de Archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito del sistema, objetivos por actor, alcance v1.0, fuera de alcance y métricas de éxito |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack tecnológico, arquitectura general (diagrama), integraciones externas y contrato interno de módulos |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores del sistema, actores que no existen, matriz RBAC (único rol) y rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD, 7 entidades con atributos y constraints, seed data inicial y estructura de `localStorage` |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | ~70 reglas codificadas `RN-{DOMINIO}-{NN}` en 9 dominios: CAT, LIB, CLI, VTA, HIS, PER, UI, TEC, EXC |
| [06_funcionalidades.md](06_funcionalidades.md) | 9 épicas con historias de usuario `US-001`…`US-025`, criterios de aceptación y los 7 casos manuales obligatorios |
| [07_flujos_principales.md](07_flujos_principales.md) | 9 flujos extremo a extremo (arranque, navegación, búsqueda, altas, venta, historial, persistencia, verificación) |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones aplicados, estructura de directorios, seguridad, accesibilidad y ausencia de variables de entorno |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 12 decisiones documentadas `DD-01`…`DD-12` y 12 supuestos inferidos `SU-01`…`SU-12` |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | 7 inconsistencias detectadas `IN-01`…`IN-07`, preguntas abiertas priorizadas y puntos resueltos por decisión propia |

## Quick Start para Desarrolladores

1. **Entender el dominio** → [01_vision_y_objetivos.md](01_vision_y_objetivos.md), [03_actores_y_roles.md](03_actores_y_roles.md)
2. **Entender los datos** → [04_modelo_de_datos.md](04_modelo_de_datos.md)
3. **Entender las reglas** → [05_reglas_de_negocio.md](05_reglas_de_negocio.md)
4. **Entender la arquitectura** → [02_descripcion_general.md](02_descripcion_general.md), [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md)
5. **Implementar** → [07_flujos_principales.md](07_flujos_principales.md), [06_funcionalidades.md](06_funcionalidades.md)
6. **Antes de codificar** → [10_preguntas_abiertas.md](10_preguntas_abiertas.md)

## Resumen Ejecutivo

El proyecto es el **frontend de una librería** (TPI de Programación III) construido solo con **HTML, CSS y JavaScript nativos**, sin frameworks, librerías, CDNs, API, base de datos, servidor ni build. La aplicación presenta el catálogo y registra libros, clientes y ventas con **datos y operaciones simulados en el navegador**, persistidos en `localStorage`.

El alcance está cerrado por la consigna en **5 vistas** (Catálogo, Libros, Clientes, Ventas, Historial), una **rúbrica de 100 puntos** en 6 ejercicios, ~70 reglas de negocio explícitas y **7 casos manuales** que deben ejecutarse y registrarse en el README de entrega con su resultado observado — nunca como aprobados sin ejecutarlos. El punto más delicado del diseño es la **inmutabilidad del historial**: el precio unitario se copia al renglón al confirmar la venta, de modo que cambiar el precio del catálogo guardado no altera las ventas ya registradas.

## Convenciones de la KB

- Idioma de todos los artefactos: **español (rioplatense neutro)**.
- Cada regla de negocio tiene un código `RN-{DOMINIO}-{NN}`; cada decisión `DD-{NN}`; cada supuesto `SU-{NN}`; cada inconsistencia `IN-{NN}`; cada historia `US-{NNN}`.
- Los hechos que provienen literalmente de la consigna se distinguen de las **propuestas de la KB**: los valores concretos del seed, los nombres de módulos, el formato de las claves de `localStorage` y la versión mínima de JavaScript son supuestos explícitos, no requisitos.
- Lo que la consigna no define está registrado en `10_preguntas_abiertas.md`; no se inventaron hechos.

## Trazabilidad con la consigna

| Ejercicio | Puntos | Archivos de la KB que lo cubren |
|-----------|--------|-------------------------------|
| 1. Estructura y pantallas HTML | 20 | `01`, `03`, `06` (Épica 1), `07` (Flujos 1 y 2) |
| 2. Presentación con CSS y uso adaptable | 20 | `01`, `06` (Épica 2), `08` (Accesibilidad) |
| 3. Datos locales, catálogo y filtro | 15 | `04`, `05` (RN-CAT), `06` (Épica 3), `07` (Flujo 3) |
| 4. Alta de libros y clientes | 15 | `05` (RN-LIB, RN-CLI), `06` (Épicas 4 y 5), `07` (Flujos 4 y 5) |
| 5. Venta simulada e historial | 20 | `04`, `05` (RN-VTA, RN-HIS), `06` (Épicas 6 y 7), `07` (Flujos 6 y 7) |
| 6. Persistencia, verificación y documentación | 10 | `04` (Estructura de persistencia), `05` (RN-PER), `06` (Épica 8), `07` (Flujo 8) |
