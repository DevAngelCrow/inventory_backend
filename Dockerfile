# syntax=docker/dockerfile:1.7

# ---------- 1) deps: instala dependencias reproducibles ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# ---------- 2) build: compila TypeScript + assets + Prisma client ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

# ---------- 3) runner: imagen final mínima ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init curl libc6-compat \
 && addgroup --system --gid 1001 appgroup \
 && adduser --system --uid 1001 --ingroup appgroup appuser

COPY --chown=appuser:appgroup --from=build /app/dist ./dist
COPY --chown=appuser:appgroup --from=build /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=build /app/package.json ./package.json
COPY --chown=appuser:appgroup --from=build /app/prisma ./prisma
COPY --chown=appuser:appgroup --from=build /app/generated ./generated

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/v1/health/live || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]
