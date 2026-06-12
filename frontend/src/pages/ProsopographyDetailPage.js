import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dataUrl } from "@/lib/api";

export default function ProsopographyDetailPage() {
    const { id } = useParams();
    const [d, setD] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(dataUrl("data/doctors.json"));
                const json = await res.json();
                const found = (json.doctors || []).find((x) => x.id === id);
                if (!active) return;
                if (!found) setError("Entry not found.");
                else setD(found);
            } catch {
                if (active) setError("Entry not found.");
            }
        })();
        return () => {
            active = false;
        };
    }, [id]);

    if (error) {
        return (
            <section className="max-w-3xl mx-auto px-6 lg:px-10 pt-24 pb-24" data-testid="doctor-detail-error">
                <h1 className="font-display text-4xl">{error}</h1>
                <Link
                    to="/prosopography"
                    className="mt-6 inline-block font-meta smallcaps text-xs text-oxblood"
                    data-testid="back-to-list"
                >
                    ← Return to the index
                </Link>
            </section>
        );
    }

    if (!d) {
        return (
            <section className="max-w-3xl mx-auto px-6 lg:px-10 pt-24 pb-24" data-testid="doctor-detail-loading">
                <p className="font-serif italic text-ink-muted">Loading entry…</p>
            </section>
        );
    }

    return (
        <article
            data-testid="doctor-detail-page"
            className="max-w-3xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24"
        >
            <Link
                to="/prosopography"
                className="font-meta smallcaps text-[11px] text-ink-muted hover:text-oxblood"
                data-testid="back-to-list"
            >
                ← Index of Persons
            </Link>

            <header className="mt-6 rule-bottom pb-8 mb-10">
                <h1 className="font-display text-5xl lg:text-6xl leading-none text-ink" data-testid="doctor-name">
                    {d.name}
                </h1>
                {d.latin_name && (
                    <div className="font-display italic text-2xl text-oxblood mt-2">
                        {d.latin_name}
                    </div>
                )}
                <div className="font-meta text-sm text-ink-muted mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    {d.dates_label && <span data-testid="doctor-dates">{d.dates_label}</span>}
                    {d.nationality && <span>· {d.nationality}</span>}
                </div>
            </header>

            {d.affiliations?.length > 0 && (
                <Section label="Academic Affiliations">
                    <ul className="font-serif text-lg leading-[1.7]">
                        {d.affiliations.map((a, i) => (
                            <li key={i} className="before:content-['—'] before:text-oxblood before:mr-3">
                                {a}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {d.biography && (
                <Section label="Biographical Note">
                    <p className="font-serif text-lg leading-[1.85] text-ink whitespace-pre-line max-w-[68ch]">
                        {d.biography}
                    </p>
                </Section>
            )}

            {d.logical_works?.length > 0 && (
                <Section label="Logical Works">
                    <ul className="space-y-1.5">
                        {d.logical_works.map((w, i) => (
                            <li key={i} className="font-serif text-base hanging">— {w}</li>
                        ))}
                    </ul>
                </Section>
            )}

            {d.medical_works?.length > 0 && (
                <Section label="Medical Works">
                    <ul className="space-y-1.5">
                        {d.medical_works.map((w, i) => (
                            <li key={i} className="font-serif text-base hanging">— {w}</li>
                        ))}
                    </ul>
                </Section>
            )}

            {d.notable_connections?.length > 0 && (
                <Section label="Notable Connections">
                    <p className="font-serif text-base text-ink leading-relaxed">
                        {d.notable_connections.join(" · ")}
                    </p>
                </Section>
            )}

            {d.sources?.length > 0 && (
                <Section label="Selected Sources">
                    <ul className="space-y-1.5">
                        {d.sources.map((s, i) => (
                            <li key={i} className="font-meta text-sm hanging text-ink-muted">{s}</li>
                        ))}
                    </ul>
                </Section>
            )}
        </article>
    );
}

function Section({ label, children }) {
    return (
        <section className="mb-12">
            <div className="smallcaps text-[11px] text-ink-muted mb-4">{label}</div>
            {children}
        </section>
    );
}
