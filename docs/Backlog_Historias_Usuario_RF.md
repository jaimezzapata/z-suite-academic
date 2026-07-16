# Backlog de Historias de Usuario y Requerimientos Funcionales (RF)

**Proyecto:** Plataforma SaaS de Gestión Docente
**Enfoque:** Estricto, sin ambigüedades. Instrucciones literales para desarrollo.

---

## ÉPICA 0: Aislamiento, Seguridad y Dashboard

### HU 0.1: Autenticación y Aislamiento de Tenant (Profesor)

> Como profesor, quiero iniciar sesión con mi cuenta de Google de forma segura, para tener un entorno de trabajo estrictamente privado y separado de otros docentes.

- **RF 0.1.1 (Login):** El sistema debe implementar autenticación mediante OAuth 2.0 (Google Provider).
- **RF 0.1.2 (Persistencia):** Al hacer login exitoso, el sistema insertará o actualizará el registro en la tabla `Teacher`. Debe capturar y almacenar el `refresh_token` de Google de forma encriptada en la tabla `TeacherAuth`.
- **RF 0.1.3 (Aislamiento Estricto):** Todas las consultas (Query) al backend (GET, POST, PUT, DELETE) deben extraer el `TeacherId` del token de sesión activo. Es obligatorio incluir la cláusula `where: { teacherId: session.user.id }` en cada consulta a la base de datos. Ningún endpoint debe aceptar el `TeacherId` como parámetro enviado desde el frontend (para evitar suplantación).

### HU 0.2: Dashboard y Métricas de Infraestructura

> Como profesor, quiero ver un panel principal al entrar, para conocer el estado de mi almacenamiento en Drive y mi carga horaria acumulada.

- **RF 0.2.1 (Monitoreo Drive):** Al cargar el dashboard, el backend debe hacer una petición GET a la API de Google Drive (`https://www.googleapis.com/drive/v3/about?fields=storageQuota`) usando el token del profesor. El frontend renderizará una barra de progreso indicando el porcentaje de almacenamiento usado.
- **RF 0.2.2 (Alerta de Espacio):** Si el almacenamiento usado supera el 95% de los 15GB gratuitos, el sistema debe bloquear el botón de "Crear Grupo" y mostrar un banner rojo literal: **"Almacenamiento de Google Drive lleno. Libere espacio para crear nuevos grupos"**.
- **RF 0.2.3 (Carga Horaria Acumulada):** El sistema sumará el campo `durationHours` de todas las sesiones (`Session`) de los grupos activos del periodo en curso y mostrará el total de "Horas dictadas hasta la fecha".

---

## ÉPICA 1: Arquitectura Institucional y Pénsum

### HU 1.1: Parametrización de Instituciones

> Como administrador de mi cuenta, quiero configurar las instituciones donde dicto clase, para que el sistema aplique reglas matemáticas exactas según sus políticas.

- **RF 1.1.1 (Campos Obligatorios):** El formulario de creación de `Institution` debe exigir:
  - `name` (String)
  - `minutesPerHour` (Entero: 45 o 60)
  - `paymentType` (Enum: `HOURLY` o `FIXED_SALARY`)
  - `periodType` (Enum: `SEMESTER` o `TRIMESTER`)
- **RF 1.1.2 (Cálculo Financiero):** Para instituciones con `paymentType = HOURLY`, el backend debe calcular las "Horas Nómina" dividiendo los minutos totales cronometrados de la sesión entre el valor de `minutesPerHour`.

### HU 1.2: Desacoplamiento de Contenido (Alias)

> Como profesor, quiero crear mis temas base y asignarles diferentes nombres comerciales según la sede, para reutilizar mi material sin duplicar datos.

- **RF 1.2.1 (Creación Core):** El sistema permitirá crear un registro en `CoreContent` con un nombre genérico (ej. "React Base").
- **RF 1.2.2 (Asignación a Sede):** El sistema permitirá enlazar un `CoreContent` a un `Location` (ej. CESDE Bello) insertando un registro en la tabla `StudyPlan`. Este registro exigirá el campo `aliasName` (ej. "Front 2").
- **RF 1.2.3 (Renderizado Condicional):** En toda la interfaz de usuario, cuando se liste un grupo, el sistema mostrará únicamente el `aliasName` del `StudyPlan`. Nunca el nombre del `CoreContent`.

