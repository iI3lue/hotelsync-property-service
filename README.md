# HotelSync — Property Service

Microservicio de catálogo hotelero de HotelSync: hoteles, tipos de habitación, habitaciones físicas y políticas de cancelación. Es la fuente de verdad del inventario físico que luego consume Rate & Availability.

- **Producción:** https://hotelsync-property-service.onrender.com
- **Puerto local:** 3001
- **Base de datos:** `property_db` (PostgreSQL 16)

## Responsabilidad

| Hace | No hace |
| --- | --- |
| CRUD de hoteles, tipos de habitación y habitaciones físicas | Gestionar disponibilidad diaria ni tarifas (eso es Rate & Availability) |
| Definir políticas de cancelación por hotel | Procesar reservas ni pagos |
| Publicar `physical-room.created` para que R&A cree inventario | Conocer datos de huéspedes |

## Tecnologías

Node.js ≥20 · TypeScript · Express · Prisma · PostgreSQL 16 · Zod · RabbitMQ (outbox opcional).

## Arquitectura interna

`Route → Controller → Service → Prisma`. Validación de entrada con Zod en el borde, errores normalizados con `AppError` (`{ error, message, statusCode }`). Los eventos se escriben en la tabla `EventOutbox` dentro de la misma transacción y un dispatcher los publica a RabbitMQ; sin `RABBITMQ_URL` quedan `pending` sin bloquear la operación.

## Endpoints

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | — | Estado del servicio |
| GET | `/v1/hotels` | — | Lista hoteles |
| POST | `/v1/hotels` | JWT | Crea un hotel |
| GET | `/v1/hotels/:id` | — | Detalle de hotel |
| PUT | `/v1/hotels/:id` | JWT | Actualiza un hotel |
| GET | `/v1/hotels/:id/room-types` | — | Tipos de habitación del hotel |
| GET | `/v1/hotels/:id/cancellation-policy` | — | Política de cancelación vigente |
| GET | `/v1/hotels/:hotelId/rooms` | — | Habitaciones físicas del hotel |
| POST | `/v1/hotels/:hotelId/rooms` | JWT + MANAGER del hotel / SUPER_ADMIN | Alta de habitación; publica `physical-room.created` |
| GET | `/v1/room-types/:id` | — | Detalle de tipo de habitación |
| POST | `/v1/room-types` | JWT | Crea tipo de habitación |
| PUT | `/v1/room-types/:id` | JWT | Actualiza tipo de habitación |
| GET | `/v1/cancellation-policies/:id` | — | Política por hotel |
| POST | `/v1/cancellation-policies` | — | Crea política |

## Modelo de datos

Tablas (`prisma/schema.prisma`): `Hotel`, `RoomType`, `CancellationPolicy`, `PhysicalRoom`, `EventOutbox`.

Migraciones en `prisma/migrations` (4). Seed con `npm run seed`: hoteles demo (p. ej. *Hotel Sync Centro*), tipos de habitación (*Standard Double*, *Deluxe Suite*, *Executive King*), habitaciones físicas y políticas de cancelación (p. ej. *Cancelación Flexible*).

## Comunicación

- **Evento publicado:** `physical-room.created` (exchange `hotelsync.events`, vía outbox). Lo consume Rate & Availability para dar de alta inventario.
- No realiza llamadas REST salientes a otros servicios.

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `NODE_ENV` | No | `development` / `production` |
| `PORT` | No | Puerto HTTP (default 3001) |
| `DATABASE_URL` | Sí | Cadena PostgreSQL de `property_db` |
| `DIRECT_URL` | No | Conexión directa prevista para migraciones (el esquema actual usa `DATABASE_URL`) |
| `AUTH_JWT_SECRET` | Sí | HS256 compartido con user-service (mín. 32 caracteres) |
| `RABBITMQ_URL` | No | Sin ella los eventos quedan `pending` |

Copiar `.env.example` a `.env` y completar los valores.

## Ejecución local

```bash
npm install
cp .env.example .env
npx prisma migrate deploy   # o npx prisma migrate dev
npm run seed
npm run dev                 # http://localhost:3001
```

## Despliegue

Render (Oregon, free): build `npm ci && npx prisma generate && npm run build`; start `npx prisma migrate deploy && npm start`; base Neon `property_db`. El plan free duerme tras 15 minutos de inactividad: la primera petición puede tardar ~60 s.

## Pruebas y verificación

```bash
npm test        # jest --passWithNoTests
npm run lint    # tsc --noEmit
curl https://hotelsync-property-service.onrender.com/health
```

## Respaldo de base de datos

```bash
pg_dump "$DATABASE_URL" -Fc -f property_db.dump
pg_restore --clean --if-exists -d "$DATABASE_URL" property_db.dump
```

En Neon también se puede restaurar a un punto en el tiempo desde el historial del proyecto.

## Estructura

```
src/{routes,controllers,services,validators,middleware,lib}
prisma/{schema.prisma,seed.ts,migrations}
tests/
```
