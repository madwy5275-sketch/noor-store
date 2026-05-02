FROM node:20-slim

RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*

WORKDIR /build

RUN npm install -g pnpm@9

COPY noor-final.zip .

RUN unzip -q noor-final.zip

WORKDIR /build/noor-deploy

RUN pnpm install --no-frozen-lockfile

RUN cd artifacts/api-server && node build.mjs

RUN ls -la artifacts/api-server/dist/

RUN PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mh-store run build

EXPOSE 8080

CMD ["node", "/build/noor-deploy/artifacts/api-server/dist/index.mjs"]