---

## ÉPICA 2: Motor de Calendario y Festivos (CORE LÓGICO)

### HU 2.1: Configuración de Recesos (Blackout Dates)

> Como profesor, quiero registrar fechas de receso global (ej. Semana Santa), para que el calendario no asigne clases en esos días.

- **RF 2.1.1 (Registro Global):** El sistema debe permitir ingresar un `startDate` y `endDate` en la tabla `BlackoutDate`.
- **RF 2.1.2 (Bloqueo Estricto):** Ningún algoritmo de generación de calendario (Regular o Empresarial) puede insertar un registro en la tabla `Session` si la fecha calculada cae dentro del rango de un `BlackoutDate`.

### HU 2.2: Generación de Grupo Regular (Fechas Estrictas)

> Como profesor, quiero crear un grupo regular con fechas fijas, para que el sistema calcule mis sesiones respetando el inicio y fin del semestre.

- **RF 2.2.1 (Entrada de Datos):** El formulario exige `startDate`, `endDate`, `studyPlanId` y un array de horarios (Día de la semana de 1 a 7, `startTime`, `durationHours`). Soporta horarios asimétricos (múltiples registros para el mismo grupo).
- **RF 2.2.2 (Iteración de Fechas):** El backend debe iterar día por día desde `startDate` hasta `endDate`. Si el día coincide con un día del horario programado:
  - a) Consulta si la fecha es Festivo (mediante API o tabla de festivos) o receso (`BlackoutDate`).
  - b) Si ES festivo/receso: Inserta registro en `Session` con `isHoliday = true` y `durationHours = 0`.
  - c) Si NO ES festivo: Inserta registro en `Session` con fecha, horas correspondientes e `isHoliday = false`.
- **RF 2.2.3 (Novedades y Reposiciones):** La app no tendrá botón de cancelación por cortes de luz. Sin embargo, para los festivos, debe existir un botón "Programar Recuperación" que inserte un nuevo registro manual en `Session` con `isRecovery = true` y pida fecha y hora.

### HU 2.3: Generación de Grupo Empresarial (Sesiones Estrictas)

> Como profesor, quiero crear un grupo empresarial definiendo un número exacto de clases, para garantizar la cobertura del contrato.

- **RF 2.3.1 (Entrada de Datos):** El formulario exige `startDate`, `totalSessions` (Entero) y el array de horarios. NO pide `endDate`.
- **RF 2.3.2 (Algoritmo de Desplazamiento):** El backend iniciará un contador en 0. Iterará días hacia el futuro a partir de `startDate`.
  - a) Si el día coincide con el horario Y NO es festivo/receso: Inserta registro en `Session`, incrementa el contador +1.
  - b) Si el día ES festivo/receso: Ignora la fecha, no inserta nada en la base de datos, no incrementa el contador. Continúa al día siguiente.
  - c) El bucle `while` se detiene estrictamente cuando `contador == totalSessions`. La fecha final calculada se actualiza en el campo `endDate` del `ClassGroup`.

---

## ÉPICA 3: Infraestructura Google Drive (Ejecución Directa)

### HU 3.1: Creación de Estructura Base de Drive

> Como profesor, quiero que al guardar un grupo se cree automáticamente la carpeta en Drive, para tener mis espacios públicos y privados listos.

- **RF 3.1.1 (Conexión Directa):** El sistema no usará Apps Script. Hará peticiones REST POST a `https://www.googleapis.com/drive/v3/files`.
- **RF 3.1.2 (Creación Padre):** Creará una carpeta. El nombre estará compuesto literalmente por: `[Código Ficha (si existe)] - [AliasName] - [InternalName]`. Guardará el `folderId` resultante.
- **RF 3.1.3 (Subcarpetas):** Inmediatamente, enviará peticiones paralelas (`Promise.all`) para crear dos carpetas dentro del Padre: "Pública" y "Privada".
- **RF 3.1.4 (Permisos y Enlace):** A la carpeta "Pública", el backend le inyectará un permiso `role="reader"`, `type="anyone"`. Extraerá el `webViewLink` de la respuesta de Google y lo guardará en la tabla `DriveConfig` para mostrarlo en la UI.

