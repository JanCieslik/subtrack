# SubTrack – Subscription Budget Manager

Aplikacja do zarządzania budżetem subskrypcji cyfrowych (Netflix, Spotify, Azure itp.) z przeliczaniem walut przez NBP API.

## Tech Stack
- **Backend:** Express.js + PostgreSQL + JWT
- **Frontend:** React (Vite) + React Router + Axios
- **Auth:** JWT (7 dni ważności)
- **Kursy walut:** NBP API (cache 1h w bazie)

## Szybki start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env        # uzupełnij DATABASE_URL i JWT_SECRET
psql -U postgres -d subscriptions_db -f migrations/init.sql
npm start                   # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start                   # http://localhost:3000
```

## Zmienne środowiskowe

### backend/.env
```
DATABASE_URL=postgresql://user:password@localhost:5432/subscriptions_db
JWT_SECRET=minimum-32-character-secret-key
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Metoda | Endpoint | Auth | Opis |
|--------|----------|------|------|
| POST | /api/auth/register | - | Rejestracja |
| POST | /api/auth/login | - | Logowanie → JWT |
| GET | /api/subs | JWT | Lista subskrypcji |
| POST | /api/subs | JWT | Dodaj subskrypcję |
| PUT | /api/subs/:id | JWT | Edytuj subskrypcję |
| DELETE | /api/subs/:id | JWT | Usuń subskrypcję |
| GET | /api/subs/stats | JWT | Łączny koszt w PLN |
| GET | /api/rates | JWT | Kursy USD/EUR |
| GET | /health | - | Health check |
