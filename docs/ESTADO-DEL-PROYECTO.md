# Estado actual del proyecto

**Repositorio:** `EveArbol/uigen` (público) · **Rama por defecto:** `main`
**Fecha del informe:** 2026-08-05
**Último commit del proyecto:** `d4202c8` — 2026-03-17
**Entorno de verificación:** Node v22.22.2, npm 10.9.7, Linux

> **Nota sobre el nombre.** El informe se pidió sobre "eveartstudio". No existe ninguna
> referencia a ese nombre en el código, la configuración ni el historial de git: el
> repositorio se llama `uigen`, el paquete npm se llama `uigen` y la interfaz se presenta
> como "UIGen". Se asume que "eveartstudio" es el nombre de trabajo del producto y que
> corresponde a este repositorio, el único del ámbito de la sesión. El branding pendiente
> se recoge como punto abierto (§5.1).

---

## 1. Resumen ejecutivo

El proyecto está **sano y completamente funcional**: instala, compila, pasa tipos, pasa
lint, pasa los 185 tests y arranca de extremo a extremo. No hay ningún fallo técnico
bloqueante ni trabajo a medias en el árbol de código.

El estado real no es de "problemas que arreglar" sino de **proyecto parado**: la última
actividad fue el 2026-03-17, hace unos 4 meses y medio, y las dos últimas aportaciones
fueron los workflows de Claude, no funcionalidad de producto. Lo que falta es
infraestructura de proyecto (CI propia, plantilla de entorno, branding) más que código.

| Dimensión | Estado |
|---|---|
| Compilación y tipos | ✅ Sin errores |
| Tests | ✅ 185/185 |
| Lint | ✅ Sin avisos |
| Arranque y flujo end-to-end | ✅ Verificado |
| CI de calidad (tests/lint/build) | ❌ No existe |
| Preparación para despliegue | ⚠️ No resuelta (SQLite local) |
| Identidad de producto | ⚠️ Sin aplicar |

---

## 2. Verificaciones ejecutadas hoy

Todas las comprobaciones se ejecutaron sobre un clon limpio, sin `node_modules` ni base de
datos previa. Resultados reales, no estimaciones:

| Comprobación | Comando | Resultado |
|---|---|---|
| Instalación de dependencias | `npm install` | ✅ Exit 0 |
| Cliente de base de datos | `npx prisma generate` | ✅ Prisma Client v7.5.0 |
| Migraciones | `npx prisma migrate deploy` | ✅ 3 migraciones aplicadas |
| Tipos | `npx tsc --noEmit` | ✅ 0 errores |
| Lint | `npm run lint` | ✅ Sin warnings ni errores |
| Tests | `npx vitest run` | ✅ 185/185 en 9 ficheros (4,05 s) |
| Build de producción | `npm run build` | ✅ Compilado en 56 s |
| Servidor de desarrollo | `npm run dev` | ✅ Listo en 2,6 s · `GET /` → 200 |
| API de generación | `POST /api/chat` | ✅ 200, streaming correcto (proveedor mock) |

**Salida del build:** 4 rutas (`/`, `/[projectId]`, `/api/chat`, `/_not-found`), 880 kB de
First Load JS en la ruta principal (dominado por el editor Monaco y Babel standalone) y
39,3 kB de middleware.

**Prueba end-to-end:** sin `ANTHROPIC_API_KEY` el sistema cae correctamente al proveedor
simulado (`No ANTHROPIC_API_KEY found, using mock provider`) y devuelve un stream válido
con llamadas a herramientas. La ruta completa chat → herramientas → sistema de ficheros
virtual funciona.

---

## 3. Qué hay construido

Aplicación Next.js 15 (App Router) + React 19 donde el usuario describe componentes React
en un chat y Claude los genera en vivo.

**Funcionalidad completa y operativa:**

- **Chat de generación** con streaming vía Vercel AI SDK (`ai@4.3.16`), modelo
  `claude-haiku-4-5` a través de `@ai-sdk/anthropic`.
