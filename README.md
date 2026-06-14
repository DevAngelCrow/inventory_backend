<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.prisma.io/" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" width="100" alt="Prisma Logo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.typescriptlang.org/" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="100" alt="TypeScript Logo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.docker.com/" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="100" alt="Docker Logo" />
  </a>
</p>

<h1 align="center">Backend — Facturación Electrónica</h1>

<p align="center">
  Backend REST API construido con <strong>NestJS 11</strong>, <strong>TypeScript</strong>, <strong>Prisma ORM 7</strong> y <strong>PostgreSQL 16</strong>.
  Sigue los principios de <strong>Arquitectura Hexagonal</strong>, <strong>Domain-Driven Design (DDD)</strong> y <strong>CQRS</strong>.
</p>

---

## 📋 Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha rápida](#puesta-en-marcha-rápida)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura](#arquitectura)
- [Módulos](#módulos)
- [Flujo de una petición HTTP](#flujo-de-una-petición-http)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Base de datos](#base-de-datos)
- [Almacenamiento de archivos](#almacenamiento-de-archivos)
- [Autenticación y seguridad](#autenticación-y-seguridad)
- [Calidad de código](#calidad-de-código)
- [API Docs (Swagger)](#api-docs-swagger)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5 |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL 16 |
| Cache / Colas | Redis 7 (BullMQ) |
| Autenticación | JWT (Access + Refresh tokens) |
| Almacenamiento | Local ó AWS S3 (configurable) |
| Documentación | Swagger / Scalar |
| Contenedores | Docker + Docker Compose |
| Monitoreo | Prometheus + Pino Logger |
| Calidad | SonarQube |

---

## Requisitos previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose** (para levantar el entorno completo)
- `sonar-scanner` en el PATH del sistema _(opcional, solo para análisis de calidad)_
- Editor recomendado: **Visual Studio Code** con la extensión _SonarQube for IDE_

---

## Puesta en marcha rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/DevAngelCrow/facturacion_electronica_back_end.git
cd facturacion_electronica_back_end
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores. Ver sección [Variables de entorno](#variables-de-entorno) para más detalles.

### 3. Configurar SonarQube _(opcional)_

```bash
cp sonar-project.example.properties sonar-project.properties
```

### 4. Levantar los contenedores Docker

```bash
docker compose up -d
```

Esto levanta los siguientes servicios:

| Contenedor | Descripción | Puerto |
|---|---|---|
| `nest_app` | Aplicación NestJS | 3000 |
| `postgres_db` | Base de datos PostgreSQL | 5432 |
| `redis_queue` | Redis (caché + colas BullMQ) | 6379 |
| `sonarqube` | Análisis de calidad | 9000 |
| `sonarqube_postgres` | BD de SonarQube | — |

### 5. Inicializar la base de datos (migraciones + seed)

```bash
docker exec -it nest_app npm run dev:setup
```

Este comando ejecuta en secuencia: `prisma migrate dev` → `prisma generate` → `prisma db seed`.

### 6. Iniciar el servidor

```bash
# Modo desarrollo con hot-reload (dentro del contenedor)
docker exec -it nest_app npm run start:dev

# Modo producción
docker exec -it nest_app npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

---

## Variables de entorno

Copia `.env.example` a `.env` y ajusta cada variable según tu entorno.

### Servidor

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto HTTP del servidor | `3000` |
| `NODE_ENV` | Entorno (`development` / `production`) | `development` |
| `SHOW_STACK_TRACE` | Mostrar stack trace en errores | `false` |

### Base de datos

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL completa de conexión a PostgreSQL |
| `DB_HOST` | Host de PostgreSQL |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_PORT` | Puerto de PostgreSQL (default: `5432`) |
| `DB_PROVIDER` | Proveedor de BD para Prisma (`postgresql`) |

> **Pool de conexiones** _(opcionales)_:  
> `DATABASE_POOL_MAX`, `DATABASE_POOL_IDLE_TIMEOUT_MS`, `DATABASE_POOL_CONN_TIMEOUT_MS`

### JWT

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Secreto para firmar los access tokens |
| `JWT_EXPIRES_IN` | Expiración del access token (ej: `1d`) |
| `JWT_REFRESH_SECRET` | Secreto para firmar los refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token (ej: `7d`) |

### Correo electrónico

| Variable | Descripción |
|---|---|
| `EMAIL_HOST` | Proveedor de correo (ej: `gmail`) |
| `EMAIL_FROM` | Dirección de envío |
| `EMAIL_PORT` | Puerto SMTP |
| `EMAIL_USER` | Usuario SMTP |
| `EMAIL_PASSWORD` | Contraseña SMTP |
| `EMAIL_SECRET` | Secreto para tokens de verificación de email |

### Almacenamiento de archivos

| Variable | Descripción |
|---|---|
| `PROVIDER_STORAGE_CODE` | `LOCAL` o `S3` |
| `S3_REGION` | Región del bucket S3 _(solo si `S3`)_ |
| `S3_BUCKET` | Nombre del bucket _(solo si `S3`)_ |
| `S3_ACCESS_KEY_ID` | Clave de acceso AWS _(solo si `S3`)_ |
| `S3_SECRET_ACCESS_KEY` | Clave secreta AWS _(solo si `S3`)_ |
| `S3_ENDPOINT` | Endpoint personalizado (MinIO, R2, etc.) |
| `S3_PUBLIC_BASE_URL` | URL pública / CDN |

### Redis

| Variable | Descripción |
|---|---|
| `REDIS_HOST` | Host de Redis |
| `REDIS_PORT` | Puerto de Redis (default: `6379`) |
| `REDIS_PASSWORD` | Contraseña de Redis (mínimo 12 caracteres) |

### CORS y cliente

| Variable | Descripción |
|---|---|
| `CLIENT_URL` | URL del frontend (para CORS) |
| `CORS_ORIGINS` | Orígenes adicionales separados por coma _(opcional)_ |
| `CLIENT_VERIFY_EMAIL_ROUTE` | Ruta del frontend para verificación de email |
| `CLIENT_FORGOTTEN_PASSWORD` | Ruta del frontend para restablecimiento de contraseña |

### Swagger / Documentación

| Variable | Descripción |
|---|---|
| `ENABLE_API_DOCS` | Habilitar Swagger UI (`true` / `false`) |
| `SWAGGER_USER` | Usuario para acceso básico a los docs |
| `SWAGGER_PASSWORD` | Contraseña para acceso básico a los docs |

### Seguridad adicional _(opcionales)_

| Variable | Descripción | Default |
|---|---|---|
| `AUTH_MAX_LOGIN_ATTEMPTS` | Intentos de login antes de bloqueo | `5` |
| `AUTH_LOCKOUT_MINUTES` | Minutos de bloqueo de cuenta | `15` |
| `PASSWORD_HISTORY_COUNT` | Número de contraseñas anteriores bloqueadas | `5` |



---

## Scripts disponibles

```bash
# Iniciar la aplicación
npm run start               # Modo estándar
npm run start:dev           # Watch mode (hot-reload)
npm run start:debug         # Debug + watch
npm run start:prod          # Producción (desde /dist)

# Workers de BullMQ
npm run start:worker        # Worker en watch mode (solo procesadores de colas, sin HTTP)
npm run start:worker:prod   # Worker en producción

# Construcción
npm run build               # Compilar TypeScript a dist/

# Linting y formato
npm run lint                # ESLint con auto-fix
npm run format              # Prettier en src/ y test/

# Tests
npm run test                # Jest (unit tests)
npm run test:watch          # Jest en modo watch
npm run test:cov            # Cobertura de código
npm run test:e2e            # Tests end-to-end

# Prisma / Base de datos
npm run prisma:migrate      # Aplicar migraciones en desarrollo
npm run prisma:migrate:prod # Aplicar migraciones en producción
npm run prisma:generate     # Generar el cliente de Prisma
npm run prisma:seed         # Ejecutar seeders
npm run prisma:studio       # Abrir Prisma Studio
npm run prisma:db_pull      # Sincronizar schema desde la BD

# Setup combinado
npm run dev:setup           # migrate + generate + seed (desarrollo)
npm run production:setup    # migrate:prod + generate (producción)

# SonarQube
npm run sonar:scanner       # Ejecutar análisis de calidad
```

---

## Arquitectura

El proyecto implementa tres patrones arquitectónicos de manera conjunta:

```
┌─────────────────────────────────────────────────────┐
│                   ARQUITECTURA HEXAGONAL              │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   DOMAIN    │  │ APPLICATION │  │INFRASTRUCTURE│  │
│  │             │  │             │  │             │  │
│  │  Entities   │◄─│  Commands   │◄─│ Controllers │  │
│  │  Repositories│  │  Queries    │  │ Repositories│  │
│  │  Value Obj. │  │  Services   │  │ Strategies  │  │
│  │  Aggregates │  │  Use Cases  │  │ Guards      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Capas

| Capa | Responsabilidad |
|---|---|
| **Domain** | Reglas de negocio puras, entidades, value objects, interfaces de repositorios. Sin dependencias externas. |
| **Application** | Orquesta el dominio; contiene Commands, Queries, Handlers y Services. Usa CQRS via `@nestjs/cqrs`. |
| **Infrastructure** | Implementa los contratos del dominio. Contiene controladores HTTP, repositorios Prisma, guards JWT, strategies Passport, etc. |

### CQRS

Todas las acciones de escritura son **Commands** y las de lectura son **Queries**, despachados a través del `CommandBus` y `QueryBus` de NestJS CQRS.

```
Controller → CommandBus.execute(new XxxCommand(...))
                  └─► XxxHandler.execute(command)
                            └─► Service / Repository
```

---

## Módulos

### `auth` — Autenticación

Gestiona el ciclo de vida completo de la sesión de usuario.

**Endpoints principales** (`/api/v1/auth/...`):

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/sign-up` | Registro de nuevo usuario |
| `POST` | `/login` | Inicio de sesión (devuelve access + refresh tokens) |
| `POST` | `/logout` | Cierre de sesión |
| `POST` | `/refresh` | Renovar access token con refresh token |
| `GET` | `/verify-email` | Verificación de correo electrónico |
| `POST` | `/forgot-password` | Solicitar restablecimiento de contraseña |
| `POST` | `/reset-forgotten-password` | Restablecer contraseña con token |
| `PUT` | `/update-profile/:id` | Actualizar perfil del usuario (multipart/form-data) |
| `GET` | `/sessions` | Listar sesiones activas |
| `DELETE` | `/sessions/revoke` | Revocar una sesión específica |
| `DELETE` | `/sessions/revoke-all` | Revocar todas las sesiones |

**Commands disponibles:**
- `RegisterCommand`
- `LoginCommand`
- `LogoutCommand`
- `RefreshCommand`
- `VerifyEmailCommand`
- `GenerateTokenForgottenPasswordCommand`
- `ResetForgottenPasswordCommand`
- `UpdateProfileCommand`
- `RevokeSessionCommand` / `RevokeAllSessionsCommand`

---

### `profile` — Perfil de usuario

Gestiona la información personal del usuario: datos de persona, dirección y documentos de identidad.

**Entidades de dominio:**
- `Person` — nombre, fecha de nacimiento, género, estado civil, teléfono
- `Address` — calle, número, colonia, división geográfica
- `Document` — tipo de documento, número, descripción, imagen adjunta

**Sub-módulos (CQRS):**
- `person/commands/update-person`
- `address/commands/update-address`
- `document/commands/update-document`
- Queries correspondientes para lectura por ID

---

### `identity-access-management` (IAM) — Control de acceso

Gestiona usuarios, roles y permisos del sistema.

**Responsabilidades:**
- CRUD de usuarios del sistema
- Asignación de roles a usuarios
- Definición de permisos por módulo
- Consultas de usuario para autenticación (`UserReadRepository`)

---

### `storage` — Almacenamiento de archivos

Abstrae el backend de almacenamiento de archivos, soportando dos modos configurables vía `PROVIDER_STORAGE_CODE`:

| Modo | Descripción |
|---|---|
| `LOCAL` | Guarda archivos en `./storage/` del servidor. Solo para desarrollo o instancias únicas. |
| `S3` | Sube archivos a un bucket S3 o compatible (MinIO, Cloudflare R2, Backblaze B2). Recomendado para producción. |

La configuración de Multer, filtros de tipo de archivo y validación por _magic bytes_ se definen en `multer-file-filter.config.ts`.

---

### `catalogs` — Catálogos

Provee datos de referencia estáticos utilizados por otros módulos:
- Géneros
- Estados civiles
- Tipos de documentos
- Divisiones geográficas
- Estados de usuario

---

### `security` — Seguridad

Implementa los mecanismos de control de acceso a nivel de endpoint:
- Decorador `@Permissions(...)` para proteger rutas por permiso
- Guard `CheckAuthenticatedUserGuard` para verificar que el usuario autenticado solo acceda a sus propios recursos
- Control de bloqueo de cuenta por intentos fallidos de login

---

### `audit` — Auditoría

Registra las acciones críticas realizadas por los usuarios en el sistema:
- `AuditLogService` inyectable en cualquier módulo
- Trazabilidad de operaciones sensibles (login, cambios de perfil, etc.)

---

## Flujo de una petición HTTP

El siguiente ejemplo ilustra el flujo de `PUT /api/v1/auth/update-profile/:id`:

```
1. HTTP Request (multipart/form-data)
      │
      ▼
2. JwtAuthGuard        ← valida el Access Token
      │
      ▼
3. AuthController      ← parsea y valida el DTO (UpdateProfileBodyDto)
      │
      ▼
4. CommandBus          ← despacha UpdateProfileCommand
      │
      ▼
5. UpdateProfileHandler
      ├─► UpdatePersonHandler    → ImplPersonRepository (Prisma upsert)
      ├─► UpdateAddressHandler   → ImplAddressRepository (Prisma upsert)
      └─► UpdateDocumentHandler  → ImplDocumentRepository (Prisma upsert)
                                         │
                                         ▼
                                    PostgreSQL
```

> **Nota:** Los handlers de Profile se ejecutan dentro de una transacción compartida gracias al decorador `@Transactional`.

---

## Estructura de carpetas

```
📦 facturacion_electronica_back_end
├── 📁 prisma
│   ├── 📁 migrations          # Historial de migraciones de BD
│   ├── 📁 seeds               # Seeders de datos iniciales
│   └── 📄 schema.prisma       # Definición del schema de la BD
├── 📁 src
│   ├── 📁 modules
│   │   ├── 📁 auth            # Autenticación y sesiones
│   │   ├── 📁 profile         # Perfil de usuario (persona, dirección, documento)
│   │   ├── 📁 identity-access-management  # Usuarios, roles y permisos
│   │   ├── 📁 storage         # Almacenamiento de archivos (local / S3)
│   │   ├── 📁 catalogs        # Datos de referencia (géneros, tipos, etc.)
│   │   ├── 📁 security        # Guards y decoradores de autorización
│   │   └── 📁 audit           # Registro de auditoría
│   ├── 📁 shared
│   │   ├── 📁 domain          # Excepciones, value-objects y repositorios globales
│   │   ├── 📁 application     # DTOs y excepciones compartidos de aplicación
│   │   └── 📁 infrastructure  # Interceptores, filtros, decoradores y servicios globales
│   ├── 📄 app.module.ts       # Módulo raíz (contenedor de DI)
│   ├── 📄 main.ts             # Punto de entrada del servidor HTTP (API)
│   └── 📄 worker.ts           # Punto de entrada del worker BullMQ (sin HTTP)
├── 📁 storage                 # Archivos subidos (modo LOCAL)
├── 📁 test                    # Tests e2e
├── 📄 .env.example            # Plantilla de variables de entorno
├── 📄 docker-compose.yml      # Definición de servicios Docker
├── 📄 Dockerfile              # Imagen Docker de la aplicación
├── 📄 prisma.config.ts        # Configuración avanzada de Prisma
├── 📄 nest-cli.json           # Configuración de la CLI de NestJS
├── 📄 eslint.config.mjs       # Reglas de ESLint
├── 📄 .prettierrc             # Configuración de Prettier
├── 📄 tsconfig.json           # Configuración de TypeScript
└── 📄 package.json            # Dependencias y scripts del proyecto
```

### Anatomía de un módulo

Cada módulo sigue la misma estructura de tres capas:

```
📁 modules/<nombre-modulo>
├── 📁 domain
│   ├── 📁 entities            # Entidades de dominio (clases puras)
│   ├── 📁 repositories        # Interfaces (clases abstractas) de repositorios
│   ├── 📁 value-objects       # Value Objects inmutables
│   ├── 📁 ports               # Puertos para lógica adicional de dominio
│   └── 📁 aggregates          # Aggregates que combinan varias entidades
├── 📁 application
│   ├── 📁 dtos                # DTOs internos entre capas
│   ├── 📁 commands            # Commands CQRS + Handlers
│   ├── 📁 queries             # Queries CQRS + Handlers
│   ├── 📁 queries-repositories # Contratos de consultas complejas
│   ├── 📁 use-cases           # Casos de uso que coordinan repositorios
│   └── 📁 services            # Servicios compartidos entre módulos
└── 📁 infrastructure
    ├── 📁 config              # Configuración de providers de NestJS DI
    ├── 📁 controllers         # Controladores HTTP (REST)
    ├── 📁 dtos
    │   ├── 📁 http            # DTOs de respuesta HTTP
    │   └── 📁 validators      # DTOs de validación de entrada (class-validator)
    ├── 📁 guards              # Guards de autorización
    ├── 📁 strategies          # Estrategias Passport (JWT, local)
    ├── 📁 decorators          # Decoradores personalizados
    └── 📁 implementation      # Implementaciones concretas de repositorios (Prisma)
```

---

## Base de datos

### Migraciones

```bash
# Crear y aplicar una nueva migración (desarrollo)
npm run prisma:migrate

# Aplicar migraciones existentes en producción
npm run prisma:migrate:prod

# Generar el cliente Prisma después de cambios en el schema
npm run prisma:generate

# Explorar la BD visualmente
npm run prisma:studio
```

### Seeds

Los seeders se encuentran en `prisma/seeds/` y se ejecutan con:

```bash
npm run prisma:seed
```

El seed principal pobla la base de datos con datos de referencia esenciales (roles, permisos, catálogos, usuario administrador, etc.).

---

## Almacenamiento de archivos

### Modo LOCAL (desarrollo)

Los archivos se guardan en la carpeta `./storage/` del proyecto. Este modo **no es apto para producción en ambientes multi-instancia** ya que el almacenamiento es local al nodo.

```env
PROVIDER_STORAGE_CODE=LOCAL
```

### Modo S3 (producción)

Compatible con AWS S3 y proveedores S3-like (MinIO, Cloudflare R2, Backblaze B2).

```env
PROVIDER_STORAGE_CODE=S3
S3_REGION=us-east-1
S3_BUCKET=mi-bucket
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
# Opcional para proveedores alternativos:
S3_ENDPOINT=https://mi-minio.ejemplo.com
S3_FORCE_PATH_STYLE=true
```

---

## Autenticación y seguridad

### Tokens JWT

El sistema utiliza un esquema de **doble token**:

| Token | Duración | Uso |
|---|---|---|
| **Access Token** | 1 día (configurable) | Autenticar cada petición en el header `Authorization: Bearer <token>` |
| **Refresh Token** | 7 días (configurable) | Obtener un nuevo Access Token sin re-autenticar |

### Bloqueo de cuenta

Después de `AUTH_MAX_LOGIN_ATTEMPTS` (default: 5) intentos fallidos de login, la cuenta queda bloqueada por `AUTH_LOCKOUT_MINUTES` (default: 15 minutos).

### Historial de contraseñas

El sistema bloquea la reutilización de las últimas `PASSWORD_HISTORY_COUNT` (default: 5) contraseñas.

### Rate Limiting

Se aplica throttling global y específico en el endpoint de login para prevenir ataques de fuerza bruta.

---

## Calidad de código

### Linting y formato

```bash
npm run lint      # ESLint con auto-fix
npm run format    # Prettier
```

### Tests

```bash
npm run test          # Unit tests
npm run test:cov      # Con reporte de cobertura
npm run test:e2e      # End-to-end tests
```

### SonarQube

1. Asegúrate de tener `sonar-scanner` instalado y en el PATH.
2. Configura `sonar-project.properties` (desde el ejemplo).
3. Levanta SonarQube: ya está incluido en `docker-compose.yml` en el puerto `9000`.
4. Ejecuta el análisis:

```bash
npm run sonar:scanner
# o directamente:
sonar-scanner.bat
```

---

## API Docs (Swagger)

La documentación interactiva de la API está disponible cuando `ENABLE_API_DOCS=true`:

```
http://localhost:3000/api/docs
```

En entornos no-desarrollo, el acceso a los docs está protegido con autenticación básica (configurar `SWAGGER_USER` y `SWAGGER_PASSWORD`).

---

## Licencia

Este proyecto está bajo la licencia definida en el archivo [LICENSE](./LICENSE).