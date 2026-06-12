# PRD — Medici Logici (Doctors-Logicians of Early Modern Europe)

## Original problem statement
Academic research website on early modern academic medical doctors who were also logicians.
Three pages: (1) The Project, (2) Prosopography + Bibliography, (3) Networks map (R/Gephi export).

## User choices
- Language: English only
- Prosopography: admin interface with JWT auth (single admin)
- Networks page: embed of an exported interactive HTML file
- Aesthetic: classical academic (parchment / oxblood / Cormorant Garamond + Spectral + Cardo)
- Bibliography: static from JSON

## Architecture
- Backend: FastAPI, Motor (async MongoDB), JWT (PyJWT) + bcrypt, single-file server.py
- Frontend: React 19 + react-router-dom 7 + Tailwind, custom classical theme
- Auth: JWT in httpOnly cookies AND Authorization Bearer header (frontend uses localStorage token)
- DB: collections `users`, `doctors`, `settings` (network embed)

## What's been implemented (2026-06-12)
- Project page with drop-cap essay, decorative ornaments and a figure aside
- Prosopography list with live search, grouped alphabetically, with detail pages (dictionary-entry style)
- Bibliography page (Primary Sources + Secondary Literature) loaded from `/src/data/bibliography.json`
- Networks page with iframe embed + placeholder fallback
- Admin login (/admin/login) + dashboard (/admin) with two tabs:
    - Prosopography CRUD (create / edit / delete entries; affiliations / works / sources as multiline lists)
    - Networks tab: paste raw HTML or upload .html file + caption, saved to backend
- JWT auth (Bearer token + httpOnly cookie), admin seeded from .env on startup
- 3 seed doctors inserted on first boot (Zabarella, Sanctorius, Sennert)
- Backend test report: 100% pass; Frontend e2e: 100% pass

## Backlog
- P1: Public sharing of individual entries via slugs (`/prosopography/zabarella` rather than ObjectId)
- P1: Image upload for portrait engravings (currently only URL field)
- P2: BibTeX import / export for the bibliography
- P2: Per-entry citation BibTeX block
- P2: Brute-force lockout on admin login (5 attempts → 15 min)
- P2: Multilingual support (FR/EN switch) if scholarly outreach expands
- P2: Public-facing RSS / newsletter for revisions
