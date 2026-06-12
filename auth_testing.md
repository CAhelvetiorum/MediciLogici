# Auth Testing Playbook

## Admin credentials
- email: `admin@research.local`
- password: `changeMe-2026!`

## API Endpoints
- POST `/api/auth/login` { email, password } → user + access_token (also sets httpOnly cookies)
- GET  `/api/auth/me` → current user (cookie or Bearer header)
- POST `/api/auth/logout` → clears cookies

## Quick curl test (Bearer header path)
```
curl -s -X POST "$BACKEND/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin@research.local","password":"changeMe-2026!"}'
# → contains "access_token"

curl -s "$BACKEND/api/auth/me" -H "Authorization: Bearer <access_token>"
# → returns user JSON with role=admin
```

## Admin-only CRUD
- POST `/api/doctors`   create (requires admin)
- PUT  `/api/doctors/{id}` update
- DELETE `/api/doctors/{id}` delete
- PUT  `/api/network` save interactive HTML embed for the Networks page

## Frontend flow
1. Visit `/admin/login`, enter credentials. JWT stored in localStorage.
2. Redirect to `/admin` dashboard, list/create/edit/delete doctors and edit Networks embed.
