# Roadmap de Desarrollo y Plan de Trabajo (Checklist)

**Proyecto:** Plataforma SaaS de Gestión Docente
**Metodología:** Desarrollo por Capas Verticales (Feature-Driven Development).
**Regla de Oro:** Ninguna HU de las Fases 2, 3 o 4 puede comenzar si la Fase 0 y 1 (Aislamiento Multi-Tenant) no están 100% probadas.

---

## FASE 0: Cimientos, Entorno y UI Base (Semana 1)

**Objetivo:** Configurar el esqueleto técnico, la base de datos y el sistema de diseño según la guía visual.

### 0.1 Setup del Proyecto

- [ ] Inicializar Next.js (App Router) con TypeScript.
- [ ] Configurar Vercel Postgres y Prisma (`prisma init`).
- [ ] Estructurar carpetas bajo Screaming Architecture (`/src/features/`, `/src/shared/`).

### 0.2 Sistema de Diseño (UI)

- [ ] Configurar Tailwind CSS con la paleta de colores pastel (`bg-slate-50`, `blue-50`, `emerald-50`).
- [ ] Instalar e inicializar `lucide-react` para iconos.
- [ ] Instalar e inicializar `sonner` para las alertas tipo toast.
- [ ] Crear componentes UI Base (SRP): `<Button />` (con microanimaciones), `<Input />`, `<Modal />` (con transiciones fluidas), y `<SkeletonCard />`.

### 0.3 Autenticación y Aislamiento (RF 0.1.1 - 0.1.3)

- [ ] Configurar credenciales OAuth 2.0 en Google Cloud Console (Drive API habilitada).
- [ ] Instalar y configurar Auth.js con el proveedor de Google.
- [ ] Crear tabla `Teacher` y `TeacherAuth` en Prisma.
- [ ] Capturar y guardar el `refresh_token` de Google al iniciar sesión.
- [ ] **HITO CRÍTICO:** Crear el Custom Hook global `useAuth()` y el middleware para proteger las rutas.

---

## FASE 1: Dominio Multi-Tenant y Pénsum (Semana 2)

**Objetivo:** Parametrizar las instituciones, tiempos y materias base.

### 1.1 Base de Datos (Instituciones y Contenido)

- [ ] Desplegar modelos en Prisma: `Institution`, `Location`, `CoreContent`, `StudyPlan`, `Cohort`.

### 1.2 Gestión de Instituciones (HU 1.1)

- [ ] Crear validadores Zod (`institutionSchema`) para reglas estrictas de 45/60 min.
- [ ] Construir API Route protegida (inyectando `teacherId` del token).
- [ ] UI: Formulario de creación de Instituciones y listado de sedes.

### 1.3 Desacoplamiento de Pénsum (HU 1.2)

- [ ] UI: CRUD para crear `CoreContent` (ej. "React Base").
- [ ] UI: Formulario de asignación a un `StudyPlan` (Alias) según la sede elegida (ej. "Front 2").
- [ ] Lógica visual: Mostrar solo el Alias en las tarjetas de la interfaz.

---

## FASE 2: Motor de Calendario y Core Lógico (Semanas 3 y 4)

**Objetivo:** El cerebro matemático de la app. Programar clases evitando festivos y recesos.

### 2.1 Base de Datos (Calendario)

- [ ] Desplegar modelos: `BlackoutDate`, `ClassGroup`, `Schedule`, `Session`.

### 2.2 Días Inactivos (HU 2.1 - Recesos)

- [ ] API y UI para registrar `BlackoutDates` (Semanas Santas, vacaciones).
- [ ] Crear función de utilidad pura (`utils/calendarEngine.ts`) para validar si una fecha es festivo en Colombia o es un `BlackoutDate`.

### 2.3 Algoritmo Grupo Regular (RF 2.2)

- [ ] Construir formulario de creación de grupo exigiendo `startDate` y `endDate`.
- [ ] Desarrollar lógica del backend: Iterar fechas. Si es festivo -> `isHoliday: true`, `durationHours: 0`.
- [ ] UI: Botón para agendar "Clase de Recuperación" manual.

