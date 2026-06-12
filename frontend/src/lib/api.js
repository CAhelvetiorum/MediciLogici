// Centralised resolver for static data files served from /public.
// Uses PUBLIC_URL so the site works at any GitHub Pages sub-path.
const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");

export function dataUrl(path) {
    return `${base}/${path.replace(/^\//, "")}`;
}
