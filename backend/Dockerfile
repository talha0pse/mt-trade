# Stage 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production image
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package*.json ./
EXPOSE 5000
CMD ["node", "src/server.js"]
