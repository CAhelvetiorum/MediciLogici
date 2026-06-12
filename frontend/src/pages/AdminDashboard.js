import { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, formatApiErrorDetail } from "@/lib/api";

const EMPTY_DOCTOR = {
    name: "",
    latin_name: "",
    birth_year: "",
    death_year: "",
    dates_label: "",
    nationality: "",
    affiliations: "",
    biography: "",
    logical_works: "",
    medical_works: "",
    notable_connections: "",
    sources: "",
    image_url: "",
};

function listToString(arr) {
    return Array.isArray(arr) ? arr.join("\n") : "";
}
function stringToList(s) {
    if (!s) return [];
    return s
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tab, setTab] = useState("doctors");

    if (user === null) {
        return (
            <section className="max-w-3xl mx-auto px-6 pt-24" data-testid="admin-loading">
                <p className="font-serif italic text-ink-muted">Loading editorial console…</p>
            </section>
        );
    }
    if (!user || !user.id) {
        return <Navigate to="/admin/login" replace />;
    }

    const onLogout = async () => {
        await logout();
        navigate("/admin/login", { replace: true });
    };

    return (
        <section
            data-testid="admin-dashboard"
            className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-24"
        >
            <header className="rule-bottom pb-6 mb-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                    <div className="smallcaps text-[11px] text-ink-muted">Editorial Console</div>
                    <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2">
                        Admin Dashboard
                    </h1>
                    <p className="font-meta text-sm text-ink-muted mt-2">
                        Signed in as <span className="italic">{user.email}</span>
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <TabButton active={tab === "doctors"} onClick={() => setTab("doctors")} testId="tab-doctors">
                        Prosopography
                    </TabButton>
                    <TabButton active={tab === "network"} onClick={() => setTab("network")} testId="tab-network">
                        Networks
                    </TabButton>
                    <button
                        onClick={onLogout}
                        data-testid="logout-button"
                        className="font-meta text-[11px] smallcaps text-ink-muted hover:text-oxblood"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {tab === "doctors" ? <DoctorsAdmin /> : <NetworkAdmin />}
        </section>
    );
}

