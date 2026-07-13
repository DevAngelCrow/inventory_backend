import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from './shared/infrastructure/http/filters/http-exception.filter';
import { ThrottlerExceptionFilter } from './shared/infrastructure/http/filters/throttler-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { BigIntTransformInterceptor } from './shared/infrastructure/interceptors/bigint-transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { verify as jwtVerify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const enableApiDocs = configService.get<boolean>('ENABLE_API_DOCS') === true;
  const clientUrl =
    configService.get<string>('CLIENT_URL') || 'http://localhost:5174';
  const isDevelopment =
    configService.get<string>('NODE_ENV')?.trim() === 'development';
  app.use(express.json({ limit: '50kb' }));
  app.use(express.urlencoded({ limit: '50kb', extended: true }));
  // gzip/deflate for JSON responses; defaults compress when size ≥1KB.
  // Disable if a reverse proxy (Nginx, Cloudflare) already handles it.
  app.use(compression());
  // Global strict CSP — applies to the API and to anything not under /docs.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'"],
          'style-src': ["'self'"],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'"],
        },
      },
      strictTransportSecurity: isDevelopment
        ? false
        : {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          },
    }),
  );
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)',
    );
    next();
  });
  const corsOriginsEnv = configService.get<string>('CORS_ORIGINS');
  const allowedOrigins: string[] = [
    clientUrl,
    ...(corsOriginsEnv
      ? corsOriginsEnv
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : []),
  ];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, idempotency-key',
  });
  app.setGlobalPrefix('api', {
    exclude: enableApiDocs
      ? [
          'docs',
          'api/docs',
          'api/docs-json',
          'metrics',
          'admin/queues',
          'admin/queues/(.*)',
        ]
      : ['metrics', 'admin/queues', 'admin/queues/(.*)'],
  });
  // URI-based versioning under /api/v{N}/... — controllers default to v1.
  // To introduce v2, add @Version('2') on the new controller and clients
  // can opt in by switching paths.
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(configService),
    new ThrottlerExceptionFilter(),
  );
  app.useGlobalInterceptors(new BigIntTransformInterceptor());
  // Auth + Permissions guards are registered as APP_GUARD providers in AppModule
  // so the DI container instantiates them once and the order is deterministic.
  //Swagger config
  const config = new DocumentBuilder()
    .setTitle('Backend template api')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
        description: 'Ingrese el JWT',
      },
      'JWT-auth',
    )
    .build();
  if (enableApiDocs) {
    // Looser CSP only for docs routes — Swagger/Scalar inject inline scripts
    // and styles, and Scalar pulls assets from cdn.jsdelivr.net.
    const docsCsp = helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
        },
      },
      strictTransportSecurity: isDevelopment
        ? false
        : {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          },
    });
    app.use(
      [
        '/api/docs',
        '/api/docs-json',
        '/api/docs/login',
        '/api/docs/logout',
        '/docs',
      ],
      docsCsp,
    );

    const document = SwaggerModule.createDocument(app, config);

    const jwtSecret = configService.get<string>('JWT_SECRET') ?? '';

    const themeColors: Record<string, string> = {
      COLOR_PRIMARY:
        configService.get<string>('EMAIL_COLOR_PRIMARY') ?? '#059669',
      COLOR_SURFACE:
        configService.get<string>('EMAIL_COLOR_SURFACE') ?? '#e0e7ff',
      COLOR_CARD:
        configService.get<string>('EMAIL_COLOR_BACKGROUND_CARD') ?? '#eef2ff',
      COLOR_TEXT: configService.get<string>('EMAIL_COLOR_PRIMARY') ?? '#059669',
      COLOR_TEXT_MUTED:
        configService.get<string>('EMAIL_TEXT_MUTED') ?? '#a5b4fc',
      COLOR_BORDER:
        configService.get<string>('EMAIL_COLOR_PRIMARY') ?? '#059669',
    };
    const docsLoginHtml = Object.entries(themeColors).reduce(
      (html, [key, val]) =>
        html.replaceAll(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), val),
      fs.readFileSync(
        path.join(
          __dirname,
          'shared',
          'infrastructure',
          'views',
          'docs-login.html',
        ),
        'utf-8',
      ),
    );

    // ── Login page ──────────────────────────────────────────────────────────
    app.use('/api/docs/login', (req: Request, res: Response) => {
      if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(docsLoginHtml);
    });

    // ── Logout ───────────────────────────────────────────────────────────────
    app.use('/api/docs/logout', (req: Request, res: Response) => {
      if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
      }
      res.clearCookie('docs_access', {
        httpOnly: true,
        sameSite: 'strict',
        secure: !isDevelopment,
        path: '/',
      });
      res.redirect('/api/docs/login');
    });

    // ── JWT-cookie middleware ────────────────────────────────────────────────
    const docsJwtCookieMiddleware = (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const cookieHeader = req.headers['cookie'] ?? '';
      const cookies: Record<string, string> = Object.fromEntries(
        cookieHeader.split(';').flatMap((pair) => {
          const idx = pair.indexOf('=');
          if (idx === -1) return [];
          const k = pair.slice(0, idx).trim();
          const v = decodeURIComponent(pair.slice(idx + 1).trim());
          return [[k, v]];
        }),
      );

      const token = cookies['docs_access'];
      if (!token) {
        const redirect = encodeURIComponent(req.originalUrl);
        return res.redirect(`/api/docs/login?redirect=${redirect}`);
      }

      try {
        jwtVerify(token, jwtSecret);
        return next();
      } catch {
        const redirect = encodeURIComponent(req.originalUrl);
        return res.redirect(`/api/docs/login?redirect=${redirect}`);
      }
    };

    app.use(['/api/docs', '/api/docs-json', '/docs'], docsJwtCookieMiddleware);

    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'API Docs - Swagger UI',
      swaggerOptions: {
        persistAuthorization: true,
      },
      jsonDocumentUrl: 'api/docs-json',
    });

    app.use(
      '/docs',
      apiReference({
        spec: {
          content: document,
        },
        theme: 'bluePlanet',
        layout: 'modern',
        metaData: {
          title: 'Backend Template API - Scalar',
          description: 'Documentación interactiva de la API',
          favicon: 'https://docs.scalar.com/favicon.png',
        },
      }),
    );
  }
  const port = configService.get<number>('PORT') ?? 3000;
  const appUrl = configService.get<string>('APP_URL');

  const jwtRefreshSecret =
    configService.get<string>('JWT_REFRESH_SECRET') ?? '';
  if (
    jwtRefreshSecret === 'your_jwt_refresh_secret_key' ||
    jwtRefreshSecret.length < 32
  ) {
    throw new Error(
      'JWT_REFRESH_SECRET must be set to a secure value of at least 32 characters. ' +
        'The default placeholder is not allowed in production.',
    );
  }

  // SEC-05: production safety checklist
  if (!isDevelopment) {
    const jwtSecret = configService.get<string>('JWT_SECRET') ?? '';
    if (jwtSecret === jwtRefreshSecret) {
      throw new Error(
        'JWT_SECRET and JWT_REFRESH_SECRET must be different values.',
      );
    }
    if (configService.get<string>('SHOW_STACK_TRACE') === 'true') {
      throw new Error('SHOW_STACK_TRACE must not be true in production.');
    }
    if (enableApiDocs) {
      const swaggerUser = configService.get<string>('SWAGGER_USER');
      const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD');
      if (!swaggerUser || !swaggerPassword) {
        throw new Error(
          'SWAGGER_USER and SWAGGER_PASSWORD must be set when ENABLE_API_DOCS is true in production.',
        );
      }
      if (swaggerPassword.length < 16) {
        throw new Error(
          'SWAGGER_PASSWORD must be at least 16 characters long in production.',
        );
      }
      const weakPasswords = new Set([
        'admin',
        'password',
        'postTest',
        'admin_docs',
        '123456',
        'changeme',
        'secret',
      ]);
      if (weakPasswords.has(swaggerPassword)) {
        throw new Error(
          'SWAGGER_PASSWORD matches a known weak/default value. Rotate it before going to production.',
        );
      }
    }
  }

  // Protect Bull Board UI at /admin/queues with the app JWT.
  // The Authorization: Bearer <token> header, a cookie (queues_access or docs_access), or query parameter ?token= is required.
  const jwtSecretForBoard = configService.get<string>('JWT_SECRET') ?? '';
  app.use(
    '/admin/queues',
    (req: Request, res: Response, next: NextFunction) => {
      // 1. Try Authorization header
      const authHeader = req.headers['authorization'];
      let token =
        typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : null;

      // 2. Try cookie header manually
      if (!token) {
        const cookieHeader = req.headers['cookie'] ?? '';
        const cookies: Record<string, string> = Object.fromEntries(
          cookieHeader.split(';').flatMap((pair) => {
            const idx = pair.indexOf('=');
            if (idx === -1) return [];
            const k = pair.slice(0, idx).trim();
            const v = decodeURIComponent(pair.slice(idx + 1).trim());
            return [[k, v]];
          }),
        );
        token = cookies['queues_access'] || cookies['docs_access'] || null;
      }

      // 3. Try query parameter (only for GET requests on the base path)
      const queryToken = req.query.token;
      if (!token && typeof queryToken === 'string') {
        try {
          jwtVerify(queryToken, jwtSecretForBoard);
          // Set cookie and redirect to remove token from URL bar
          res.cookie('queues_access', queryToken, {
            httpOnly: true,
            secure: !isDevelopment,
            path: '/admin/queues',
            sameSite: 'strict',
          });
          return res.redirect('/admin/queues');
        } catch {
          return res.status(401).json({
            statusCode: 401,
            message: 'Invalid token in query parameter',
          });
        }
      }

      if (!token) {
        return res.status(401).json({
          statusCode: 401,
          message:
            'Unauthorized. Please provide a token in Authorization header, cookie (queues_access/docs_access), or query parameter (?token=...)',
        });
      }

      try {
        jwtVerify(token, jwtSecretForBoard);
        return next();
      } catch {
        return res
          .status(401)
          .json({ statusCode: 401, message: 'Invalid or expired token' });
      }
    },
  );

  app.enableShutdownHooks();
  const shutdown = (signal: string) => {
    void app
      .close()
      .catch((err) => {
        console.error(`Error during shutdown on ${signal}:`, err);
        process.exit(1);
      })
      .then(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  const server = await app.listen(port);
  // Keep-alive must be longer than the upstream LB (ALB default 60s) so the
  // backend doesn't close idle sockets first and trigger 502s on the LB.
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  const logger = app.get(Logger);
  logger.log(`Application is running on: ${appUrl}`);
  if (enableApiDocs) {
    logger.log(`Swagger UI: ${appUrl}/api/docs`);
    logger.log(`Scalar Docs: ${appUrl}/docs`);
  }
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
