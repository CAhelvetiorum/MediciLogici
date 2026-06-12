export default function ProjectPage() {
    return (
        <article data-testid="project-page" className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
            <header className="mb-16">
                <div className="smallcaps text-[11px] text-ink-muted mb-6" data-testid="project-eyebrow">
                    A Research Project · Estd. 2026
                </div>
                <h1
                    data-testid="project-title"
                    className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95] text-ink"
                >
                    Of Physic & Reason
                </h1>
                <div className="mt-6 font-display italic text-2xl lg:text-3xl text-oxblood">
                    The Doctors-Logicians of Early Modern Europe
                </div>
                <div className="mt-10 text-center text-ink-muted ornament" data-testid="project-ornament" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <aside className="lg:col-span-4 order-2 lg:order-1">
                    <figure className="rule-top rule-bottom py-6">
                        <img
                            data-testid="project-figure"
                            src="https://images.unsplash.com/photo-1534289855405-ab820a118fc1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxvbGQlMjBtYW51c2NyaXB0JTIwYm9va3xlbnwwfHx8fDE3ODEyNjQ0NTl8MA&ixlib=rb-4.1.0&q=85"
                            alt="A hardbound early modern manuscript"
                            className="w-full grayscale-[15%] sepia-[10%]"
                        />
                        <figcaption className="font-meta text-xs text-ink-muted mt-3 italic">
                            Fig. 1 — A composite volume of medical and logical
                            tracts, late 16th century.
                        </figcaption>
                    </figure>

                    <div className="mt-10 font-meta text-sm leading-relaxed">
                        <div className="smallcaps text-[11px] text-ink mb-3">Period</div>
                        <p className="text-ink-muted">circa 1500 — 1700</p>
                        <div className="smallcaps text-[11px] text-ink mt-6 mb-3">Geography</div>
                        <p className="text-ink-muted">
                            Padua, Bologna, Wittenberg, Leiden, Paris, Oxford,
                            Salamanca and beyond.
                        </p>
                        <div className="smallcaps text-[11px] text-ink mt-6 mb-3">Methods</div>
                        <p className="text-ink-muted">
                            Prosopography · Textual analysis · Network
                            visualisation (R / Gephi).
                        </p>
                    </div>
                </aside>

                <div className="lg:col-span-8 order-1 lg:order-2 max-w-[70ch]">
                    <p
                        data-testid="project-lead"
                        className="dropcap font-serif text-lg lg:text-xl leading-[1.75] text-ink"
                    >
                        In the universities of early modern Europe, the
                        physician was not merely a practitioner of an art but a
                        learned man — <em>doctus</em> — whose authority rested
                        on a curriculum that began, long before any cadaver was
                        opened, in the lecture halls of logic. This project
                        attends to those medical doctors who were also
                        professional logicians: who wrote commentaries on the{" "}
                        <em>Organon</em>, taught the methods of demonstration
                        and regressus, and brought the apparatus of scholastic
                        reasoning to bear on the diseases of the body.
                    </p>

                    <p className="mt-7 font-serif text-lg leading-[1.8] text-ink">
                        Their double vocation has often been treated as a
                        biographical curiosity. We propose, on the contrary, to
                        read it as a structural feature of the early modern
                        medical academy. From Padua to Wittenberg, from the
                        Jesuit colleges of Coimbra to the Calvinist faculties
                        of the Low Countries, a network of doctors-logicians
                        articulated the epistemic standards by which medicine
                        was taught, defended, and reformed.
                    </p>

                    <h2 className="mt-14 mb-5 font-display text-3xl lg:text-4xl text-ink">
                        Aims of the Project
                    </h2>
                    <ul className="space-y-4 font-serif text-lg leading-[1.75] list-none">
                        <li className="flex gap-4">
                            <span className="font-display text-oxblood text-xl leading-none pt-1">i.</span>
                            <span>
                                To compile an up-to-date{" "}
                                <em>prosopography</em> of academic physicians
                                who taught or published in logic between 1500
                                and 1700.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <span className="font-display text-oxblood text-xl leading-none pt-1">ii.</span>
                            <span>
                                To assemble a working bibliography of primary
                                sources and secondary literature.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <span className="font-display text-oxblood text-xl leading-none pt-1">iii.</span>
                            <span>
                                To visualise the institutional, intellectual
                                and personal <em>networks</em> binding these
                                figures across the European republic of
                                letters.
                            </span>
                        </li>
                    </ul>

                    <h2 className="mt-14 mb-5 font-display text-3xl lg:text-4xl text-ink">
                        A Note on Method
                    </h2>
                    <p className="font-serif text-lg leading-[1.8] text-ink">
                        Entries in the prosopography are revised continuously
                        as new sources come to light. The network graph is
                        produced in <span className="font-meta text-base">R</span> and{" "}
                        <span className="font-meta text-base">Gephi</span>, and
                        embedded here as an interactive HTML document. We
                        privilege precision over comprehensiveness and welcome
                        scholarly correspondence on individual entries.
                    </p>

                    <div className="mt-16 rule-top pt-6 font-meta text-sm text-ink-muted italic">
                        — The Editors
                    </div>
                </div>
            </div>
        </article>
    );
}
