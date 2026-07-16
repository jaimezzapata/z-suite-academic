# Arquitectura Frontend y Patrones de Diseño

**Proyecto:** Plataforma SaaS de Gestión Docente
**Filosofía Principal:** Screaming Architecture (Feature-Sliced Design) + Principio de Responsabilidad Única (SRP).
**Framework:** Next.js (App Router) + TypeScript.

---

## 1. Patrones de Diseño Estrictos

### A. Separación de UI y Lógica (Custom Hooks)

Ningún componente de React (archivo `.tsx`) debe contener lógica de negocio, cálculos, o llamadas a APIs. Su única responsabilidad es pintar datos y recibir eventos del usuario.

- **La Vista** (`Component.tsx`): Solo contiene HTML/Tailwind y el mapeo de los datos.
- **El Cerebro** (`useComponent.ts`): Un Custom Hook hermano que maneja los estados, las validaciones y habla con los servicios. Retorna exactamente lo que la vista necesita.

### B. Manejo de Estado (Regla Pragmática)

El proyecto prioriza el estado local cuando una vista puede resolverse con `useState`, `useReducer`, `react-hook-form` o un custom hook encapsulado. No se debe introducir estado global por costumbre.

- **Estado local primero:** Formularios, modales, tabs, filtros locales y loaders de una sola vista se resuelven dentro del hook de la feature.
- **Estado global solo si aplica:** Cuando varios módulos o layouts necesiten compartir estado de forma consistente, se utilizará `zustand`.
- **No duplicar fuentes de verdad:** Los datos remotos deben conservar una sola fuente de verdad. Zustand no debe reemplazar el ciclo natural de lectura/escritura del backend; se usará para estado de interfaz global, preferencias, filtros persistentes, selección activa y datos transversales de sesión ya normalizados para UI.
- **Formulario != Store global:** El estado de formularios seguirá en `react-hook-form`, no en Zustand.

### C. Principio de Responsabilidad Única (SRP)

Cada función o clase hace una sola cosa.

- Si hay que validar un formulario, se hace en un esquema separado, no en la función de submit.
- Si hay que calcular "Horas Nómina" dividiendo por 45, se hace en una función pura en una carpeta de `utils/math.ts`, no dentro del componente que lo muestra.

---

## 2. Ecosistema UI y Librerías Base

Para mantener la estética moderna y el código limpio, se usarán estas herramientas exclusivas para el frontend:

- **Estilos:** Tailwind CSS. Todo el estilado se maneja por clases utilitarias.
- **Iconografía:** `lucide-react`. Iconos limpios, consistentes y ligeros.
- **Alertas / Notificaciones:** `sonner`. Reemplaza los `alert()` nativos y SweetAlert. Son notificaciones tipo "toast" minimalistas, elegantes y no bloquean la pantalla del usuario.
- **Validaciones y Reglas:** `zod`. Para esquemas de validación estrictos y tipados.
- **Manejo de Formularios:** `react-hook-form`. Integrado con Zod, evita los re-renders innecesarios y saca la lógica del formulario del componente UI.
- **Estado Global (si aplica):** `zustand`. Para estado compartido entre módulos o layouts cuando el alcance exceda una sola feature.

---

## 3. Estructura de Carpetas (Screaming Architecture)

El proyecto se estructurará agrupando por "Features" (Módulos de Negocio), no por tipo de archivo técnico. La carpeta `src` estará dividida en el Core de Next.js (`app`) y el dominio de tu aplicación (`features` y `shared`).

```
src/
├── app/                      # SOLO Rutas de Next.js (Pages y Layouts)
│   ├── (dashboard)/
│   │   ├── grupos/page.tsx   # Solo importa y renderiza la Feature "Groups"
│   │   └── drive/page.tsx
│   └── api/                  # Endpoints del Backend
│
├── features/                 # SCREAMING ARCHITECTURE: El corazón del negocio
│   │
│   ├── groups/               # Feature: Gestión de Grupos
│   │   ├── components/       # Componentes visuales puros (ej. GroupCard.tsx)
│   │   ├── hooks/            # Lógica aislada (ej. useCreateGroup.ts)
│   │   ├── services/         # Llamadas a la API (fetch a tu backend)
│   │   └── validations/      # Esquemas de Zod (ej. groupSchema.ts)
│   │
│   ├── calendar/             # Feature: Motor de Calendario
│   ├── drive-manager/        # Feature: Integración Drive
│   └── ai-exams/             # Feature: Exámenes IA
│
└── shared/                   # Código Global y Reutilizable (Cross-Feature)
    │
    ├── components/           # UI compartida (Botones, Inputs, Modales base)
    ├── hooks/                # Hooks globales (ej. useAuth, useMediaQuery)
    ├── stores/               # Stores globales con Zustand (solo si aplica)
    ├── utils/                # Funciones puras (Sin estado de React)
    │   ├── date-format.ts    # Formateo de fechas
    │   ├── math-rules.ts     # Cálculos (ej. minutos a horas nómina)
    │   └── regex.ts          # Expresiones regulares centrales
    │
    ├── libs/                 # Configuración de terceros
    │   ├── prisma.ts         # Cliente de DB
    │   └── sonner.ts         # Configuración global de las alertas
    │
    └── types/                # Interfaces y tipos globales de TypeScript
```

---

## 4. Ejemplo Práctico de Flujo (Crear Grupo)

Si seguimos el principio SRP y la separación de UI, el flujo para crear un grupo empresarial se vería así de limpio:

1. **`src/features/groups/validations/groupSchema.ts`**: Solo define que el nombre no esté vacío y la fecha sea válida usando Zod.
2. **`src/features/groups/services/groupApi.ts`**: Solo contiene el `fetch()` hacia `POST /api/groups`.
3. **`src/features/groups/hooks/useCreateGroup.ts`**: Usa React Hook Form y Zod. Llama a `groupApi`. Si falla, dispara un `toast.error()` de Sonner. Si es exitoso, dispara `toast.success()`. Retorna `{ form, onSubmit, isLoading }`.
4. **`src/features/groups/components/CreateGroupForm.tsx`** (LA UI): Importa el hook anterior. Pinta el `<form>`, los inputs de Tailwind y mapea los errores visuales. No sabe nada de APIs, ni de base de datos, ni de validaciones directas.

---

## 5. Regla de Uso para Zustand

Antes de crear una store global, se debe responder "sí" a por lo menos una de estas preguntas:

1. ¿Este estado debe ser consumido por múltiples rutas o layouts?
2. ¿La sincronización entre componentes hermanos o alejados está generando prop drilling innecesario?
3. ¿Este estado representa una preferencia global del usuario o una selección transversal de la app?

Si la respuesta es "no", el estado debe permanecer local a la feature.
