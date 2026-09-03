# Matriz de cumplimiento

Fuente: las dos páginas de “Prueba Frontend Document.pdf”, leídas y revisadas visualmente antes de implementar. Los requisitos de publicación se ejecutarán tras la autorización explícita solicitada por el propietario.

## Requisitos del PDF

| Requisito | Estado | Evidencia |
| --- | --- | --- |
| React y TypeScript | Cumple | `src/main.tsx`, tipos estrictos y build con TypeScript |
| Tailwind CSS | Cumple | Plugin Vite, `src/index.css` y utilidades en componentes |
| Estado inicial desde un arreglo en data.json local | Cumple | `public/data.json` y fetch en `useContacts` |
| Mostrar nombre | Cumple | `ContactRow` y prueba de carga |
| Mostrar email | Cumple | `ContactRow` y prueba de carga |
| Mostrar teléfono | Cumple | `ContactRow`; “Sin teléfono” si no existe |
| Mostrar departamento | Cumple | `DepartmentBadge` con etiqueta y color |
| Generar UUID al agregar | Cumple | `crypto.randomUUID()`; pruebas de creación y del hook |
| Skeleton durante la carga | Cumple | `ContactSkeleton`; prueba con petición pendiente |
| EmptyState sin contactos | Cumple | `EmptyState`; pruebas de lista vacía y última eliminación |
| EmptyState con filtros sin resultados | Cumple | Estado específico y acción para limpiar filtros |
| Botón para eliminar | Cumple | Botón etiquetado por contacto y eliminación por id |
| Modal para agregar | Cumple | `ContactFormModal` con `<dialog>` nativo |
| Formik y Yup | Cumple | `useFormik` y `contactSchema` |
| Nombre obligatorio | Cumple | Yup `trim().required()` y pruebas |
| Email obligatorio | Cumple | Yup `email().required()` y pruebas |
| Teléfono | Cumple | Campo `tel` opcional conforme al tipo del PDF |
| Departamento obligatorio | Cumple | Yup restringe a los cuatro valores permitidos |
| Errores en tiempo real | Cumple | Validación al montar, cambiar y perder foco; errores asociados a campos |
| Botón deshabilitado con errores | Cumple | `isValid`, campos vacíos e `isSubmitting`; pruebas |
| Búsqueda por nombre | Cumple | Filtro reactivo sin distinguir mayúsculas |
| Chips por departamento | Cumple | Todos, Ventas, Desarrollo, Marketing y Soporte |
| Contador filtrado | Cumple | Región de estado con cantidad filtrada y total |
| Combinar nombre y departamento | Cumple | Condiciones simultáneas; prueba de intersección |
| Tipo Contact y unión Department | Cumple | `src/types/contact.ts`; teléfono opcional e id string |
| Código fuente en repositorio público | Pendiente de autorización | Rama `main` y commits locales; nombre previsto `geest-react-contact-manager` |
| README con instalación y ejecución | Cumple localmente | `README.md` incluye npm, Docker, pruebas y build |
| Entregar enlace al repositorio | Pendiente de publicación | No se creará ni subirá sin confirmación |
| Deploy público (opcional) | Pendiente de autorización | Aplicación estática lista en `dist/` |

## Requisitos adicionales del encargo

| Requisito | Estado / implementación |
| --- | --- |
| Proyecto nuevo en la carpeta abierta | Carpeta inicialmente vacía; repositorio independiente |
| Frontend exclusivo, sin servicios externos | Estado React y fetch de un archivo del mismo origen |
| Sin Redux, localStorage o autenticación | No se utilizan |
| Fetch asíncrono | Incluye AbortController, validación del formato y reintento |
| Validación desde el inicio y durante la escritura | Formik `validateOnMount`, `validateOnChange` y `validateOnBlur` |
| Limpieza y cierre después de crear | `resetForm`, cierre y actualización inmediata del estado |
| Responsive y estados visuales | Filas desde 1024 px, tarjetas en anchos menores; hover, foco, error y disabled |
| Modal con teclado, Escape, cerrar y clic fuera | Verificado en navegador; foco contenido y restaurado |
| Botones accesibles | Nombres accesibles; `aria-pressed` para chips; inputs con label |
| Sin librería completa de componentes | Componentes propios y SVG locales |
| Responsabilidades separadas | components, hooks, types y validation |
| Vitest y React Testing Library | Suite de 22 pruebas de comportamiento |
| Docker multi-stage, Compose y .dockerignore | Archivos incluidos; build con Node y servicio Nginx |
| Excluir dependencias y build de Git | `.gitignore` y `.dockerignore` |
| Rama main e identidad real | `main`; identidad Git preexistente verificada |
| Commits por etapas verificadas | Historial local con lint, test y build antes de cada commit |
| Revisar GitHub CLI antes de publicar | No disponible en PATH ni en su ruta habitual; autenticación pendiente |

## Verificación local

- `npm run lint`: correcto, sin advertencias.
- `npm run test`: 22 pruebas correctas en dos archivos.
- `npm run build`: correcto, incluye verificación estricta de TypeScript.
- Navegador Microsoft Edge: carga, creación y eliminación sin errores JavaScript.
- Responsive a 320, 390, 768, 1024 y 1440 px: sin desbordamiento horizontal en directorio y modal; capturas de escritorio y móvil revisadas.
- Teclado: foco inicial en Nombre, Tab contenido en modal, Escape, clic fuera y foco restaurado al botón de apertura.
- La comprobación es de accesibilidad básica y comportamiento; no equivale a una auditoría WCAG completa ni a pruebas en todos los navegadores.
- `npm run typecheck`: correcto.
- Docker: `docker compose up --build -d` construye y ejecuta correctamente; el servicio llega a estado `healthy`. `nginx -t` correcto, HTML y JSON responden HTTP 200; JSON contiene los ocho contactos iniciales.
- Producción en Nginx: creación, eliminación, teclado y los cinco anchos responsive verificados en navegador.
