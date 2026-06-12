import { useEffect, useState } from "react";
import { dataUrl } from "@/lib/api";

export default function BibliographyPage() {
    const [data, setData] = useState({ primary_sources: [], secondary_literature: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(dataUrl("data/bibliography.json"));
                const json = await res.json();
                if (active) setData(json);
            } catch {
                // keep empty fallback
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return (
        <section data-testid="bibliography-page" className="max-w-3xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
            <header className="mb-12">
                <div className="smallcaps text-[11px] text-ink-muted mb-6">Sources & Literature</div>
                <h1 className="font-display text-5xl lg:text-6xl tracking-tight leading-none text-ink">
                    Bibliography
                </h1>
                <p className="mt-6 max-w-[60ch] font-serif text-lg text-ink-muted leading-relaxed">
                    A working catalogue of primary sources cited in the
                    prosopography and of secondary literature consulted by the
                    editors.
                </p>
            </header>

            {loading ? (
                <p className="font-serif italic text-ink-muted">Loading bibliography…</p>
            ) : (
                <>
                    <Group
                        heading="Primary Sources"
                        items={data.primary_sources || []}
                        testid="bibliography-primary"
                    />
                    <Group
                        heading="Secondary Literature"
                        items={data.secondary_literature || []}
                        testid="bibliography-secondary"
                    />
                </>
            )}
        </section>
    );
}

function Group({ heading, items, testid }) {
    return (
        <div className="mb-16" data-testid={testid}>
            <div className="flex items-baseline gap-6 mb-6">
                <h2 className="font-display text-3xl text-oxblood">{heading}</h2>
                <div className="flex-1 border-b border-rule" />
            </div>
            <ul className="space-y-5">
                {items.map((it, i) => (
                    <li key={i} className="hanging font-serif text-base leading-[1.75] text-ink">
                        <span className="font-meta">{it.author}</span>,{" "}
                        <em>{it.title}</em>
                        {it.place && <>, {it.place}</>}
                        {it.publisher && <>: {it.publisher}</>}
                        {it.year && <>, {it.year}</>}.
                        {it.notes && (
                            <span className="block text-sm text-ink-muted italic mt-1">
                                {it.notes}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
