# Medici Logici

A static research website on early modern academic medical doctors who
were also logicians (c. 1500 — 1700). Four pages: **The Project**,
**Prosopography**, **Bibliography** and **Networks**.

The site is a plain client-side React build (no server, no database) and
is deployed to GitHub Pages automatically by the workflow at
`.github/workflows/deploy.yml`.

---

## Editing the content

All editable content lives in `frontend/public/data/`. To change anything,
edit those files directly on GitHub (or locally) and commit to `main` —
the GitHub Action will rebuild and redeploy the site within ~2 minutes.

| What you want to change            | File to edit                                  |
| ---------------------------------- | --------------------------------------------- |
| Prosopography entries              | `frontend/public/data/doctors.json`           |
| Bibliography                       | `frontend/public/data/bibliography.json`      |
| Networks graph (interactive HTML)  | place file at `frontend/public/network/index.html` |
| The Project page (essay)           | `frontend/src/pages/ProjectPage.js`           |

Full schema with examples: [`frontend/public/data/README.md`](frontend/public/data/README.md).

---

## Enabling GitHub Pages (one-time setup)

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`. The site will go live at
   `https://<your-username>.github.io/MediciLogici/`.

---

## Working locally

```bash
cd frontend
yarn install
yarn start      # dev server on http://localhost:3000
yarn build      # produces production files in frontend/build/
```

---

## Stack

- React 19, react-router-dom (HashRouter — needed for GitHub Pages so
  direct URLs like `/#/prosopography` resolve correctly)
- Tailwind CSS, custom classical theme (Cormorant Garamond, Spectral, Cardo)
- No backend; all data is static JSON served from `public/data/`
