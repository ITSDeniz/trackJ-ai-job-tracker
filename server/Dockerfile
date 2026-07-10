# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root monorepo files and package workspace configs
COPY package*.json ./
COPY tsconfig.base.json ./
COPY server/package*.json ./server/

# Install all dependencies (including workspaces devDependencies for compilation)
RUN npm ci

# Copy server files
COPY server/ ./server/

# Generate Prisma client and compile TypeScript to JavaScript
WORKDIR /app/server
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy runtime packages
COPY package*.json ./
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code, Prisma engine/schema, and generated client packages from builder stage
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

WORKDIR /app/server

EXPOSE 4000

# Run migrations and start the application in production
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
