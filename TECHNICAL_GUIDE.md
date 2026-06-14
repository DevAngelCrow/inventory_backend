# 🛠️ Guía Técnica Completa — Backend Template NestJS

> **Propósito**: Documento de referencia para que un **desarrollador** o **agente de IA** pueda comprender, navegar y extender esta plantilla de forma rápida y precisa.

---

## Tabla de Contenidos

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura General](#2-arquitectura-general)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Convenciones de Nombrado](#4-convenciones-de-nombrado)
5. [Configuración y Variables de Entorno](#5-configuración-y-variables-de-entorno)
6. [Sistema de Módulos](#6-sistema-de-módulos)
7. [Patrón CQRS (Command Query Responsibility Segregation)](#7-patrón-cqrs)
8. [Sistema de Autenticación y Autorización](#8-sistema-de-autenticación-y-autorización)
9. [Sistema de Permisos (RBAC)](#9-sistema-de-permisos-rbac)
10. [Base de Datos — Prisma ORM](#10-base-de-datos--prisma-orm)
11. [Sistema de Transacciones](#11-sistema-de-transacciones)
12. [Sistema de Excepciones](#12-sistema-de-excepciones)
13. [DTOs y Respuestas HTTP](#13-dtos-y-respuestas-http)
14. [Middleware y Filtros](#14-middleware-y-filtros)
15. [Interceptores Globales](#15-interceptores-globales)
16. [Decoradores Personalizados](#16-decoradores-personalizados)
17. [Sistema de Caché (Redis)](#17-sistema-de-caché-redis)
18. [Colas de Trabajo (BullMQ)](#18-colas-de-trabajo-bullmq)
19. [Almacenamiento de Archivos](#19-almacenamiento-de-archivos)
20. [Auditoría](#20-auditoría)
21. [Observabilidad (Health, Métricas, Logging)](#21-observabilidad)
22. [Documentación de la API](#22-documentación-de-la-api)
23. [Seguridad](#23-seguridad)
24. [Docker y Despliegue](#24-docker-y-despliegue)
25. [Testing](#25-testing)
26. [Seeds (Datos Iniciales)](#26-seeds)
27. [Scripts Disponibles](#27-scripts-disponibles)
28. [Guía Paso a Paso: Crear un Nuevo Módulo](#28-guía-paso-a-paso-crear-un-nuevo-módulo)
29. [Guía Paso a Paso: Crear un Nuevo Endpoint](#29-guía-paso-a-paso-crear-un-nuevo-endpoint)
30. [Guía Paso a Paso: Agregar una Nueva Cola](#30-guía-paso-a-paso-agregar-una-nueva-cola)
31. [Patrones y Anti-Patrones](#31-patrones-y-anti-patrones)

---

## 1. Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | ≥ 18 | Runtime |
| **NestJS** | 11.x | Framework backend |
| **TypeScript** | 5.9+ | Lenguaje, compilado a ES2023 |
| **Prisma ORM** | 7.8+ | ORM con driver adapter `@prisma/adapter-pg` |
| **PostgreSQL** | 16 | Base de datos relacional |
| **Redis** | 7.x (Alpine) | Caché, colas BullMQ, idempotencia |
| **BullMQ** | 5.x | Colas de trabajo asíncronas |
| **Passport + JWT** | — | Autenticación |
| **Pino** | vía `nestjs-pino` | Logging estructurado JSON |
| **Prometheus** | `prom-client` + `@willsoto/nestjs-prometheus` | Métricas |
| **Swagger + Scalar** | `@nestjs/swagger` + `@scalar/nestjs-api-reference` | Documentación API |
| **Docker** | multi-stage build | Contenedorización |
| **SonarQube** | — | Análisis de calidad de código |
| **Resend** | 6.x | Servicio de envío de emails |
| **AWS S3 SDK** | v3 | Almacenamiento de archivos en la nube |
| **Helmet** | 8.x | Seguridad de cabeceras HTTP |
| **Jest** | 30.x | Framework de testing |

### Alias de Paths

```json
// tsconfig.json
"paths": {
  "@/*": ["src/*"]
}
```

Esto permite imports como `import { X } from '@/modules/auth/...'` en lugar de rutas relativas largas.

---

## 2. Arquitectura General

La plantilla implementa una **Arquitectura Hexagonal** (Ports & Adapters) combinada con **CQRS** dentro de cada módulo:

```
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  Controllers ← Guards ← Middleware ← Filters            │
│  Prisma Repos │ Email Processors │ Storage Backends      │
├─────────────────────────────────────────────────────────┤
│                     APPLICATION                          │
│  Commands/Handlers │ Queries/Handlers │ Services │ DTOs  │
│  Ports (interfaces abstractas)                           │
├─────────────────────────────────────────────────────────┤
│                       DOMAIN                             │
│  Entities │ Value Objects │ Repositories (abstractos)    │
│  Domain Exceptions │ Enums │ Validators                  │
└─────────────────────────────────────────────────────────┘
```

### Flujo de una Request

```
HTTP Request
  → Middleware (RequestId, Idempotency)
  → Guard (JWT Auth → Permissions → Throttle)
  → Controller (Swagger docs, validation pipe)
  → CommandBus/QueryBus (CQRS)
  → Handler (Application Layer)
  → Port/Repository (Domain abstraction)
  → Implementation (Infrastructure — Prisma, Redis, S3)
  → Interceptors (Transaction, Audit, BigInt)
  → Filters (HttpException, Throttler)
  → HTTP Response (SuccessResponseDto / ErrorResponseDto)
```

---

## 3. Estructura de Directorios

```
📁 root/
├── 📁 prisma/
│   ├── schema.prisma          # Esquema completo de la BD
│   ├── migrations/            # Migraciones auto-generadas
│   └── seeds/                 # Seeders (core.seeder.ts + main.seeder.ts)
├── 📁 generated/prisma/       # Cliente Prisma generado (no editar)
├── 📁 public/                 # Archivos estáticos públicos
├── 📁 storage/                # Almacenamiento local de archivos
├── 📁 src/
│   ├── main.ts                # Bootstrap del servidor HTTP
│   ├── worker.ts              # Bootstrap del worker BullMQ (sin HTTP)
│   ├── app.module.ts          # Módulo raíz con guards globales
│   ├── 📁 modules/            # Módulos de negocio
│   │   ├── 📁 auth/           # Autenticación (login, registro, JWT, sesiones)
│   │   ├── 📁 security/       # Guards de permisos, decoradores RBAC
│   │   ├── 📁 identity-access-management/ # CRUD de usuarios, roles
│   │   ├── 📁 profile/        # Gestión de perfil (persona, dirección, documento)
│   │   ├── 📁 catalogs/       # Catálogos del sistema (países, estados, etc.)
│   │   ├── 📁 storage/        # Gestión de archivos (LOCAL / S3)
│   │   └── 📁 audit/          # Auditoría de acciones
│   ├── 📁 shared/             # Código compartido cross-cutting
│   │   ├── 📁 application/    # DTOs compartidos, excepciones de aplicación
│   │   ├── 📁 domain/         # Repositorios abstractos, value objects, excepciones de dominio
│   │   └── 📁 infrastructure/ # Configuración, guards, middleware, filtros, interceptores
│   └── 📁 scripts/            # Scripts utilitarios
├── 📁 test/                   # Tests e2e
├── prisma.config.ts           # Configuración de Prisma (datasource, seed)
├── Dockerfile                 # Multi-stage build (deps → build → runner)
├── docker-compose.yml         # PostgreSQL + Redis + SonarQube + App
└── .env.example               # Plantilla de variables de entorno
```

---

## 4. Convenciones de Nombrado

### Archivos

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Controller | `nombre.controller.ts` | `auth.controller.ts` |
| Service | `nombre.service.ts` | `find-user.service.ts` |
| Guard | `nombre.guard.ts` | `permissions.guard.ts` |
| Interceptor | `nombre.interceptor.ts` | `transaction.interceptor.ts` |
| Middleware | `nombre.middleware.ts` | `request-id.middleware.ts` |
| Decorator | `nombre.decorator.ts` | `transactional.decorator.ts` |
| DTO (Validación) | `nombre.dto.ts` | `register.dto.ts` |
| DTO (HTTP) | `nombre-http.dto.ts` | `auth-login-http.dto.ts` |
| Command | `nombre.command.ts` | `login.command.ts` |
| Handler | `nombre.handler.ts` | `login.handler.ts` |
| Query | `nombre.query.ts` | `get-sessions.query.ts` |
| Repository (Abstract) | `nombre.repository.ts` | `user-read.repository.ts` |
| Repository (Impl) | `nombre.implementation.ts` | `prisma-user-read.implementation.ts` |
| Seeder | `nombre.seeder.ts` | `ctl-country.seeder.ts` |
| Module | `nombre.module.ts` | `auth.module.ts` |
| Config | `nombre.config.ts` | `app.config.ts` |
| Exception | `nombre.exception.ts` | `not-found.exception.ts` |
| Value Object | `nombre.ts` | `pagination.ts` |

### Tablas de la Base de Datos

| Prefijo | Significado | Ejemplo |
|---|---|---|
| `ctl_` | Catálogo (datos de referencia, raramente cambian) | `ctl_country`, `ctl_permissions` |
| `mnt_` | Mantenimiento (datos operacionales, CRUD completo) | `mnt_user`, `mnt_people` |
| `rol_` | Relaciones de roles | `rol_permissions` |

### Módulos

Cada módulo sigue la estructura de capas:

```
📁 nombre-modulo/
├── nombre-modulo.module.ts    # Definición del módulo NestJS
├── 📁 application/            # Lógica de negocio
│   ├── 📁 commands/           # Escritura (CQRS)
│   │   └── 📁 nombre-command/
│   │       ├── nombre.command.ts
│   │       └── nombre.handler.ts
│   ├── 📁 queries/            # Lectura (CQRS)
│   ├── 📁 services/           # Servicios de aplicación
│   ├── 📁 ports/              # Interfaces/Ports (contratos)
│   ├── 📁 dtos/               # DTOs internos de aplicación
│   └── 📁 repositories/       # Repositorios abstractos de aplicación
├── 📁 domain/                 # Capa de dominio
│   ├── 📁 entities/           # Entidades de dominio
│   ├── 📁 value-objects/      # Objetos de valor
│   ├── 📁 ports/              # Ports de dominio
│   ├── 📁 repositories/       # Repositorios abstractos de dominio
│   └── 📁 enums/              # Enumeraciones de dominio
└── 📁 infrastructure/         # Implementaciones concretas
    ├── 📁 controllers/        # Controladores HTTP
    ├── 📁 implementation/     # Implementaciones de repos/ports
    ├── 📁 guards/             # Guards específicos del módulo
    ├── 📁 decorators/         # Decoradores específicos
    ├── 📁 strategies/         # Estrategias Passport
    ├── 📁 processors/         # Procesadores de colas BullMQ
    ├── 📁 dtos/               # DTOs de infraestructura (validación, HTTP)
    ├── 📁 config/             # Configuración del módulo (providers, repos)
    └── 📁 views/              # Templates HTML (emails, etc.)
```

---

## 5. Configuración y Variables de Entorno

### Validación Estricta al Arrancar

Todas las variables de entorno se validan al iniciar la aplicación mediante `class-validator` en:

📄 `src/shared/infrastructure/config/env.validation.ts`

Si alguna variable requerida falta o tiene un formato inválido, **la aplicación no arranca**.

### Configuraciones Tipadas (Namespaced Configs)

Las variables se agrupan en configuraciones tipadas registradas como `load` en `ConfigModule`:

| Archivo Config | Namespace | Variables clave |
|---|---|---|
| `app.config.ts` | `app` | `PORT`, `NODE_ENV`, `APP_URL`, `API_URL`, `CLIENT_URL` |
| `database.config.ts` | `database` | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` |
| `jwt.config.ts` | `jwt` | `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` |
| `email.config.ts` | `email` | `EMAIL_HOST`, `EMAIL_FROM`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` |
| `redis.config.ts` | `redis` | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_URL` |
| `throttler.config.ts` | `throttler` | `THROTTLE_GLOBAL_TTL`, `THROTTLE_GLOBAL_LIMIT`, `THROTTLE_LOGIN_*` |

### Variables Clave

```bash
# Base de datos
DATABASE_URL            # Connection string completa (auto-construida en dev)
DATABASE_DIRECT_URL     # Para producción (bypasa PgBouncer si aplica)
DATABASE_POOL_MAX       # Máximo de conexiones en el pool (default: 10)

# JWT — AMBOS deben tener ≥32 caracteres
JWT_SECRET              # Firma access tokens
JWT_REFRESH_SECRET      # Firma refresh tokens (DEBE ser diferente a JWT_SECRET)

# Redis
REDIS_PASSWORD          # ≥12 caracteres obligatorio

# Storage
PROVIDER_STORAGE_CODE   # LOCAL | S3

# Seguridad
AUTH_MAX_LOGIN_ATTEMPTS # Default: 5
AUTH_LOCKOUT_MINUTES    # Default: 15
PASSWORD_HISTORY_COUNT  # Default: 5

# Rate Limiting
THROTTLE_GLOBAL_TTL     # Ventana de tiempo global (ms)
THROTTLE_GLOBAL_LIMIT   # Requests permitidos en la ventana global
THROTTLE_LOGIN_TTL      # Ventana de tiempo para login (ms)
THROTTLE_LOGIN_LIMIT    # Intentos de login en la ventana

# Documentación API
ENABLE_API_DOCS         # true/false — habilita /api/docs y /docs
SWAGGER_USER            # Requerido en producción si docs están habilitados
SWAGGER_PASSWORD        # ≥16 caracteres, no puede ser valor débil conocido
```

---

## 6. Sistema de Módulos

### Módulos del negocio (`src/modules/`)

| Módulo | Responsabilidad |
|---|---|
| **auth** | Login, registro, logout, refresh tokens, verificación email, reset password, sesiones |
| **security** | Guard de permisos (`PermissionsGuard`), decoradores `@Permissions()` / `@RequireAllPermissions()` |
| **identity-access-management** | CRUD de usuarios, roles, asignación de permisos a roles |
| **profile** | Gestión de personas, direcciones, documentos de identidad |
| **catalogs** | Catálogos de referencia: países, divisiones geográficas, estados, géneros, estados civiles |
| **storage** | Upload/gestión de archivos (backend pluggable: LOCAL ↔ S3) |
| **audit** | Registro de auditoría (`mnt_audit_log`), decorador `@Auditable()` |

### Módulos compartidos (`src/shared/`)

| Capa | Contenido |
|---|---|
| **shared/domain** | `ReadRepository<T,TId>`, `WriteRepository<T>`, value objects de paginación, excepciones de dominio, enums, validadores |
| **shared/application** | DTOs compartidos, excepciones de aplicación (`UnauthorizedException`, `ForbiddenException`) |
| **shared/infrastructure** | Prisma, caché, colas, configs, decoradores, interceptores, middleware, filtros, health checks, métricas, servicios compartidos, vistas HTML |

### Guards Globales (registrados como `APP_GUARD` en `AppModule`)

```typescript
// Orden de ejecución:
1. JwtPassportAuthGuard   // Valida JWT (skip con @SkipAuth())
2. PermissionsGuard       // Valida permisos RBAC (skip si no hay @Permissions())
3. ThrottlerGuard         // Rate limiting global
```

### Interceptores Globales (registrados como `APP_INTERCEPTOR`)

```typescript
1. TransactionInterceptor  // Envuelve en $transaction si @Transactional()
2. AuditableInterceptor    // Emite log de auditoría si @Auditable()
```

---

## 7. Patrón CQRS

La plantilla usa `@nestjs/cqrs` para separar operaciones de lectura y escritura:

### Crear un Command

```typescript
// application/commands/mi-accion/mi-accion.command.ts
export class MiAccionCommand {
  constructor(
    public readonly dato1: string,
    public readonly dato2: number,
  ) {}
}
```

### Crear un Handler

```typescript
// application/commands/mi-accion/mi-accion.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MiAccionCommand } from './mi-accion.command';

@CommandHandler(MiAccionCommand)
export class MiAccionHandler implements ICommandHandler<MiAccionCommand> {
  constructor(
    private readonly miRepo: MiRepositoryPort,
    // inyectar dependencias...
  ) {}

  async execute(command: MiAccionCommand): Promise<ResultDto> {
    // lógica de negocio...
  }
}
```

### Registrar Handlers en el Módulo

Los handlers se registran en archivos de configuración separados:

```typescript
// infrastructure/config/commands-handlers.config.ts
import { Provider } from '@nestjs/common';
import { MiAccionHandler } from '../../application/commands/mi-accion/mi-accion.handler';

export const commandHandlerProviders: Provider[] = [
  MiAccionHandler,
];
```

### Usar desde un Controller

```typescript
// En el controller:
constructor(private readonly commandBus: CommandBus) {}

@Post('mi-accion')
async miAccion(@Body() body: MiAccionDto): Promise<SuccessResponseDto<null>> {
  const command = new MiAccionCommand(body.dato1, body.dato2);
  await this.commandBus.execute(command);
  return new SuccessResponseDto<null>(null, HttpStatus.CREATED, 'Acción ejecutada');
}
```

### Queries

El patrón es idéntico pero con `@QueryHandler`, `IQueryHandler` y `QueryBus`.

---

## 8. Sistema de Autenticación y Autorización

### Flujo de Autenticación

```
1. POST /api/v1/auth/sign-up     → Registro + envío email verificación (BullMQ)
2. GET  /api/v1/auth/verify-email → Verifica email con token
3. POST /api/v1/auth/login        → Valida credenciales → JWT access + refresh token
4. POST /api/v1/auth/refresh-token → Renueva tokens con refresh token (Bearer header)
5. POST /api/v1/auth/logout       → Invalida access token actual
6. DELETE /api/v1/auth/sessions   → Revoca todas las sesiones
7. DELETE /api/v1/auth/sessions/:id → Revoca sesión específica
```

### JWT Strategy

- **Access Token**: firmado con `JWT_SECRET`, duración configurable vía `JWT_EXPIRES_IN`
- **Refresh Token**: firmado con `JWT_REFRESH_SECRET`, duración vía `JWT_REFRESH_EXPIRES_IN`
- Los tokens de access revocados se almacenan en Redis como blacklist
- Los refresh tokens se hashean y almacenan en `mnt_session_refresh_token`

### Payload del JWT (JwtPayload)

```typescript
interface JwtPayload {
  id: string;           // UUID del usuario
  id_people: string;    // UUID de la persona asociada
  user_name: string;    // Nombre de usuario
  id_status: string;    // UUID del estado del usuario
  last_access: Date;    // Último acceso
  is_validated: boolean; // Email verificado
  permissions: string[]; // Array de permisos del usuario
}
```

### Rutas Públicas (sin JWT)

Usar el decorador `@SkipAuth()`:

```typescript
import { SkipAuth } from '@/modules/auth/infrastructure/decorators/public-route.decorator';

@SkipAuth()
@Post('login')
async login() { ... }
```

### Rutas Públicas por Infraestructura

`/metrics` y los health checks están excluidos del auth a nivel de guard y prefijo:
- `/api/v1/health`, `/api/v1/health/live`, `/api/v1/health/ready`
- `/metrics`

### Account Lockout

Después de `AUTH_MAX_LOGIN_ATTEMPTS` (default 5) intentos fallidos, la cuenta se bloquea por `AUTH_LOCKOUT_MINUTES` (default 15). Se lanza `AccountLockedException` con un `retry_after` en la respuesta HTTP (status 423).

### Password History

El sistema almacena las últimas `PASSWORD_HISTORY_COUNT` (default 5) contraseñas hasheadas y previene su reutilización en `mnt_password_history`.

---

## 9. Sistema de Permisos (RBAC)

### Modelo de Datos

```
User ← mnt_user_rol → Role ← rol_permissions → Permission ← ctl_category_permissions
                                                    ↓
                                          mnt_route_permissions → Route (frontend)
```

### Decoradores de Permisos

```typescript
import { Permissions, RequireAllPermissions } from '@/modules/security/infrastructure/decorators/permissions.decorator';

// El usuario necesita AL MENOS UNO de estos permisos:
@Permissions('ver-usuarios', 'editar-usuarios')

// El usuario necesita TODOS estos permisos:
@RequireAllPermissions('ver-usuarios', 'editar-usuarios')
```

### Guard de Verificación de Propiedad

Para endpoints donde el usuario solo puede acceder a sus propios recursos:

```typescript
import { CheckAuthenticatedUser } from '@/modules/auth/infrastructure/decorators/check-authenticated-user.decorator';
import { CheckAuthenticatedUserGuard } from '@/modules/auth/infrastructure/guards/check-authenticated-user.guard';

@UseGuards(CheckAuthenticatedUserGuard)
@CheckAuthenticatedUser('id')  // Compara req.user.id con req.params.id
@Put('update-profile/:id')
async updateProfile(@Param('id') id: string) { ... }
```

El guard permite acceso si:
- `req.user.id === req.params[paramName]`, ó
- `req.user.user_name === req.params[paramName]`, ó
- El usuario tiene el permiso `'ver-perfil-usuario'` (acceso admin)

### Caché de Permisos

Los permisos del usuario se cachean en Redis (`user:{id}:permissions`) por 1 hora tras login exitoso.

---

## 10. Base de Datos — Prisma ORM

### Prisma con Driver Adapter (pg)

La plantilla usa `@prisma/adapter-pg` con un `Pool` de `pg` nativo, lo que permite:
- Pool de conexiones tuneable vía env (`DATABASE_POOL_MAX`, etc.)
- Compatible con PgBouncer en producción

### PrismaService

📄 `src/shared/infrastructure/persistence/prisma/prisma.service.ts`

```typescript
// Siempre usar prisma.client en lugar de this directamente:
const result = await this.prisma.client.mnt_user.findUnique({ ... });
```

`prisma.client` retorna:
- El `TransactionClient` activo si hay una transacción en curso (vía `@Transactional()`)
- La instancia PrismaClient normal si no hay transacción

### Generación del Cliente

```bash
npm run prisma:generate    # Genera el cliente en generated/prisma/
```

### Migraciones

```bash
npm run prisma:migrate      # Dev: crear/aplicar migraciones
npm run prisma:migrate:prod # Producción: solo aplicar
```

### Prisma Studio

```bash
npm run prisma:studio      # UI visual para explorar la BD
```

### Esquema Prisma — Convenciones

- Output del cliente: `../generated/prisma` (moduleFormat: `cjs`)
- Datasource: `postgresql` (sin URL hardcodeada, se resuelve en `prisma.config.ts`)
- Todos los IDs son `UUID` (`@id @default(uuid()) @db.Uuid`)
- Soft delete: campo `deleted_at DateTime?` en todas las tablas principales
- Timestamps: `created_at`, `updated_at`, `deleted_at` tipo `Timestamp(0)` o `Timestamp(6)`
- Índices en todas las foreign keys y campos de búsqueda frecuente

---

## 11. Sistema de Transacciones

### Decorador `@Transactional()`

```typescript
import { Transactional } from '@/shared/infrastructure/decorators/transactional.decorator';

@Post('crear-algo')
@Transactional()  // Todo el handler se ejecuta en una transacción Prisma
async crear(@Body() body: CrearDto) {
  // Si alguna operación falla, se hace rollback automático
}
```

### Cómo Funciona

1. `TransactionInterceptor` (global) verifica si el handler tiene metadata `transactional`
2. Si la tiene, envuelve toda la ejecución en `prisma.$transaction()`
3. `TransactionContextService` usa `AsyncLocalStorage` para propagar el `TransactionClient`
4. Cualquier repositorio que use `prisma.client` automáticamente usa el mismo `TransactionClient`

### Regla importante

> ⚠️ En los repositorios, **siempre** usar `this.prisma.client` en lugar de `this.prisma` directamente para que las transacciones funcionen correctamente.

---

## 12. Sistema de Excepciones

### Jerarquía de Excepciones

```
Error
├── DomainException           → Errores de reglas de negocio
│   ├── NotFoundException     → 404
│   ├── ConflictException     → 409
│   ├── ValidationException   → 400
│   ├── BadRequestException   → 400
│   ├── AccountLockedException → 423
│   └── InvalidValueObjectException → 400
├── ApplicationException      → Errores de capa de aplicación
│   ├── UnauthorizedException → 401
│   └── ForbiddenException    → 403
└── InfrastructureException   → Errores de infraestructura
    ├── DatabaseException     → 503
    ├── ExternalServiceException → 502
    └── PayloadTooLargeException → 413
```

### ExceptionMapper

📄 `src/shared/infrastructure/http/mappers/exception-mapper.ts`

El `ExceptionMapper` traduce automáticamente:
- **Excepciones de dominio/aplicación/infraestructura** → HTTP status codes apropiados
- **Errores Prisma** → Excepciones de dominio:
  - `P2002` (unique violation) → `ConflictException` (409)
  - `P2025` (record not found) → `NotFoundException` (404)
  - `P2003` (FK violation) → `BadRequestException` (400)
  - `P2014` (relation violation) → `BadRequestException` (400)

### Cómo Lanzar Excepciones

```typescript
// Desde la capa de dominio:
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
throw new NotFoundException('User', userId);

// Desde la capa de aplicación:
import { UnauthorizedException } from '@/shared/application/exceptions/unauthorized.exception';
throw new UnauthorizedException('Invalid credentials', ErrorCode.AUTH_INVALID_CREDENTIALS);

// Los errores de Prisma (P2002, P2025, etc.) se traducen automáticamente
// No es necesario catch manual en los repositorios
```

### Formato de Respuesta de Error

```json
{
  "statusCode": 404,
  "errorCode": "NOT_FOUND",
  "message": "User with id '...' not found",
  "code": "DOMAIN_ERROR",
  "type": "NOTFOUND",
  "timestamp": "2026-06-13T06:00:00.000Z",
  "path": "/api/v1/auth/...",
  "requestId": "uuid-v4"
}
```

---

## 13. DTOs y Respuestas HTTP

### Respuesta Exitosa

```typescript
import { SuccessResponseDto } from '@/shared/infrastructure/http/dtos/http-success-response.dto';

return new SuccessResponseDto<MiDto>(data, HttpStatus.OK, 'Operación exitosa');
```

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operación exitosa",
  "timestamp": "2026-06-13T06:00:00.000Z"
}
```

### Respuesta Paginada

```typescript
import { HttpPaginatedResponseDto } from '@/shared/infrastructure/http/dtos/http-paginated-response.dto';

return new HttpPaginatedResponseDto<MiDto>(items, totalItems, totalPages, currentPage, perPage);
```

```json
{
  "data": [...],
  "total_items": 50,
  "total_page": 5,
  "current_page": 1,
  "per_page": 10
}
```

### Validación de DTOs

La plantilla usa `class-validator` + `class-transformer` con un `ValidationPipe` global:

```typescript
// whitelist: true       → Elimina propiedades no decoradas
// forbidNonWhitelisted  → Lanza error si recibe propiedades no decoradas
// transform: true       → Transforma tipos automáticamente
```

---

## 14. Middleware y Filtros

### Middleware

| Middleware | Ruta | Propósito |
|---|---|---|
| `RequestIdMiddleware` | `*` (todas) | Asigna/propaga `X-Request-ID` en cada request |
| `IdempotencyMiddleware` | POST, PUT | Si el header `Idempotency-Key` (UUID) está presente, cachea la respuesta en Redis (24h) y la replaya en requests duplicados |

### Filtros de Excepción

| Filtro | Propósito |
|---|---|
| `HttpExceptionFilter` | Catch-all: traduce excepciones a respuesta HTTP estandarizada, log estructurado, métricas 4xx/5xx |
| `ThrottlerExceptionFilter` | Formatea errores de rate limiting con headers `Retry-After` |

---

## 15. Interceptores Globales

| Interceptor | Propósito |
|---|---|
| `TransactionInterceptor` | Envuelve handlers `@Transactional()` en `prisma.$transaction()` |
| `AuditableInterceptor` | Emite entry en `mnt_audit_log` para handlers `@Auditable()` (solo en éxito) |
| `BigIntTransformInterceptor` | Convierte `BigInt` a `string` en respuestas JSON (evita errores de serialización) |

---

## 16. Decoradores Personalizados

| Decorador | Ubicación | Propósito |
|---|---|---|
| `@SkipAuth()` | `auth/infrastructure/decorators` | Marca ruta como pública (sin JWT) |
| `@Permissions(...perms)` | `security/infrastructure/decorators` | Requiere AL MENOS UNO de los permisos |
| `@RequireAllPermissions(...perms)` | `security/infrastructure/decorators` | Requiere TODOS los permisos |
| `@Transactional()` | `shared/infrastructure/decorators` | Envuelve handler en transacción Prisma |
| `@Auditable(options)` | `audit/infrastructure/decorators` | Registra acción en log de auditoría |
| `@CheckAuthenticatedUser(param)` | `auth/infrastructure/decorators` | Verifica que el usuario autenticado sea el dueño del recurso |

### Ejemplo de Uso Combinado en un Controller

```typescript
@Permissions('editar-mi-perfil')
@UseGuards(CheckAuthenticatedUserGuard)
@CheckAuthenticatedUser('id')
@Auditable({ action: AuditAction.PROFILE_UPDATED, entityType: 'Profile' })
@Transactional()
@Put('update-profile/:id')
async updateProfile(@Param('id') id: string, @Body() body: UpdateDto) { ... }
```

---

## 17. Sistema de Caché (Redis)

### Módulo Global

📄 `src/shared/infrastructure/cache/cache.module.ts`

El `RedisCacheModule` es `@Global()` — disponible en toda la app sin importar.

### CatalogCacheService (Read-Through Cache)

Para datos que cambian poco (catálogos):

```typescript
import { CatalogCacheService } from '@/shared/infrastructure/cache/catalog-cache.service';

// Inyectar
constructor(private readonly cache: CatalogCacheService) {}

// Usar — si hay cache hit, retorna directo; si no, ejecuta factory y cachea
const countries = await this.cache.fetch(
  'countries:list',  // cache key
  3600,              // TTL en SEGUNDOS
  () => this.repo.getAll(),  // factory function
);

// Invalidar al escribir
await this.cache.invalidate('countries:list');
```

> El cache es **tolerante a fallos**: si Redis se cae, las queries van directo a la BD sin romper.

### Cache Directo (CACHE_MANAGER)

```typescript
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

await this.cacheManager.set('key', value, ttlMs);
const hit = await this.cacheManager.get<T>('key');
await this.cacheManager.del('key');
```

---

## 18. Colas de Trabajo (BullMQ)

### Configuración

📄 `src/shared/infrastructure/queues/queues.module.ts`  
📄 `src/shared/infrastructure/queues/queues.constants.ts`

### Colas Registradas

```typescript
export const QUEUE_NAMES = {
  SEND_EMAIL_VERIFICATION: 'send-email-verification',
  SEND_PASSWORD_RESET: 'send-password-reset',
} as const;
```

### Registrar una Cola en un Módulo

```typescript
// En el module:
BullModule.registerQueue({ name: QUEUE_NAMES.MI_COLA }),

// Dashboard (opcional):
BullBoardModule.forFeature({ name: QUEUE_NAMES.MI_COLA, adapter: BullMQAdapter }),
```

### Crear un Processor

```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '@/shared/infrastructure/queues/queues.constants';

@Processor(QUEUE_NAMES.MI_COLA)
export class MiColaProcessor extends WorkerHost {
  async process(job: Job<MiPayloadType>): Promise<void> {
    // Procesar el job...
  }
}
```

### Agregar Jobs a la Cola

```typescript
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

constructor(@InjectQueue(QUEUE_NAMES.MI_COLA) private readonly queue: Queue) {}

await this.queue.add('mi-job', { dato: 'valor' });
```

### Worker Independiente

📄 `src/worker.ts`

La plantilla incluye un entrypoint `worker.ts` que levanta la app **sin servidor HTTP** para procesar jobs independientemente:

```bash
npm run start:worker       # Desarrollo (watch mode)
npm run start:worker:prod  # Producción
```

### Bull Board Dashboard

Disponible en `/admin/queues` (protegido con JWT — requiere `Authorization: Bearer <token>`, cookie `queues_access`/`docs_access`, o query param `?token=`).

---

## 19. Almacenamiento de Archivos

### Arquitectura Pluggable (Strategy Pattern)

```
StorageBackend (abstract)
├── LocalStorageBackend   # Escribe en ./storage/
└── S3StorageBackend      # Sube a bucket S3 / MinIO / R2 / B2
```

### StorageBackendRegistry

Resuelve el backend correcto según `PROVIDER_STORAGE_CODE`:

```typescript
const backend = this.storageRegistry.resolve('LOCAL'); // o 'S3'
const { path } = await backend.upload(file);
```

### Agregar un Nuevo Backend

1. Crear clase que extienda `StorageBackend`
2. Implementar `readonly code: string` y `upload(file): Promise<{path}>`
3. Registrar en `StorageBackendRegistry`

### Validación de Archivos

- `multerImageOptions`: configuración de Multer para imágenes
- `validateFileMagicBytes`: verifica que los magic bytes del archivo coincidan con el MIME type declarado

---

## 20. Auditoría

### Decorador `@Auditable()`

```typescript
import { Auditable } from '@/modules/audit/infrastructure/decorators/auditable.decorator';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';

@Auditable({
  action: AuditAction.REGISTER,     // Tipo de acción
  entityType: 'User',                // Entidad afectada (opcional)
  entityIdFrom: 'body.email',        // Dónde leer el entity_id (default: 'params.id')
})
```

`entityIdFrom` acepta:
- `'params.id'` (default)
- `'body.campo'`
- `'result.campo'`
- Una función `(ctx) => string | undefined`

### Servicio de Auditoría Manual

```typescript
import { AuditLogService } from '@/modules/audit/application/services/audit-log.service';

this.auditLog.log({
  action: AuditAction.LOGIN_SUCCESS,
  user_name: 'admin',
  user_id: 'uuid',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  metadata: { extra: 'info' },
  entity_type: 'User',
  entity_id: 'uuid',
});
```

### Acciones de Auditoría Disponibles

```typescript
enum AuditAction {
  LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
  REVOKE_ALL_SESSIONS, TOKEN_REFRESH,
  REGISTER, PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED,
  DOCS_ACCESS_GRANTED, DOCS_ACCESS_DENIED,
  USER_CREATED_BY_ADMIN,
  ROLE_CREATED, ROLE_UPDATED, ROLE_STATUS_TOGGLED,
  PERMISSION_CREATED, PERMISSION_UPDATED, PERMISSION_STATUS_TOGGLED,
}
```

---

## 21. Observabilidad

### Health Checks

| Endpoint | Propósito | Auth |
|---|---|---|
| `GET /api/v1/health` | Full health (DB + Redis) | Público |
| `GET /api/v1/health/live` | Liveness probe (sin I/O) | Público |
| `GET /api/v1/health/ready` | Readiness probe (DB + Redis) | Público |

Indicadores custom: `PrismaHealthIndicator`, `RedisHealthIndicator`.

### Métricas Prometheus

Endpoint: `GET /metrics` (público, sin prefijo `/api`, sin versionado).

#### Métricas de Negocio

```typescript
auth_login_total{result="success|failure"}
auth_register_total
auth_password_reset_total{step="requested|completed"}
storage_files_uploaded_total{provider="LOCAL|S3"}
http_4xx_errors_total{status="400|401|403|..."}
http_5xx_errors_total{status="500|502|503|..."}
```

Plus: métricas por defecto de Node.js (heap, GC, event loop) vía `prom-client`.

### Logging Estructurado (Pino)

- **Desarrollo**: `pino-pretty` con colorización
- **Producción**: JSON puro, nivel `info`
- **Redacción automática** de campos sensibles:
  ```
  authorization, cookie, set-cookie, password, new_password,
  old_password, token, refresh_token, accessToken, access_token
  ```
- Cada log incluye el `requestId` del middleware

---

## 22. Documentación de la API

### Swagger UI

Accesible en `/api/docs` cuando `ENABLE_API_DOCS=true`.

### Scalar Docs

Accesible en `/docs` — interfaz alternativa más moderna (tema: `bluePlanet`).

### Protección de Docs

Los docs están protegidos por cookie JWT (`docs_access`):
1. El usuario accede a `/api/docs/login`
2. Envía su JWT de la API vía `POST /api/v1/auth/docs-access`
3. El servidor verifica el permiso `ver-documentacion-api`
4. Establece una cookie `httpOnly` + `sameSite: strict`

### Decoradores Swagger en Controllers

```typescript
@ApiBearerAuth('JWT-auth')           // Indica que requiere JWT
@ApiOperation({ summary: 'Descripción' })
@ApiResponse({ status: 200, description: 'Éxito' })
@ApiResponse({ status: 401, description: 'No autorizado' })
@ApiConsumes('multipart/form-data')   // Para uploads
@ApiBody({ type: MiDto })
@ApiExcludeEndpoint()                 // Oculta del docs
```

---

## 23. Seguridad

### Checklist de Seguridad en Producción

La aplicación **falla al iniciar** si en producción (`NODE_ENV != development`):

- `JWT_SECRET === JWT_REFRESH_SECRET`
- `SHOW_STACK_TRACE === 'true'`
- `ENABLE_API_DOCS=true` sin `SWAGGER_USER` y `SWAGGER_PASSWORD`
- `SWAGGER_PASSWORD` < 16 caracteres o es un valor débil conocido

### Cabeceras de Seguridad

- **Helmet**: CSP estricta, HSTS con preload, X-Content-Type-Options, etc.
- **Permissions-Policy**: deshabilita cámara, micrófono, geolocalización, pago, USB
- **CSP relajada** solo para rutas de docs (`/api/docs`, `/docs`)

### Rate Limiting

- **Global**: configurable vía `THROTTLE_GLOBAL_TTL` / `THROTTLE_GLOBAL_LIMIT`
- **Login**: throttler dedicado más restrictivo (`THROTTLE_LOGIN_*`)
- **Per-endpoint**: override con `@Throttle({ global: { ttl: ..., limit: ... } })`
- **Skip**: `@SkipThrottle()` para desactivar en un endpoint

### Validación de Entrada

- `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`
- Body size limitado a `50kb` (JSON y URL-encoded)
- Validación de magic bytes en uploads de archivos
- Idempotencia vía header `Idempotency-Key` en POST/PUT

### CORS

Configurado dinámicamente desde `CLIENT_URL` + `CORS_ORIGINS` (comma-separated).

### Versionado de API

URI-based: `/api/v1/...` (default), extensible con `@Version('2')` en controllers.

### Graceful Shutdown

```typescript
app.enableShutdownHooks();
process.on('SIGTERM', () => shutdown());
process.on('SIGINT', () => shutdown());
server.keepAliveTimeout = 65_000;  // > ALB default (60s) para evitar 502s
server.headersTimeout = 66_000;
```

---

## 24. Docker y Despliegue

### Multi-Stage Dockerfile

```
Stage 1 (deps)   → npm ci --include=dev
Stage 2 (build)  → prisma generate + npm run build + npm prune --omit=dev
Stage 3 (runner) → node:20-alpine, usuario no-root (appuser:1001), dumb-init
```

### Docker Compose (Desarrollo)

```bash
docker-compose up -d    # Levanta PostgreSQL, Redis, SonarQube, App
```

Servicios:
- **postgres** (puerto 5432)
- **redis** (puerto 6379)
- **sonarqube** (puerto 9000) + su BD
- **app** (puerto 3000, hot-reload con volúmenes)

### Healthcheck del Contenedor

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3
  CMD curl -fsS http://localhost:3000/api/v1/health/live || exit 1
```

---

## 25. Testing

### Configuración Jest

```json
{
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "testEnvironment": "node",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

### Scripts

```bash
npm test              # Ejecuta tests
npm run test:watch    # Watch mode
npm run test:cov      # Con coverage
npm run test:e2e      # Tests end-to-end
npm run test:debug    # Con inspector
```

### Coverage

Excluye: `*.spec.ts`, `*.module.ts`, `*.interface.ts`, `main.ts`, `node_modules/`, `dist/`

---

## 26. Seeds

### Dos Tipos de Seeders

| Seeder | Comando | Propósito |
|---|---|---|
| `core.seeder.ts` | `npm run seed:core` | Solo datos RBAC base (statuses, permisos, roles, rutas, admin). Reutilizable en cualquier proyecto. |
| `main.seeder.ts` | `npm run prisma:seed` | Core + datos de dominio (países, divisiones geográficas, géneros, etc.) |

### Orden de Ejecución del Core Seeder

1. Category Statuses → Statuses
2. Provider Storage
3. People (admin) → Users (admin)
4. Category Permissions → Permissions
5. Roles → Role Permissions
6. User Roles
7. Routes → Route Permissions

### Setup Completo

```bash
npm run dev:setup        # migrate + generate + seed (desarrollo)
npm run production:setup # migrate:prod + generate (producción)
```

---

## 27. Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run start:debug` | Debug con hot-reload |
| `npm run start:prod` | Producción (`node dist/src/main.js`) |
| `npm run start:worker` | Worker BullMQ (desarrollo) |
| `npm run start:worker:prod` | Worker BullMQ (producción) |
| `npm run build` | Compilar TypeScript |
| `npm run lint` | Lint + auto-fix |
| `npm run format` | Prettier |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate` | Crear/aplicar migraciones (dev) |
| `npm run prisma:migrate:prod` | Aplicar migraciones (prod) |
| `npm run prisma:seed` | Ejecutar seeder completo |
| `npm run seed:core` | Ejecutar solo core seeder |
| `npm run prisma:studio` | UI visual de la BD |
| `npm run prisma:db_pull` | Introspectar BD existente |
| `npm run dev:setup` | Setup completo desarrollo |
| `npm run production:setup` | Setup producción |
| `npm run sonar:scanner` | Análisis SonarQube |

---

## 28. Guía Paso a Paso: Crear un Nuevo Módulo

### 1. Crear la estructura de directorios

```
src/modules/mi-modulo/
├── mi-modulo.module.ts
├── application/
│   ├── commands/
│   ├── queries/
│   ├── services/
│   ├── ports/
│   ├── repositories/
│   └── dtos/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── enums/
└── infrastructure/
    ├── controllers/
    ├── implementation/
    ├── config/
    │   ├── repositories.config.ts
    │   ├── services.config.ts
    │   ├── commands-handlers.config.ts
    │   └── queries-handlers.config.ts
    └── dtos/
        └── validators/
```

### 2. Definir el módulo

```typescript
// mi-modulo.module.ts
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { MiController } from './infrastructure/controllers/mi.controller';
import { repositories } from './infrastructure/config/repositories.config';
import { serviceProviders } from './infrastructure/config/services.config';
import { commandHandlerProviders } from './infrastructure/config/commands-handlers.config';
import { queryHandlerProviders } from './infrastructure/config/queries-handlers.config';

@Module({
  imports: [
    RouterModule.register([{ path: 'mi-modulo', module: MiModuloModule }]),
    CqrsModule,
  ],
  controllers: [MiController],
  providers: [
    ...serviceProviders,
    ...repositories,
    ...commandHandlerProviders,
    ...queryHandlerProviders,
  ],
  exports: [...serviceProviders],
})
export class MiModuloModule {}
```

### 3. Configurar los providers

```typescript
// infrastructure/config/repositories.config.ts
import { Provider } from '@nestjs/common';
import { MiReadRepository } from '../../application/repositories/mi-read.repository';
import { PrismaMiReadImpl } from '../implementation/prisma-mi-read.implementation';

export const repositories: Provider[] = [
  { provide: MiReadRepository, useClass: PrismaMiReadImpl },
];
```

### 4. Registrar en AppModule

```typescript
// app.module.ts
import { MiModuloModule } from './modules/mi-modulo/mi-modulo.module';

@Module({
  imports: [
    // ... otros módulos
    MiModuloModule,
  ],
})
```

---

## 29. Guía Paso a Paso: Crear un Nuevo Endpoint

### 1. Crear el DTO de validación

```typescript
// infrastructure/dtos/validators/crear-item.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearItemDto {
  @ApiProperty({ description: 'Nombre del item' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
```

### 2. Crear el Command + Handler

```typescript
// application/commands/crear-item/crear-item.command.ts
export class CrearItemCommand {
  constructor(public readonly name: string, public readonly description?: string) {}
}

// application/commands/crear-item/crear-item.handler.ts
@CommandHandler(CrearItemCommand)
export class CrearItemHandler implements ICommandHandler<CrearItemCommand> {
  constructor(private readonly repo: MiWriteRepository) {}
  async execute(command: CrearItemCommand): Promise<void> {
    // lógica...
  }
}
```

### 3. Agregar al Controller

```typescript
@Permissions('crear-items')
@Auditable({ action: AuditAction.ITEM_CREATED, entityType: 'Item' })
@Transactional()
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Crear un nuevo item' })
@ApiResponse({ status: 201, description: 'Item creado' })
async create(@Body() body: CrearItemDto): Promise<SuccessResponseDto<null>> {
  await this.commandBus.execute(new CrearItemCommand(body.name, body.description));
  return new SuccessResponseDto<null>(null, HttpStatus.CREATED, 'Item creado');
}
```

### 4. Registrar el Handler

```typescript
// infrastructure/config/commands-handlers.config.ts
export const commandHandlerProviders: Provider[] = [
  CrearItemHandler,
];
```

---

## 30. Guía Paso a Paso: Agregar una Nueva Cola

### 1. Registrar el nombre

```typescript
// src/shared/infrastructure/queues/queues.constants.ts
export const QUEUE_NAMES = {
  SEND_EMAIL_VERIFICATION: 'send-email-verification',
  SEND_PASSWORD_RESET: 'send-password-reset',
  MI_NUEVA_COLA: 'mi-nueva-cola',  // ← agregar
} as const;
```

### 2. Registrar en el módulo

```typescript
// mi-modulo.module.ts
imports: [
  BullModule.registerQueue({ name: QUEUE_NAMES.MI_NUEVA_COLA }),
  BullBoardModule.forFeature({ name: QUEUE_NAMES.MI_NUEVA_COLA, adapter: BullMQAdapter }),
],
providers: [
  MiNuevaColaProcessor,
],
```

### 3. Crear el Processor

```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '@/shared/infrastructure/queues/queues.constants';

@Processor(QUEUE_NAMES.MI_NUEVA_COLA)
export class MiNuevaColaProcessor extends WorkerHost {
  async process(job: Job<{ dato: string }>): Promise<void> {
    console.log(`Procesando job ${job.id}:`, job.data);
  }
}
```

### 4. Producir Jobs

```typescript
constructor(@InjectQueue(QUEUE_NAMES.MI_NUEVA_COLA) private readonly queue: Queue) {}

await this.queue.add('tipo-job', { dato: 'valor' }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
});
```

---

## 31. Patrones y Anti-Patrones

### ✅ Patrones Correctos

| Patrón | Ejemplo |
|---|---|
| Usar `prisma.client` en repos | `this.prisma.client.mnt_user.findUnique(...)` |
| Lanzar excepciones de dominio | `throw new NotFoundException('User', id)` |
| Usar CQRS para operaciones complejas | `CommandBus.execute(new MiCommand(...))` |
| Validación en DTOs con decoradores | `@IsString() @IsNotEmpty()` |
| Usar `@Transactional()` para operaciones multi-tabla | — |
| Retornar `SuccessResponseDto` desde controllers | `return new SuccessResponseDto(data)` |
| Permisos en DB, no hardcoded | `@Permissions('nombre-permiso')` |
| Cache read-through para catálogos | `cache.fetch(key, ttl, factory)` |
| Invalidar cache al escribir | `cache.invalidate(key)` |
| Auditar acciones sensibles | `@Auditable()` o `auditLog.log()` |

### ❌ Anti-Patrones a Evitar

| Anti-Patrón | Por qué |
|---|---|
| Usar `this.prisma` directamente en repos | Rompe las transacciones — siempre usar `this.prisma.client` |
| Lanzar `HttpException` desde capas de dominio/aplicación | Viola la arquitectura hexagonal — usar excepciones de dominio |
| Aceptar `id_status` o `is_validated` del body en update profile | IDOR / mass-assignment — resolver server-side desde el JWT |
| Hardcodear permisos como booleans | Usar el sistema RBAC con `@Permissions()` |
| Ignorar idempotencia en mutations | Usar header `Idempotency-Key` en operaciones críticas |
| Almacenar refresh tokens en texto plano | Se hashean automáticamente en `mnt_session_refresh_token` |
| Hacer queries N+1 | Usar `include` de Prisma para relaciones |
| Bloquear el event loop con jobs pesados | Usar el worker independiente (`worker.ts`) |
| Commitear `.env` con secretos reales | Usar `.env.example` como plantilla, `.env` está en `.gitignore` |

---

> **Nota**: Esta guía se actualiza conforme evoluciona la plantilla. Consultar siempre el código fuente como fuente de verdad.
