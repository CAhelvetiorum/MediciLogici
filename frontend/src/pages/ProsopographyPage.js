import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { dataUrl } from "@/lib/api";

export default function ProsopographyPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(dataUrl("data/doctors.json"));
                const json = await res.json();
                if (active) setDoctors(Array.isArray(json.doctors) ? json.doctors : []);
            } catch {
                if (active) setDoctors([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return doctors;
        return doctors.filter((d) =>
            [d.name, d.latin_name, d.nationality, d.biography, (d.affiliations || []).join(" ")]
                .join(" ")
                .toLowerCase()
                .includes(needle)
        );
    }, [doctors, q]);

    const grouped = useMemo(() => {
        const sorted = [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        const map = new Map();
        for (const d of sorted) {
            const letter = (d.name || "?").charAt(0).toUpperCase();
            if (!map.has(letter)) map.set(letter, []);
            map.get(letter).push(d);
        }
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }, [filtered]);

    return (
        <section data-testid="prosopography-page" className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
            <header className="mb-12">
                <div className="smallcaps text-[11px] text-ink-muted mb-6">An Index of Persons</div>
                <h1 className="font-display text-5xl lg:text-6xl tracking-tight leading-none text-ink">
                    Prosopography
                </h1>
                <p className="mt-6 max-w-[60ch] font-serif text-lg text-ink-muted leading-relaxed">
                    A continuously revised register of academic physicians who
                    also taught or published in logic, c. 1500 — 1700.
                </p>
            </header>

            <div className="rule-top rule-bottom py-4 mb-12 flex flex-wrap items-center gap-6">
                <input
                    data-testid="prosopography-search"
                    type="text"
                    placeholder="Search by name, university, or keyword…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="flex-1 bg-transparent border-0 border-b border-rule focus:border-oxblood outline-none py-2 font-serif text-base text-ink placeholder:text-ink-muted/70 placeholder:italic"
                />
                <div className="font-meta text-xs text-ink-muted smallcaps" data-testid="prosopography-count">
                    {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                </div>
            </div>

            {loading ? (
                <div className="font-serif italic text-ink-muted" data-testid="prosopography-loading">
                    Loading the register…
                </div>
            ) : filtered.length === 0 ? (
                <div className="font-serif italic text-ink-muted" data-testid="prosopography-empty">
                    No entries match this query.
                </div>
            ) : (
                <div className="space-y-14">
                    {grouped.map(([letter, entries]) => (
                        <div key={letter} data-testid={`group-${letter}`}>
                            <div className="flex items-baseline gap-6 mb-5">
                                <h2 className="font-display text-4xl text-oxblood">{letter}</h2>
                                <div className="flex-1 border-b border-rule" />
                            </div>
                            <ul>
                                {entries.map((d) => (
                                    <li
                                        key={d.id}
                                        data-testid={`doctor-row-${d.id}`}
                                        className="border-b border-rule"
                                    >
                                        <Link
                                            to={`/prosopography/${d.id}`}
                                            className="grid grid-cols-12 gap-6 py-5 hover:bg-parchment-deep/60 transition-colors duration-200 px-2 -mx-2 group"
                                        >
                                            <div className="col-span-12 md:col-span-5">
                                                <div className="font-display text-2xl text-ink group-hover:text-oxblood transition-colors">
                                                    {d.name}
                                                </div>
                                                {d.latin_name && (
                                                    <div className="font-serif italic text-sm text-ink-muted mt-0.5">
                                                        {d.latin_name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-6 md:col-span-3 font-meta text-sm text-ink-muted self-center">
                                                {d.dates_label || (d.birth_year && d.death_year ? `${d.birth_year}–${d.death_year}` : "—")}
                                            </div>
                                            <div className="col-span-6 md:col-span-4 font-meta text-sm text-ink-muted self-center">
                                                {(d.affiliations || []).join(" · ") || d.nationality}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
