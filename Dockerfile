# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN yarn install

COPY . .

RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies including TypeScript runtime dependencies
RUN yarn install --production && \
    yarn add tslib @types/node

COPY --from=builder /app/dist ./dist
COPY .env.example ./.env

EXPOSE 3000

CMD ["node", "dist/server.js"] 