- **Proveedor simulado** (`src/lib/provider.ts`, 518 líneas) que devuelve componentes
  estáticos cuando no hay clave de API — el proyecto es usable sin credenciales.
- **Sistema de ficheros virtual** (`src/lib/file-system.ts`, 517 líneas), en memoria, nunca
  escrito a disco. Es el componente mejor probado del proyecto (60 tests).
- **Dos herramientas de IA**: `str_replace_editor` (editar) y `file_manager` (crear/borrar).
- **Transformador JSX** (`src/lib/transform/jsx-transformer.ts`, 473 líneas) con Babel
  standalone para la vista previa en vivo.
- **Editor Monaco + árbol de ficheros + vista previa** en tres paneles redimensionables.
- **Autenticación** con bcrypt + JWT (jose) en cookies HTTP-only, 7 días de expiración.
- **Persistencia** en SQLite vía Prisma 7 con adaptador libSQL. Dos modelos: `User` y
  `Project` (mensajes y sistema de ficheros serializados como JSON).
- **Modo anónimo**: se puede usar sin cuenta; el trabajo en curso se guarda en
  `sessionStorage` y se recupera al registrarse.
- **Diálogo de ayuda** accesible desde la cabecera (última funcionalidad de producto añadida).

**Inventario de código:**

| Métrica | Valor |
|---|---|
| Ficheros de producción (`.ts`/`.tsx`) | 45 |
| Líneas de producción | 4 544 |
| Líneas de test | 3 186 |
| Ratio test/producción | 0,70 |
| Ficheros de test | 9 |
| Casos de test | 185 |
| Migraciones de base de datos | 3 |
| Tamaño del repo (sin dependencias) | 9,9 MB |

---

## 4. Estado del repositorio

