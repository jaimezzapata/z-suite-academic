<div align="center">

# Z-Suite Academic

<p>
  <strong>Plataforma SaaS de gestion docente con enfoque academico, automatizacion operativa e integracion con IA.</strong>
</p>

<p>
  <img src="https://img.shields.io/badge/estado-en%20diseno%20y%20construccion-2563EB?style=for-the-badge" alt="Estado del proyecto" />
  <img src="https://img.shields.io/badge/tipo-proyecto%20personal-7C3AED?style=for-the-badge" alt="Proyecto personal" />
  <img src="https://img.shields.io/badge/licencia-MIT-111827?style=for-the-badge" alt="Licencia MIT" />
</p>

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,postgres,vercel,git" alt="Stack principal" />
</p>

</div>

---

## Resumen

Z-Suite Academic es un proyecto personal creado para centralizar la operacion academica de un docente en una sola plataforma: planeacion, grupos, calendario, integracion con Google Drive y generacion de evaluaciones con apoyo de IA.

La idea central es reducir trabajo manual, evitar dispersion de informacion y ofrecer una base solida para una operacion docente moderna, clara y escalable.

## Navegacion rapida

- [Proposito](#proposito)
- [Objetivo](#objetivo)
- [Modulos del sistema](#modulos-del-sistema)
- [Tecnologias](#tecnologias)
- [Arquitectura](#arquitectura)
- [Proyecto personal](#proyecto-personal)
- [Desarrollador](#desarrollador)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [Licencia](#licencia)

## Proposito

Z-Suite Academic nace para resolver una necesidad real del trabajo docente: tener en un solo sistema la administracion de instituciones, sedes, materias, calendarios, grupos y recursos de clase, evitando procesos manuales repetitivos y desorganizados.

La aplicacion esta pensada para que cada profesor tenga un entorno privado y aislado, con control total sobre:

- sus instituciones y sedes
- sus grupos regulares y empresariales
- su calendario academico
- su estructura de carpetas en Google Drive
- sus momentos evaluativos
- sus examenes generados con contexto real de clase

## Objetivo

Construir una plataforma moderna, clara y escalable que permita a un docente:

- organizar su operacion academica en un solo lugar
- automatizar la programacion de sesiones segun reglas reales del negocio
- mantener separacion estricta de datos por profesor
- ahorrar tiempo en tareas operativas repetitivas
- generar valor academico a partir de su propia bitacora de clase

## Modulos del sistema

La navegacion principal de la plataforma esta organizada en los siguientes modulos:

| Modulo | Contenido principal |
|---|---|
| `Dashboard` | Vista general del semestre actual, horas dictadas totales, progreso circular de almacenamiento en Google Drive y acceso directo a clases de hoy |
| `Mis Grupos` | Grupos activos, detalle de grupo, bitacora diaria, generacion de examen con IA, enlace a Drive y accion de cerrar grupo |
| `Calendario` | Vista de agenda mensual y semanal, gestion de recesos y programacion manual de recuperaciones |
| `Pensum` | Gestion de contenido base y planes de estudio a partir de la relacion entre contenido, sede y alias comercial |
| `Instituciones` | Creacion y edicion de instituciones, gestion de sedes y configuracion de reglas academicas y de pago |
| `Configuracion` | Estado de conexiones con Google/Drive, preferencias visuales y opciones de cuenta |

### 1. Dashboard

- vista general del semestre actual
- metricas de horas dictadas totales
- progreso circular de almacenamiento en Google Drive
- acceso directo a clases de hoy

### 2. Mis Grupos

- tarjetas de grupos activos
- detalle de cada grupo
- bitacora diaria de temas
- generacion de examen con IA para momentos M1, M2 y M3
- enlace directo a carpeta compartida en Drive
- accion de offboarding mediante cierre de grupo

### 3. Calendario

- vista de agenda mensual y semanal
- panel de gestion de fechas de inactividad
- programador manual de sesiones de recuperacion

### 4. Pensum

- gestion de contenido base
- gestion de planes de estudio
- asignacion de alias comerciales por sede

### 5. Instituciones

- creacion y edicion de instituciones
- gestion de sedes fisicas
- ajuste de reglas como 45/60 minutos y tipo de pago

### 6. Configuracion

- estado del token de Google y Google Drive
- preferencias visuales como modo claro y modo oscuro
- configuracion de cuenta y cierre de sesion

## Tecnologias

### Stack principal

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js App Router" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Tipado%20estricto-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-UI%20minimalista-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-Base%20de%20datos-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
</div>

### Servicios e integraciones clave

<div align="center">
  <img src="https://img.shields.io/badge/Auth.js-Autenticacion-18181B?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth.js" />
  <img src="https://img.shields.io/badge/Google%20Drive%20API-Integracion-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Google Drive API" />
  <img src="https://img.shields.io/badge/Gemini%20Flash-IA%20generativa-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Flash" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

La autenticacion de la plataforma se implementara con **Auth.js** y proveedor de Google, manteniendo el aislamiento estricto por profesor como regla central del sistema.

### Filosofia tecnica

- arquitectura por modulos de negocio
- separacion estricta entre UI y logica
- backend integrado en Next.js
- estado local por defecto y `zustand` cuando exista estado global compartido
- minimo de dependencias externas
- automatizacion enfocada en necesidades reales del docente

## Arquitectura

El proyecto sigue una arquitectura orientada a modulos de negocio:

- `src/app`: rutas y layout de Next.js
- `src/features`: funcionalidades por dominio
- `src/shared`: componentes, hooks, utilidades y tipos compartidos

Reglas clave del proyecto:

- los componentes visuales solo renderizan interfaz
- la logica vive en hooks, servicios, validaciones y utilidades puras
- el aislamiento por profesor es una restriccion obligatoria del negocio

## Estado actual

Actualmente el proyecto se encuentra en etapa de construccion inicial, con base documental ya definida en:

- arquitectura frontend
- backlog funcional
- stack tecnologico
- guia visual
- roadmap de desarrollo
- flujo de git y trabajo

Toda esta documentacion vive en la carpeta [`docs`](./docs).

## Proyecto personal

Este repositorio corresponde a un proyecto personal de producto y desarrollo liderado por su autor. Su objetivo es construir una plataforma propia, alineada con una necesidad real del trabajo docente y con criterios tecnicos de escalabilidad, mantenibilidad y claridad visual.

## Desarrollador

**Jaime Zapata**  
Ingeniero de Software  
Profesor de desarrollo de software

## Puesta en marcha local

```bash
npm install
npm run dev
```

Despues, abre `http://localhost:3000` en el navegador.

## Licencia

Este proyecto es de caracter personal y se distribuye bajo la licencia MIT. Puedes revisar el texto completo en [`LICENSE`](./LICENSE).
