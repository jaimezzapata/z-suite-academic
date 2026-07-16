# Definición del Stack Tecnológico (Enfoque Minimalista)

**Proyecto:** Plataforma SaaS de Gestión Docente
**Filosofía:** "In-House" (Menor dependencia de terceros). Todo lo que se pueda calcular o generar dentro del propio servidor, se hará sin llamar a APIs externas (excepto las estrictamente necesarias).

---

## 1. Core Framework: Frontend y Backend (Todo en uno)

**Tecnología:** Next.js (App Router) + TypeScript

- **¿Por qué?** Elimina la necesidad de tener un servidor Backend separado (como Express/Node) y un Frontend separado (React/Vite). Todo vive en un solo repositorio y se despliega junto.
- **Dependencia Externa:** Vercel (Hosting).

---

## 2. Base de Datos Pura (Sin BaaS)

**Motor de Base de Datos:** PostgreSQL
**Proveedor:** Vercel Postgres o Neon. (Base de datos relacional estricta, sin servicios extra que inflen la arquitectura).
**ORM:** Prisma

- **¿Por qué?** Prisma corre localmente en el servidor de Next.js. Se conecta a la base de datos mediante una simple cadena de conexión (`DATABASE_URL`). Mantiene el control total de los datos en casa.
- **Dependencia Externa:** Proveedor de PostgreSQL elegido.

---

## 3. Autenticación (In-House)

**Tecnología:** Auth.js (anteriormente NextAuth.js)

- **¿Por qué es Minimalista?** No dependes de servicios externos de pago como Clerk, Auth0 o Firebase Auth. Auth.js gestiona el flujo de Google OAuth y guarda los Tokens y las Sesiones directamente en tu propia tabla de PostgreSQL. Tú eres dueño del 100% de la data.
- **Dependencia Externa:** Google Cloud Console (Solo para habilitar la pantalla de consentimiento OAuth).

---

## 4. Manejo de Estado (Si Aplica)

**Tecnología:** `zustand`

- **¿Por qué?** Es una librería ligera, simple y suficiente para manejar estado global compartido sin añadir complejidad innecesaria. Encaja bien con la filosofía minimalista del proyecto.
- **Regla de Uso:** Solo se usará cuando el estado necesite compartirse entre múltiples módulos o layouts. El estado local seguirá resolviéndose con hooks de React y `react-hook-form`.

---

## 5. Generación de PDF (Local en Servidor)

**Tecnología:** `@react-pdf/renderer`

- **¿Por qué es Minimalista?** Existen servicios de pago (APIs) para generar PDFs, pero esta librería te permite diseñar el PDF usando componentes de React y compilarlo en un `Buffer` directamente dentro del servidor de Next.js. Cero llamadas a servicios externos, cero latencia extra.

---

## 6. Las 2 ÚNICAS Integraciones Externas Estrictas

Dado el modelo de negocio de la app, estas son las únicas salidas a internet que hará tu servidor:

1. **Google Drive API** (`googleapis` - npm)
   Obligatoria para cumplir la Promesa de Valor (crear carpetas sin Apps Script). Usa el token guardado en tu base de datos para hablar directamente con los servidores de Google.

2. **Generación IA** (`@google/genai` o SDK/cliente HTTP compatible con Gemini API)
   Obligatoria para la creación de exámenes. Inicialmente se usará **Gemini Flash** como proveedor de IA. Se le enviará el texto estricto de la bitácora local a la API del modelo para que devuelva el contenido en formato Markdown.

---

## Resumen de Cuentas Necesarias

Para que esta aplicación opere a nivel mundial, solo necesitas gestionar 3 cuentas:

1. **Vercel** (Para alojar el código y la Base de Datos).
2. **Google Cloud Platform** (Gratis, para las credenciales OAuth y API de Drive).
3. **Google AI Studio / Gemini API** (Para el uso del modelo Gemini Flash en la generación de exámenes).