### HU 3.2: Generación de Subcarpetas Diarias con Resiliencia

> Como sistema, quiero crear carpetas por cada sesión de clase, para organizar los archivos día por día, evitando caídas si el usuario borra la carpeta manualmente.

- **RF 3.2.1 (Filtro de Sesiones):** El backend leerá la tabla `Session` del grupo. Solo iterará sobre las sesiones donde `isHoliday == false`. (Las sesiones en cero, no generan carpeta).
- **RF 3.2.2 (Validación de Resiliencia):** Antes de crear las carpetas diarias en Drive, el backend debe hacer un GET del `folderId` Padre. Si la API de Google devuelve `404 Not Found` (eliminación accidental manual), el backend abortará la creación y devolverá un modal a la UI: **"La carpeta raíz no fue encontrada en Drive. Revise su papelera o vuelva a enlazar el grupo"**.
- **RF 3.2.3 (Nomenclatura Diaria):** Si la carpeta padre existe, creará subcarpetas bajo la convención estricta: `Clase [X] - [DD/MM/YYYY]`.

### HU 3.3: Offboarding (Cierre de Semestre)

> Como profesor, quiero limpiar mi Drive con un solo clic al acabar el grupo, para revocar accesos y liberar espacio de mi cuota.

- **RF 3.3.1 (Borrado Lógico):** Al accionar el botón "Cerrar Grupo", el backend tomará el `publicFolderId` del grupo y enviará una petición PATCH a Google Drive con el cuerpo `{"trashed": true}`.
- **RF 3.3.2 (Preservación):** La carpeta "Privada" (`privateFolderId`) no debe ser alterada ni eliminada bajo ninguna circunstancia.

---

## ÉPICA 4: IA y Momentos Evaluativos

### HU 4.1: Asignación de Momentos (M1, M2, M3)

> Como sistema, quiero marcar automáticamente qué sesiones corresponden a evaluaciones, para gatillar los avisos al profesor.

- **RF 4.1.1 (Regla SENA):** Si la `Institution.periodType` es `TRIMESTER`, el sistema actualizará el campo `evaluationMoment` de las sesiones correspondientes a las semanas 2 (M1), 6 (M2) y 10 (M3) basándose en la fecha cronológica de la sesión.
- **RF 4.1.2 (Regla CESDE Regular):** Si es `SEMESTER` y Grupo `REGULAR`, asignará M1 en semana 6, M2 en semana 12 y M3 en semana 17.
- **RF 4.1.3 (Regla Empresarial):** Dividirá `totalSessions / 3` y redondeará al entero más cercano para distribuir M1, M2 y M3 de forma equidistante.

### HU 4.2: Examen RAG Estricto y PDF

> Como profesor, quiero generar un examen mediante IA basado solo en mis temas, para obtener un PDF descargable y guardado en Drive.

- **RF 4.2.1 (Extracción de Contexto):** Al pedir el examen, el backend leerá la tabla `SessionLog` de todas las sesiones anteriores a la fecha actual. Si no hay registros en la bitácora, NO bloqueará al usuario; mostrará un input de texto vacío para que escriba manualmente los temas.
- **RF 4.2.2 (System Prompt Restringido):** La petición a la IA (OpenAI/Anthropic) debe contener la instrucción literal:
  > "Genera un examen sobre los siguientes temas. REGLA ESTRICTA: No uses conocimiento externo. Si un tema no está en la lista proporcionada, no lo incluyas".
- **RF 4.2.3 (Formato PDF):** La respuesta de la IA (Markdown) debe ser convertida en backend a formato PDF (`.pdf`) utilizando una librería (ej. `puppeteer` o `pdfkit`).
- **RF 4.2.4 (Depósito Doble):** El backend generará dos PDFs:
  - a) `Examen_[AliasName].pdf` → Se carga mediante la API en la carpeta Pública del grupo en Drive.
  - b) `Solucionario_y_Rubrica_[AliasName].pdf` → Se carga mediante la API en la carpeta Privada del grupo en Drive.
