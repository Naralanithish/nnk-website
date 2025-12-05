# NNK Website Server

This is a small Express backend for the NNK website. It exposes the following endpoints:

- `GET /api/services` — returns services.
- `GET /api/founder` — returns founder data.
- `GET /api/projects` — returns projects.
- `POST /api/contact` — accepts contact form submissions. Saves to MongoDB if `MONGODB_URI` is set in environment.

Quick start (from project root):

```powershell
cd "c:\Users\Nithish\OneDrive\Desktop\NNK website\server"
npm install
# set environment variable in your host (Render, Railway, or locally)
$env:MONGODB_URI = 'your-mongodb-uri'
npm run dev
```

If `MONGODB_URI` is not set, contact submissions will be accepted but not persisted (they will be logged to server console).

Detailed MongoDB Atlas setup (quick):

1. Create a free cluster on MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Create a database user and password (in Security → Database Access).
3. In Network Access, add your IP (or allow access from anywhere 0.0.0.0/0 for testing).
4. Get the connection string (click "Connect" → "Connect your application").
	- Replace `<username>` and `<password>` and optionally set the database name (e.g. `nnk_db`).
	- Use the SRV string that starts with `mongodb+srv://` for Atlas clusters.
5. Copy the connection string into a `.env` file at `server/.env` or set `MONGODB_URI` in your host's environment variables.

Local run (Windows PowerShell):

```powershell
cd "c:\Users\Nithish\OneDrive\Desktop\NNK website\server"
npm install
# If using a local .env file (dotenv is already used)
copy .env.example .env
# Edit .env and paste your Atlas URI as MONGODB_URI value
npm run dev
```

Deploy notes:
- When deploying to a host (Render, Railway, Heroku), set the `MONGODB_URI` environment variable in the host dashboard.
- The server listens on `process.env.PORT || 4000`, so platforms that provide `PORT` will work without changes.
- If your frontend is deployed separately, set the frontend to call the backend origin and ensure CORS is allowed (server already uses `cors()` by default).

Security reminders:
- Do not commit real credentials to Git. Keep `.env` in `.gitignore` (server/.gitignore exists).
- Use least-privilege DB users and, for production, restrict Network Access to appropriate IPs or VPC.

If you want, I can: provision an Atlas cluster instructions step-by-step, or modify the server to accept a `DB_NAME` env var and create indexes on startup.
