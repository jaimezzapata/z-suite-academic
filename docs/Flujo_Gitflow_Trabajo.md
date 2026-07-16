# Flujo de Git y Trabajo

Este documento define el flujo de ramas y commits para el desarrollo de Z-Suite Academic.

La meta no es seguir Gitflow clasico por formalidad, sino usar un flujo simple, ordenado y sostenible para un proyecto personal que ira creciendo por fases.

## Objetivo del flujo

- mantener `main` siempre estable
- trabajar por bloques pequenos y verificables
- relacionar cada cambio con una tarea concreta del roadmap
- evitar mezclar varias cosas grandes en una sola rama

## Estrategia recomendada

Se utilizara un flujo basado en `main` + ramas de trabajo cortas.

### Ramas principales

- `main`: rama estable del proyecto

### Ramas de trabajo

Formato recomendado:

```bash
feature/fase-item-descripcion
```

Ejemplos:

```bash
feature/f0-setup-prisma
feature/f0-ui-tailwind-base
feature/f0-auth-google
feature/f1-institutions-schema
feature/f2-calendar-engine
```

## Regla por etapa de avance

### Etapa 1: Cimientos y construcción inicial

Mientras el proyecto esta definiendo su base:

- una rama por tarea o subtarea del checklist
- commits pequenos y frecuentes
- merges rapidos a `main` cuando el bloque quede validado

Esto aplica especialmente para:

- setup
- base de datos
- arquitectura
- sistema de diseño
- autenticacion

### Etapa 2: Features medianas

Cuando ya exista base estable:

- una rama por feature completa o por bloque funcional de una feature
- cada rama debe cerrar una unidad clara de valor

Ejemplos:

- `feature/f1-institutions-crud`
- `feature/f2-regular-groups`
- `feature/f3-drive-root-folders`

### Etapa 3: Correcciones o ajustes puntuales

Para errores pequenos o ajustes de comportamiento:

```bash
fix/descripcion-corta
chore/descripcion-corta
docs/descripcion-corta
refactor/descripcion-corta
```

Ejemplos:

```bash
fix/teacher-scope-query
docs/update-readme-modules
chore/install-zustand-gemini
refactor/groups-form-hook
```

## Convención práctica de commits

Formato recomendado:

```bash
tipo: descripcion corta
```

Tipos sugeridos:

- `feat`: nueva funcionalidad
- `fix`: corrección
- `docs`: documentación
- `chore`: tareas técnicas o instalación
- `refactor`: mejora interna sin cambiar comportamiento funcional
- `style`: ajustes visuales
- `test`: pruebas

Ejemplos:

```bash
feat: create prisma base setup
docs: define git workflow for project phases
chore: connect prisma to neon database
style: apply pastel base tokens to global styles
fix: scope teacher queries by session id
```

## Cuándo hacer commit

Haz commit cuando el cambio cumpla una de estas condiciones:

- deja una tarea del checklist cerrada
- deja una subtarea funcional terminada
- deja el proyecto en un estado estable y verificable

No conviene:

- acumular demasiados cambios heterogeneos en un solo commit
- hacer commits gigantes con varias decisiones mezcladas

## Relación con el roadmap

Cada rama nueva debe corresponder idealmente a:

- una tarea del roadmap
- o una subtarea necesaria para completar el siguiente punto en orden

Ejemplo de correspondencia:

- roadmap: `Inicializar Prisma para PostgreSQL`
- rama: `feature/f0-setup-prisma`

- roadmap: `Configurar Tailwind CSS con la paleta pastel`
- rama: `feature/f0-ui-tailwind-base`

## Regla para este proyecto

Mientras estemos construyendo la base del sistema, trabajaremos asi:

1. actualizar checklist
2. abrir una rama corta por tarea
3. implementar
4. validar
5. actualizar documentacion si hubo decisiones nuevas
6. hacer commit
7. integrar a `main`

## Cuándo usar ramas largas

Solo cuando un modulo sea lo suficientemente grande como para requerir varios subbloques internos, por ejemplo:

- motor de calendario
- integracion con Google Drive
- flujo completo de autenticacion

En esos casos, aun asi se recomienda no dejar una rama viva demasiado tiempo sin integraciones intermedias.
