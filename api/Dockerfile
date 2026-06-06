# base

FROM node:24-slim AS base

WORKDIR /app

COPY package*.json .
COPY prisma ./prisma

RUN npm ci

# development

FROM base AS development

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]

# build

FROM base AS builder

COPY . .

RUN npm run build

# production

FROM node:24-slim AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 4000

CMD ["node", "dist/index.js"]