| Elemento | Estado |
|---|---|
| Commits totales | 6 |
| Última actividad | 2026-03-17 (~4,5 meses) |
| Pull requests | 1 (#1 «Add Claude Code GitHub Workflow», fusionada) |
| Issues abiertas | 0 |
| Ejecuciones de CI | 1 (Claude Code Review, exitosa) |
| Árbol de trabajo | Limpio, sin cambios sin confirmar |
| Rama de trabajo actual | `claude/eveartstudio-project-status-9384in`, idéntica a `main` |

**Historial completo:**

| Fecha | Commit | Contenido |
|---|---|---|
| 2026-03-16 | `ebec751` | Volcado inicial: aplicación completa + diálogo de ayuda |
| 2026-03-17 | `fc177c5` | Una línea añadida al README |
| 2026-03-17 | `32aa0ee` | Migración a Prisma 7 + adaptador libSQL + `prisma.config.ts` |
| 2026-03-17 | `167e179` | Workflow «Claude PR Assistant» |
| 2026-03-17 | `657f1b2` | Workflow «Claude Code Review» |
| 2026-03-17 | `d4202c8` | Merge de la PR #1 |

En la práctica el proyecto tiene **un solo commit de producto** más un cambio de
infraestructura de base de datos. No hay historial de desarrollo iterativo todavía.

**Automatización presente:** dos workflows de GitHub Actions, ambos de asistencia de IA
(`claude.yml` responde a menciones `@claude`; `claude-code-review.yml` revisa PRs).
Ninguno ejecuta tests, lint ni build.

---

## 5. Puntos abiertos

Ordenados por impacto. Ninguno bloquea el uso actual del proyecto.

### 5.1 Prioridad alta

**Sin CI de calidad.** Los únicos workflows son los de Claude. Nada ejecuta
`npm test`, `npm run lint` ni `npm run build` al abrir una PR, así que un cambio que rompa
la compilación o los tests puede llegar a `main` sin ninguna señal. Es la carencia con
peor relación coste/beneficio: un workflow de unas 25 líneas la cubre.

**Los workflows dependen de un secreto sin verificar.** Ambos usan
`secrets.CLAUDE_CODE_OAUTH_TOKEN`. Solo ha habido una ejecución (exitosa, en la propia PR
que los introdujo). Conviene confirmar que el secreto sigue configurado y vigente.

**Sin plantilla de entorno.** El README indica «edita `.env` y añade tu clave», pero no hay
`.env` (correctamente ignorado por git) ni `.env.example` en el repositorio. Quien clone el
proyecto por primera vez no sabe qué variables existen. Las que usa el código son
`ANTHROPIC_API_KEY` y `JWT_SECRET` (esta última con valor por defecto de desarrollo).

### 5.2 Prioridad media

**Middleware desalineado con las rutas reales.** `src/middleware.ts` protege
`/api/projects` y `/api/filesystem`, rutas que **no existen** — la única ruta de API es
`/api/chat`. Es configuración muerta que da una falsa sensación de cobertura. `/api/chat`
sí valida la sesión internamente antes de escribir en base de datos, así que no hay
vulnerabilidad, pero la lista debería reflejar la realidad.

**Cobertura de tests desigual.** Los 185 tests se concentran en el sistema de ficheros
virtual, el transformador JSX, los contextos y los componentes de chat. Sin ningún test:

- `src/lib/auth.ts` y `src/actions/index.ts` — toda la autenticación
- `src/lib/tools/file-manager.ts` y `str-replace.ts` — las dos herramientas de IA
- `src/app/api/chat/route.ts` — la ruta principal
- `src/components/preview/PreviewFrame.tsx`, `CodeEditor.tsx`, `HeaderActions.tsx`
- `src/lib/anon-work-tracker.ts`

Auth y las dos herramientas son los huecos que más importan: manejan credenciales y
mutaciones del estado del usuario.

**Sin ruta de despliegue.** La base de datos es un fichero SQLite local
(`prisma/dev.db`, ignorado por git). No hay configuración de despliegue ni de base de datos
remota. Punto a favor: el adaptador libSQL ya instalado permite apuntar a Turso cambiando
solo la URL, sin tocar el esquema.

### 5.3 Prioridad baja (limpieza)

- **Sin identidad de producto.** `metadata` en `src/app/layout.tsx` sigue siendo
  «Create Next App» / «Generated by create next app» — el título del navegador y los
  metadatos sociales muestran el texto por defecto de la plantilla. El paquete se llama
  `uigen` y el diálogo de ayuda dice «How to use UIGen».
- **`@anthropic-ai/sdk` (^0.78.0)** está declarado como dependencia directa pero no se
  importa en ningún punto de `src/`. Candidato a eliminación.
- **`logs.txt`**, que genera `npm run dev:daemon`, no está en `.gitignore`.
- **README** termina con una línea suelta `# uigen` (residuo del commit `fc177c5`).
- **Sin LICENSE** en un repositorio público.
- **ESLint 9 con configuración heredada** (`.eslintrc.json` + `next lint`). Funciona hoy
  sin errores; la migración a flat config (`eslint.config.mjs`) es el camino soportado a
  futuro.

---

## 6. Siguientes pasos sugeridos

Por orden de retorno sobre esfuerzo:

1. **Añadir un workflow de CI** que ejecute `npm ci`, `prisma generate`, lint, tests y
   build en cada PR. Es la mayor mejora de seguridad del proyecto por el menor esfuerzo.
2. **Crear `.env.example`** con `ANTHROPIC_API_KEY` y `JWT_SECRET` documentadas, y ajustar
   el README para que apunte a copiarlo.
3. **Aplicar la identidad de producto**: metadatos de `layout.tsx`, título del diálogo de
   ayuda y, si procede, el nombre del paquete.
4. **Corregir el middleware** para que refleje las rutas que existen realmente.
5. **Cubrir con tests** `src/lib/auth.ts` y las dos herramientas de IA.
6. **Decidir el destino de despliegue** (Vercel + Turso es el camino de menor fricción dado
   el adaptador libSQL ya presente).

---

*Informe generado con [Claude Code](https://claude.ai/code) a partir de la ejecución real
de la suite de verificación sobre el commit `d4202c8`.*
