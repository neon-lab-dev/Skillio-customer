# syntax=docker/dockerfile:1

FROM node:20-bullseye AS build
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-bullseye-slim AS prod
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]