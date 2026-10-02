# LunchLoop — Base44 Dev Environment

## Project Overview
LunchLoop is a campus food ordering app with two parts:
- **Web server** (`index.js`): Express.js server on port 3000, serves a static UI prototype and exposes API endpoints (register, login, meals, orders, wallet recharge) backed by Supabase.
- **Mobile app** (`mobile/`): Expo/React Native app (not used for the web preview).

The web preview shows the **UI prototype** (`ui-prototype/`), which is self-contained with mock data — it does not call the backend API endpoints.

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Node 22 image, source bind-mounted at `/app`
- Dev command: `npm run dev` (node --watch index.js)
- Dependencies installed on container startup via `npm install --omit=dev`
- Healthcheck: HTTP GET `/` on port 3000
- Live reload via `node --watch` with polling enabled (`CHOKIDAR_USEPOLLING=true`)

## Environment Variables
- `PORT` — defaults to 3000
- `SUPABASE_URL` — Supabase project URL (in `.env`, also overridable via `/run/base44/app.env`)
- `SUPABASE_KEY` — Supabase anon/public key (in `.env`, also overridable via `/run/base44/app.env`)

## Known Issue
The Supabase project (`ziilvvcboskiwksojydv.supabase.co`) in the committed `.env` does not resolve — the project appears to be paused or deleted. The UI prototype works without it (uses mock data), but API endpoints (`/meals`, `/order`, `/wallet/recharge`, `/register`, `/login`) will fail until a valid Supabase project URL and key are provided.

## Verification
- `curl http://localhost:3000/` should return the LunchLoop HTML page (200 OK)
- `curl http://localhost:3000/meals` will return a fetch error until Supabase is restored
