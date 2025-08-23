# Skilio Customer Service - Docker Setup

This guide explains how to run the Node.js + Postgres + TypeORM + Kafka stack using Docker.

## Prerequisites
- Docker Desktop (includes Docker Compose)
- Ports available: 3000 (API), 5432 (Postgres), 9092 (Kafka)

## 1) Configure environment
1. Copy the example env file and adjust as needed:
   ```bash
   cp env.example .env
   ```
   By default, the compose file injects sensible development values. Update secrets if needed.

## 2) Build and start the stack
Run the containers in the background:
```bash
docker compose up -d --build
```
- API: http://localhost:3000
- Postgres: localhost:5432
- Kafka: localhost:9092

Check container status:
```bash
docker compose ps
```

View logs (follow mode):
```bash
# all services
docker compose logs -f
# specific service
docker compose logs -f app
```

## 3) Database migrations (TypeORM)
Generate new migration first (example):
```bash
docker compose exec app npm run migration:generate -- src/app/db/dataSource.ts
```
Run migrations inside the `app` container:
```bash
docker compose exec app npm run migration:run
```
Revert last migration if needed:
```bash
docker compose exec app npm run migration:revert
```

## 4) Useful service information
- App service name: `app`
- Postgres service name: `postgres`
- Kafka service name: `kafka`

Environment variables used by the app (development):
- `DB_HOST_DEVELOPMENT=postgres`
- `DB_PORT_DEVELOPMENT=5432`
- `DB_USERNAME_DEVELOPMENT=postgres`
- `DB_PASSWORD_DEVELOPMENT=postgres`
- `DB_DATABASE_DEVELOPMENT=skilio`
- `PORT=3000`
- `KAFKA_BROKERS=kafka:9092` (reachable from inside the app container)

From your host machine:
- Kafka is at `localhost:9092`
- Postgres credentials: `postgres / postgres` on DB `skilio` (change in `.env` if desired)

Open a Postgres shell:
```bash
docker compose exec postgres psql -U postgres -d skilio
```

## 5) Common commands
- Stop all services:
  ```bash
  docker compose down
  ```
- Stop and remove volumes (DB/Kafka data):
  ```bash
  docker compose down -v
  ```
- Rebuild only the app service:
  ```bash
  docker compose build app && docker compose up -d app
  ```
- Open a shell in the app container:
  ```bash
  docker compose exec app sh
  ```

## 6) Troubleshooting
- Port already in use: Change published ports in `docker-compose.yml` or stop the conflicting service.
- DB connection fails:
  - Ensure `postgres` service is healthy. Check logs: `docker compose logs -f postgres`.
  - Confirm the app is using development DB vars (`DB_*_DEVELOPMENT`).
- Kafka connection issues:
  - Ensure `kafka` is running and exposed on `9092`. Check logs: `docker compose logs -f kafka`.
  - From inside the app container, `KAFKA_BROKERS` should be `kafka:9092`.
- Migrations not found:
  - In development, entities/migrations paths point to `src/...`. Ensure `NODE_ENV=development` (default in compose) and that the code is present.

## 7) Project scripts
- Build TypeScript:
  ```bash
  npm run build
  ```
- Start compiled app (used by container):
  ```bash
  npm start
  ```
- Dev mode (local, not in container):
  ```bash
  npm run dev
  ```

## 8) Cleaning local state
Remove volumes and images if you need a fresh start:
```bash
docker compose down -v
docker image prune -f
```

---
If anything fails, share `docker compose ps` and relevant `docker compose logs -f <service>` output.
