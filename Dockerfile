# --- Build Stage ---
FROM node:20-alpine AS builder

# Install dependencies needed by Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source and config files
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner

# Install dependencies needed by Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Prisma schema and migrations (necessary for running migrations on startup)
COPY prisma ./prisma/

# Generate Prisma client for alpine production environment
RUN npx prisma generate

# Copy built app files from the builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose the app port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
