FROM node:20-slim

RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Install pnpm globally
RUN npm install -g pnpm@9

# Copy the ZIP that is already committed to the GitHub repo
COPY noor-final.zip .

# Extract ZIP - creates /build/noor-deploy/
RUN unzip -q noor-final.zip

# Move into the actual project directory
WORKDIR /build/noor-deploy

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build the backend
RUN cd artifacts/api-server && node build.mjs

# Verify build output exists
RUN ls -la artifacts/api-server/dist/

# Build the frontend  
RUN PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mh-store run build

EXPOSE 8080

CMD ["node", "/build/noor-deploy/artifacts/api-server/dist/index.mjs"]
