import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function NetworksPage() {
    const [data, setData] = useState({ html: "", caption: "" });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data: d } = await api.get("/network");
                if (active) setData(d);
            } finally {
                if (active) setLoaded(true);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return (
        <section data-testid="networks-page" className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
            <header className="mb-12">
                <div className="smallcaps text-[11px] text-ink-muted mb-6">An Interactive Visualisation</div>
                <h1 className="font-display text-5xl lg:text-6xl tracking-tight leading-none text-ink">
                    Networks
                </h1>
                <p className="mt-6 max-w-[60ch] font-serif text-lg text-ink-muted leading-relaxed">
                    Institutional, intellectual and personal ties linking the
                    doctors-logicians of the prosopography. The graph below is
                    produced in R / Gephi and exported as an interactive HTML
                    document.
                </p>
            </header>

            <div className="rule-top rule-bottom" data-testid="network-embed-frame">
                {loaded && data.html ? (
                    <iframe
                        srcDoc={data.html}
                        title="Network of Doctors-Logicians"
                        className="w-full bg-parchment"
                        style={{ height: "70vh", minHeight: "560px", border: "0" }}
                        data-testid="network-iframe"
                    />
                ) : (
                    <Placeholder loaded={loaded} />
                )}
            </div>

            {data.caption && (
                <p className="mt-5 font-meta text-sm text-ink-muted italic" data-testid="network-caption">
                    {data.caption}
                </p>
            )}
        </section>
    );
}

function Placeholder({ loaded }) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center text-center px-8 py-24 bg-parchment-deep/40"
            data-testid="network-placeholder"
            style={{ minHeight: "480px" }}
        >
            <div className="font-display italic text-3xl text-ink-muted">
                {loaded ? "Awaiting upload of the network graph." : "Loading…"}
            </div>
            <p className="mt-4 font-meta text-sm text-ink-muted max-w-md leading-relaxed">
                The editor will upload an exported interactive HTML file
                (produced in R or Gephi) through the editorial interface. It
                will appear here in this frame.
            </p>
            <img
                src="https://images.unsplash.com/photo-1567910640027-4029c4d8e9e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxvbGQlMjBoaXN0b3JpY2FsJTIwbWFwJTIwcGFyY2htZW50fGVufDB8fHx8MTc4MTI2NDQ3MHww&ixlib=rb-4.1.0&q=85"
                alt="Historical map sketch on parchment"
                className="mt-10 max-w-md w-full grayscale-[20%] opacity-80"
            />
        </div>
    );
}
