FROM node:20-slim

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9

# Copy all project files
COPY . .

# Install dependencies (no lockfile needed)
RUN pnpm install --no-frozen-lockfile

# Build the backend
RUN pnpm --filter @workspace/api-server run build

# Build the frontend
RUN PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mh-store run build

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "artifacts/api-server/dist/index.mjs"]
