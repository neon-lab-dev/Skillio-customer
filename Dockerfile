# syntax=docker/dockerfile:1

FROM node:20-bullseye AS base
WORKDIR /usr/src/app

# Install build deps for node-rdkafka (librdkafka)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends build-essential python3 pkg-config libssl-dev libsasl2-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install dependencies without running project lifecycle scripts (skips prisma postinstall)
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

COPY .env ./
COPY . .

# RUN npm run dev

ENV NODE_ENV=development

EXPOSE 3000

CMD [ "npm", "run", "dev" ]