### 2.4 Algoritmo Grupo Empresarial (RF 2.3)

- [ ] Construir formulario exigiendo `startDate` y `totalSessions` (sin `endDate`).
- [ ] Desarrollar lógica del backend (While loop): Iterar saltando festivos hasta cumplir el N° total de sesiones. Actualizar el `endDate` dinámico.

### 2.5 Horarios Asimétricos (Extra)

- [ ] Asegurar que el formulario `Schedule` permita registrar múltiples entradas por grupo (Ej: Lunes 4h, Jueves 2h).

---

## FASE 3: Infraestructura Google Drive (Semana 5)

**Objetivo:** Ejecución directa contra la API de Google, sin intermediarios.

### 3.1 Base de Datos (Drive)

- [ ] Desplegar modelo `DriveConfig` asociado a la clase.

### 3.2 Integración Core (Node.js SDK)

- [ ] Crear servicio `services/driveService.ts` que instancie la API de Google usando el `refresh_token` de la base de datos.

### 3.3 Creación Condicional de Carpetas (HU 3.1 y 3.2)

- [ ] Paso A: Crear carpeta Padre `[Cohorte] - [Materia]`.
- [ ] Paso B (Paralelo): Crear Privada y Pública (con permisos de lectura). Extraer enlace y guardar en BD.
- [ ] Paso C (Resiliencia): Validar existencia de la carpeta padre (evitar error 404).
- [ ] Paso D (Generación Diaria): Iterar sobre las sesiones. Crear subcarpetas SOLO donde `isHoliday == false`.

### 3.4 Dashboard de Métricas y Offboarding (HU 0.2 y 3.3)

- [ ] API para leer cuota de almacenamiento (`/drive/v3/about?fields=storageQuota`).
- [ ] UI: Bloqueo de creación de grupos si Drive > 95%.
- [ ] Acción de botón "Cerrar Grupo": Enviar PATCH a la API de Drive para poner `trashed: true` a la carpeta pública.

---

## FASE 4: Momentos de Evaluación e IA (Semana 6)

**Objetivo:** Gatillos automáticos y PDF Generator con IA de contexto estricto.

### 4.1 Base de Datos (Evaluaciones)

- [ ] Desplegar modelo `SessionLog` (Bitácora). Añadir enum `EvalMoment` a `Session`.

### 4.2 Gatillos de Momento (RF 4.1)

- [ ] Añadir lógica post-creación de grupo: Si es SENA (Sem 2,6,10), CESDE (Sem 6,12,17), Empresarial (Tercios). Actualizar sesiones correspondientes.

### 4.3 El Motor RAG (Exámenes AI - RF 4.2)

- [ ] UI: Formulario de Bitácora diaria (`topicsCovered`).
- [ ] UI: Botón de "Generar Examen M[X]" (con Loader spinner).
- [ ] Backend: Recuperar registros de bitácora anteriores al momento actual.
- [ ] Backend: Llamada a OpenAI/Anthropic con System Prompt Estricto (Restringido al contexto extraído).

### 4.4 Generador PDF y Depósito

- [ ] Usar `@react-pdf/renderer` para mapear la salida Markdown de la IA a dos Buffers de PDF (Examen y Solucionario).
- [ ] Subir PDF Examen a subcarpeta Pública del grupo.
- [ ] Subir PDF Solucionario a carpeta Privada del grupo.

---

## FASE 5: Pruebas y Despliegue (Semana 7)

**Objetivo:** Asegurar calidad y poner en producción.

- [ ] **5.1 Auditoría de Aislamiento:** Revisar que el 100% de las consultas Prisma tengan `where: { teacherId: user.id }`.
- [ ] **5.2 Auditoría Visual:** Revisar zonas de toque móvil (`h-11`) y microinteracciones de 200ms.
- [ ] **5.3 Deploy:** Conectar repo a Vercel, configurar variables de entorno (DB, Google Auth, OpenAI API).
