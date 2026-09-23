# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV STANDALONE=1
RUN npm run build

# ---------- run ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 \
    DATABASE_PATH=/app/data/krupa.db SEED_DB_PATH=/app/seed.db
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY prisma/dev.db /app/seed.db
RUN mkdir -p /app/data
EXPOSE 3000
# the app copies seed.db → data/krupa.db on first start
CMD ["node", "server.js"]