function TabButton({ active, onClick, children, testId }) {
    return (
        <button
            onClick={onClick}
            data-testid={testId}
            className={[
                "font-meta text-[12px] smallcaps pb-1 border-b transition-colors",
                active ? "text-oxblood border-oxblood" : "text-ink border-transparent hover:text-oxblood",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function DoctorsAdmin() {
    const [list, setList] = useState([]);
    const [editing, setEditing] = useState(null); // null | "new" | id
    const [form, setForm] = useState(EMPTY_DOCTOR);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const load = useCallback(async () => {
        const { data } = await api.get("/doctors");
        setList(data);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const startNew = () => {
        setEditing("new");
        setForm(EMPTY_DOCTOR);
        setMsg("");
        setErr("");
    };

    const startEdit = (d) => {
        setEditing(d.id);
        setForm({
            name: d.name || "",
            latin_name: d.latin_name || "",
            birth_year: d.birth_year ?? "",
            death_year: d.death_year ?? "",
            dates_label: d.dates_label || "",
            nationality: d.nationality || "",
            affiliations: listToString(d.affiliations),
            biography: d.biography || "",
            logical_works: listToString(d.logical_works),
            medical_works: listToString(d.medical_works),
            notable_connections: listToString(d.notable_connections),
            sources: listToString(d.sources),
            image_url: d.image_url || "",
        });
        setMsg("");
        setErr("");
    };

    const cancel = () => {
        setEditing(null);
        setForm(EMPTY_DOCTOR);
    };

    const save = async () => {
        setBusy(true);
        setErr("");
        setMsg("");
        const payload = {
            name: form.name.trim(),
            latin_name: form.latin_name.trim(),
            birth_year: form.birth_year ? parseInt(form.birth_year, 10) : null,
            death_year: form.death_year ? parseInt(form.death_year, 10) : null,
            dates_label: form.dates_label.trim(),
            nationality: form.nationality.trim(),
            affiliations: stringToList(form.affiliations),
            biography: form.biography,
            logical_works: stringToList(form.logical_works),
            medical_works: stringToList(form.medical_works),
            notable_connections: stringToList(form.notable_connections),
            sources: stringToList(form.sources),
            image_url: form.image_url.trim(),
        };
        try {
            if (editing === "new") {
                await api.post("/doctors", payload);
                setMsg("Entry created.");
            } else {
                await api.put(`/doctors/${editing}`, payload);
                setMsg("Entry updated.");
            }
            await load();
            setEditing(null);
            setForm(EMPTY_DOCTOR);
        } catch (e) {
            setErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
        } finally {
            setBusy(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this entry permanently?")) return;
        try {
            await api.delete(`/doctors/${id}`);
            await load();
            setMsg("Entry deleted.");
        } catch (e) {
            setErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
        }
    };

    return (
        <div data-testid="doctors-admin">
            <div className="flex justify-between items-baseline mb-6">
                <h2 className="font-display text-3xl text-ink">Prosopographical Entries</h2>
                <button
                    onClick={startNew}
                    data-testid="new-doctor-button"
                    className="font-meta text-[11px] smallcaps text-parchment bg-ink px-4 py-2 hover:bg-oxblood transition-colors"
                >
                    + New Entry
                </button>
            </div>

            {msg && <div className="font-meta text-sm text-ink-muted italic mb-4" data-testid="admin-msg">{msg}</div>}
            {err && <div className="font-meta text-sm text-oxblood italic mb-4" data-testid="admin-err">{err}</div>}

            {editing && (
                <EditorForm
                    form={form}
                    setForm={setForm}
                    onSave={save}
                    onCancel={cancel}
                    busy={busy}
                    isNew={editing === "new"}
                />
            )}

            <ul className="mt-10 rule-top">
                {list.map((d) => (
                    <li
                        key={d.id}
                        data-testid={`admin-row-${d.id}`}
                        className="rule-bottom py-4 flex flex-wrap items-baseline gap-4 justify-between"
                    >
                        <div>
                            <div className="font-display text-xl text-ink">{d.name}</div>
                            <div className="font-meta text-xs text-ink-muted">
                                {d.dates_label || "—"} · {(d.affiliations || []).join(", ")}
                            </div>
                        </div>
                        <div className="flex gap-4 font-meta text-[11px] smallcaps">
                            <button
                                onClick={() => startEdit(d)}
                                data-testid={`edit-doctor-${d.id}`}
                                className="text-ink hover:text-oxblood"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => remove(d.id)}
                                data-testid={`delete-doctor-${d.id}`}
                                className="text-ink-muted hover:text-oxblood"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EditorForm({ form, setForm, onSave, onCancel, busy, isNew }) {
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
    return (
        <div className="bg-parchment-deep/40 border border-rule p-6 lg:p-8" data-testid="doctor-editor">
            <h3 className="font-display text-2xl text-ink mb-6">
                {isNew ? "New entry" : "Edit entry"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Name" value={form.name} onChange={set("name")} testId="field-name" />
                <TextField label="Latin name" value={form.latin_name} onChange={set("latin_name")} testId="field-latin-name" />
                <TextField label="Birth year" value={form.birth_year} onChange={set("birth_year")} testId="field-birth-year" />
                <TextField label="Death year" value={form.death_year} onChange={set("death_year")} testId="field-death-year" />
                <TextField label="Dates label (e.g. 1561–1636)" value={form.dates_label} onChange={set("dates_label")} testId="field-dates-label" />
                <TextField label="Nationality" value={form.nationality} onChange={set("nationality")} testId="field-nationality" />
            </div>
            <div className="mt-5">
                <TextArea label="Affiliations (one per line)" value={form.affiliations} onChange={set("affiliations")} testId="field-affiliations" />
            </div>
            <div className="mt-5">
                <TextArea label="Biography" rows={6} value={form.biography} onChange={set("biography")} testId="field-biography" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <TextArea label="Logical works (one per line)" value={form.logical_works} onChange={set("logical_works")} testId="field-logical-works" />
                <TextArea label="Medical works (one per line)" value={form.medical_works} onChange={set("medical_works")} testId="field-medical-works" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <TextArea label="Notable connections (one per line)" value={form.notable_connections} onChange={set("notable_connections")} testId="field-notable-connections" />
                <TextArea label="Sources (one per line)" value={form.sources} onChange={set("sources")} testId="field-sources" />
            </div>
            <div className="mt-5">
                <TextField label="Portrait image URL (optional)" value={form.image_url} onChange={set("image_url")} testId="field-image-url" />
            </div>

            <div className="mt-8 flex items-center gap-5">
                <button
                    onClick={onSave}
                    disabled={busy || !form.name.trim()}
                    data-testid="save-doctor"
                    className="bg-ink text-parchment font-meta text-[11px] smallcaps tracking-widest px-5 py-2.5 hover:bg-oxblood transition-colors disabled:opacity-60"
                >
                    {busy ? "Saving…" : "Save entry"}
                </button>
                <button
                    onClick={onCancel}
                    data-testid="cancel-doctor"
                    className="font-meta text-[11px] smallcaps text-ink-muted hover:text-oxblood"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function TextField({ label, value, onChange, testId }) {
    return (
        <label className="block">
            <div className="smallcaps text-[11px] text-ink-muted mb-2">{label}</div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                data-testid={testId}
                className="w-full bg-transparent border-0 border-b border-rule focus:border-oxblood outline-none py-1.5 font-serif text-base text-ink"
            />
        </label>
    );
}

function TextArea({ label, value, onChange, rows = 3, testId }) {
    return (
        <label className="block">
            <div className="smallcaps text-[11px] text-ink-muted mb-2">{label}</div>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                data-testid={testId}
                className="w-full bg-parchment border border-rule focus:border-oxblood outline-none p-3 font-serif text-base text-ink leading-relaxed"
            />
        </label>
    );
}

function NetworkAdmin() {
    const [html, setHtml] = useState("");
    const [caption, setCaption] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/network");
                setHtml(data.html || "");
                setCaption(data.caption || "");
            } catch {
                // ignore
            }
        })();
    }, []);

    const save = async () => {
        setBusy(true);
        setErr("");
        setMsg("");
        try {
            await api.put("/network", { html, caption });
            setMsg("Network embed updated.");
        } catch (e) {
            setErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
        } finally {
            setBusy(false);
        }
    };

    const onFile = async (file) => {
        if (!file) return;
        const text = await file.text();
        setHtml(text);
    };

    return (
        <div data-testid="network-admin">
            <h2 className="font-display text-3xl text-ink mb-4">Networks Embed</h2>
            <p className="font-serif text-base text-ink-muted max-w-[60ch] leading-relaxed mb-6">
                Paste the raw HTML of an interactive network exported from R
                (e.g. visNetwork) or Gephi, or upload the .html file. It will be
                rendered inside an iframe on the public Networks page.
            </p>

            <div className="space-y-5">
                <label className="block">
                    <div className="smallcaps text-[11px] text-ink-muted mb-2">Upload an .html file</div>
                    <input
                        type="file"
                        accept=".html,text/html"
                        data-testid="network-file-input"
                        onChange={(e) => onFile(e.target.files?.[0])}
                        className="block font-meta text-sm"
                    />
                </label>
                <label className="block">
                    <div className="smallcaps text-[11px] text-ink-muted mb-2">HTML source</div>
                    <textarea
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        data-testid="network-html-input"
                        rows={14}
                        className="w-full bg-parchment border border-rule focus:border-oxblood outline-none p-3 font-meta text-xs leading-relaxed"
                        placeholder="<!DOCTYPE html> ..."
                    />
                </label>
                <label className="block">
                    <div className="smallcaps text-[11px] text-ink-muted mb-2">Caption</div>
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        data-testid="network-caption-input"
                        className="w-full bg-transparent border-0 border-b border-rule focus:border-oxblood outline-none py-1.5 font-serif text-base text-ink"
                    />
                </label>
            </div>

            {msg && <div className="font-meta text-sm text-ink-muted italic mt-4" data-testid="network-admin-msg">{msg}</div>}
            {err && <div className="font-meta text-sm text-oxblood italic mt-4" data-testid="network-admin-err">{err}</div>}

            <div className="mt-8 flex items-center gap-5">
                <button
                    onClick={save}
                    disabled={busy}
                    data-testid="save-network"
                    className="bg-ink text-parchment font-meta text-[11px] smallcaps tracking-widest px-5 py-2.5 hover:bg-oxblood transition-colors disabled:opacity-60"
                >
                    {busy ? "Saving…" : "Save embed"}
                </button>
            </div>
        </div>
    );
}
