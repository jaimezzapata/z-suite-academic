# Guía de Estilos y Dirección Visual (Minimalismo Pastel Interactivo)

Este documento define la identidad visual, paleta de colores, tipografía, comportamiento responsivo y las reglas de interacción/animación para `z-suite-academic`.

---

## 1. Dirección Visual Estricta

- **Filosofía:** Minimalismo Plano (Flat Minimalism). Cero degradados (Gradients), cero efectos tridimensionales exagerados.
- **Contraste y Espaciado:** Uso generoso del espacio en blanco, bordes finos de alto contraste y sombras extremadamente sutiles para dar profundidad de forma limpia.
- **Enfoque de Animación:** Microinteracciones fluidas pero rápidas (máximo 200ms). Nada de animaciones lentas o intrusivas. El movimiento debe guiar la vista del usuario, no distraerlo.
- **Acceso inicial:** La app no tendrá landing page promocional. La primera impresión del producto será la vista de `login`, seguida por `registro` como flujo complementario.
- **Lenguaje visual de autenticación:** Las pantallas de acceso deben verse como parte del producto, no como una maqueta vacía. Deben usar composición limpia, una card principal clara, color de acción bien definido y texto mínimo.

---

## 2. Paleta de Colores (Pastel Sólido)

Para diferenciar claramente los contextos de la app sin cansar la vista, utilizaremos tonos pastel de alta legibilidad sobre fondos limpios.

### A. Fondos y Bases (Lienzo Neutro)

| Elemento | Clase | Valor |
|---|---|---|
| Fondo Principal | `bg-slate-50` | `#F8FAFC` (Blanco con un tinte frío, reduce la fatiga visual) |
| Contenedores / Tarjetas | `bg-white` | `#FFFFFF` (Para destacar elementos clave sobre el fondo) |
| Bordes | `border-slate-100` o `border-slate-200` | Bordes sutiles y limpios |

### B. Colores Temáticos (Por Institución)

**CESDE (Azul Pastel):**
- Fondo: `bg-blue-50` (`#EFF6FF`)
- Borde/Detalle: `border-blue-200` (`#BFDBFE`)
- Texto: `text-blue-700` (`#1D4ED8`)

**SENA (Esmeralda Pastel):**
- Fondo: `bg-emerald-50` (`#ECFDF5`)
- Borde/Detalle: `border-emerald-200` (`#A7F3D0`)
- Texto: `text-emerald-700` (`#047857`)

### C. Alertas y Estado (Sonner & Toasts)

| Estado | Fondo | Texto |
|---|---|---|
| Éxito | Verde menta (`#D1E7DD`) | Verde oscuro (`#0F5132`) |
| Error | Rosa pastel (`#F8D7DA`) | Rojo oscuro (`#842029`) |
| Advertencia | Amarillo vainilla (`#FFF3CD`) | Marrón oscuro (`#664D03`) |

---

## 3. Tipografía

Buscamos una tipografía geométrica, ultra-legible en pantallas y con un gran diseño para números (crucial para horas de clase y códigos de fichas).

**Tipografía Principal:** Geist Sans o Inter.

**Escala de Tamaños:**

| Clase | Tamaño | Uso |
|---|---|---|
| `text-xs` | 12px | Subtextos, etiquetas de momentos (M1, M2) |
| `text-sm` | 14px | Texto base de la app, inputs, tablas |
| `text-base` | 16px | Descripciones, botones primarios |
| `text-lg` | 18px | Títulos de tarjetas y resúmenes |
| `text-xl` a `text-2xl` | 20px - 24px | Encabezados de módulo, dashboard |

---

## 4. Animaciones y Transiciones Fluidas

Toda la interactividad debe configurarse usando transiciones rápidas y amigables. Usaremos transiciones nativas de Tailwind optimizadas.

### A. Comportamiento del Cursor y Botones

- **Botones e Inputs** (`duration-200 ease-out`): Los cambios de color de fondo al hacer hover deben tomar exactamente 200 milisegundos con una curva de salida suave.
- **Efecto de Presión** (`active:scale-95 transition-transform`): Al hacer clic físico en cualquier botón principal, este debe reducir su tamaño ligeramente (5%) y volver a su tamaño original de forma instantánea al soltarlo para dar feedback táctil.

### B. Transiciones de Rutas y Modales

- **Aparición de Modales** (`animate-in fade-in zoom-in-95 duration-150`): Los modales no deben "aparecer" de golpe ni caer desde el cielo de forma exagerada. Deben realizar un leve aumento de tamaño desde el 95% al 100% acompañado de un desvanecimiento (fade-in) rápido de 150ms.
- **Efecto Hover en Tarjetas** (`hover:-translate-y-1 hover:shadow-md transition-all`): Las tarjetas de los grupos o clases flotarán sutilmente 4 píxeles hacia arriba al pasar el mouse por encima.

---

## 5. Esqueletos de Carga (Skeletons) y Loaders

Para que la app se sienta rápida mientras consulta el espacio de Google Drive o el calendario, usaremos estados de carga animados e in-situ.

### A. El "Skeleton" de Carga

En lugar de una pantalla en blanco, las tarjetas de clases y del dashboard mostrarán bloques simulados.

- **Estilo:** Rectángulos con esquinas redondeadas (`rounded-md`), color gris neutro claro (`bg-slate-100`) y con la animación de pulso constante de Tailwind (`animate-pulse`).

### B. El "Loader" Directo (Para botones que ejecutan acciones)

Cuando le das al botón "Generar Examen", este debe deshabilitarse, cambiar su opacidad (`opacity-80`) y mostrar un pequeño círculo giratorio (spinner) de color sólido al lado del texto.

- **Estilo Spinner:** `border-2 border-current border-t-transparent animate-spin rounded-full h-4 w-4`.

---

## 6. Diseño Responsivo y Estructura (Grid System)

La app debe ser 100% utilizable en el celular del profesor (para revisar el salón en el que le toca clase a última hora) y en su computador.

- **Estructura Base Desktop:** Sidebar lateral fijo de navegación, área de contenido con ancho máximo centrado (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- **Estructura Base Móvil:** Sidebar oculto que aparece mediante un cajón lateral (drawer) de transición suave desde la izquierda, o barra de navegación inferior minimalista.

### Pantallas de acceso

- La ruta `/login` es la vista principal pública del sistema.
- La ruta `/registro` es la segunda vista pública.
- La ruta `/` debe redirigir a `/login`.
- Las pantallas de acceso no deben incluir una landing de marketing ni bloques decorativos sin propósito.
- Se deben evitar pills, etiquetas con borde innecesarias o marcos que hagan ver el producto incompleto.

**Grillas Dinámicas:**

- **Dashboard y Lista de Grupos:** 1 columna en móvil (`grid-cols-1`), 2 columnas en tablets (`md:grid-cols-2`), 3 columnas en desktop (`lg:grid-cols-3`).
- **Zonas de Toque (Touch Targets):** En dispositivos móviles, todos los botones interactivos e inputs deben tener una altura mínima de `h-11` (44px) para ser presionados cómodamente con el dedo.
