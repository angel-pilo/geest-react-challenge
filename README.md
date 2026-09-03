# React Challenge · Gestor de contactos

Prueba técnica frontend: un directorio de equipo con búsqueda y filtros combinados, creación de contactos y eliminación inmediata.

## Tecnologías

React 19, TypeScript, Vite 6, Tailwind CSS 4, Formik y Yup. Pruebas con Vitest y React Testing Library. Docker multi-stage con Node y Nginx.

## Funcionalidades

- Carga asíncrona de `public/data.json`, skeleton y recuperación ante errores.
- Lista responsive con nombre, email, teléfono opcional y departamento.
- Modal con validación reactiva, guardado deshabilitado si es inválido y UUID mediante `crypto.randomUUID()`.
- Búsqueda por nombre sin distinguir mayúsculas, combinada con chips de departamento.
- Contador de resultados y estados distintos para directorio vacío y filtros sin coincidencias.
- Eliminación inmediata, controles con etiquetas accesibles y modal con Escape, clic fuera, foco contenido y restauración del foco.

## Requisitos previos

- Node.js 22.12 o posterior (verificado con 22.14.0) y npm.
- Alternativamente, Docker Engine o Docker Desktop con contenedores Linux y Docker Compose v2.
- Navegador moderno compatible con `<dialog>` y `crypto.randomUUID()`. Usar localhost o HTTPS.

## Instalación y ejecución

Desde la carpeta del proyecto:

```bash
npm ci
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173). Si el puerto está ocupado, Vite informa el puerto alternativo.

## Docker

```bash
docker compose up --build
```

Abrir [http://localhost:8080](http://localhost:8080). El puerto se publica únicamente en el equipo local. La construcción ejecuta lint, pruebas y build; la imagen final contiene Nginx y los archivos estáticos. No requiere Node en el host.

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

El servicio incluye un healthcheck. Si el puerto 8080 está ocupado, cambiar el puerto del host en `docker-compose.yml`.

## Pruebas y build

```bash
npm run lint
npm run test
npm run typecheck
npm run build
npm run preview
```

`npm run test` ejecuta la suite una vez; `npm run test:watch` la mantiene abierta. `npm run build` verifica TypeScript y genera `dist/`. La vista de producción está en [http://localhost:4173](http://localhost:4173).

La suite cubre carga, skeleton, errores y reintento, filtros combinados, contadores, ambos estados vacíos, validación, UUID, creación, eliminación, cierre y restauración del foco del modal, cancelación de peticiones y reinicio del estado. La revisión en navegador comprueba además el diálogo nativo y el diseño responsive; jsdom simula `showModal` y `close`.

## Estructura principal

```text
public/data.json              Contactos iniciales ficticios
src/
  components/                 Lista, filas, filtros, modal y estados visuales
  hooks/useContacts.ts        Carga, errores y mutaciones del estado
  types/contact.ts            Contact, Department y validación del JSON
  validation/contactSchema.ts Esquema Yup y valores del formulario
  test/setup.ts               Configuración de pruebas
  App.tsx                     Composición y estado de los filtros
  main.tsx                    Entrada de React
  index.css                   Tailwind y estilos base mínimos
Dockerfile                    Construcción y servicio estático
docker-compose.yml            Ejecución local reproducible
nginx.conf                    Configuración de Nginx
docs/REQUIREMENTS.md           Matriz de cumplimiento y verificación
```

## Decisiones

Los cambios viven únicamente en el estado de React durante la sesión. **Al recargar se restaura `data.json`**: no hay localStorage, backend, API, base de datos, autenticación ni servicios externos. Los datos de ejemplo son ficticios.

Los filtros se mantienen al crear o eliminar: un contacto nuevo se muestra si coincide con los filtros activos. El contador junto al título indica el total; el contador del directorio indica los resultados filtrados. Nombre y email se guardan sin espacios en los extremos. El teléfono es libre y opcional. No se bloquean emails duplicados porque el requisito no lo solicita.

Se usan utilidades Tailwind, iconos SVG locales y fuentes del sistema, sin librería de componentes ni recursos remotos en tiempo de ejecución. La integración de Tailwind utiliza su [plugin oficial para Vite](https://tailwindcss.com/docs/installation/using-vite).

## Publicación

Repositorio público previsto: `geest-react-challenge`. Publicación y deploy pendientes de autorización del propietario. No se ha configurado un remoto ni se han publicado archivos. El enlace del repositorio y el deploy se agregarán después de publicarlos.
