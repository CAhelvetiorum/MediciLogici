import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const navItems = [
    { to: "/", label: "The Project", testId: "nav-project", end: true },
    { to: "/prosopography", label: "Prosopography", testId: "nav-prosopography" },
    { to: "/bibliography", label: "Bibliography", testId: "nav-bibliography" },
    { to: "/networks", label: "Networks", testId: "nav-networks" },
];

export function Layout({ children }) {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-parchment text-ink">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

function Header() {
    return (
        <header className="border-b border-rule bg-parchment/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
                <Link to="/" data-testid="brand-link" className="block">
                    <div className="font-display text-2xl lg:text-3xl tracking-tight leading-none">
                        Medici Logici
                    </div>
                    <div className="font-meta text-[10px] mt-1 smallcaps text-ink-muted">
                        Doctors · Logicians · 1500–1700
                    </div>
                </Link>
                <nav className="flex items-center gap-6 lg:gap-9">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            data-testid={item.testId}
                            className={({ isActive }) =>
                                [
                                    "font-meta text-[12px] smallcaps transition-colors duration-200 pb-1",
                                    isActive
                                        ? "text-oxblood border-b border-oxblood"
                                        : "text-ink hover:text-oxblood border-b border-transparent",
                                ].join(" ")
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-rule mt-24">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 font-meta text-sm text-ink-muted">
                <div>
                    <div className="font-display text-xl text-ink">Medici Logici</div>
                    <p className="mt-3 leading-relaxed">
                        A research project on academic medical doctors who were
                        also logicians in early modern Europe.
                    </p>
                </div>
                <div>
                    <div className="smallcaps text-[11px] mb-3 text-ink">Pages</div>
                    <ul className="space-y-1.5">
                        <li><Link to="/" className="hover:text-oxblood">The Project</Link></li>
                        <li><Link to="/prosopography" className="hover:text-oxblood">Prosopography</Link></li>
                        <li><Link to="/bibliography" className="hover:text-oxblood">Bibliography</Link></li>
                        <li><Link to="/networks" className="hover:text-oxblood">Networks</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="smallcaps text-[11px] mb-3 text-ink">Colophon</div>
                    <p className="leading-relaxed">
                        Typeset in Cormorant Garamond, Spectral and Cardo.
                        Last revised {new Date().getFullYear()}.
                    </p>
                    <p className="mt-3">
                        <Link
                            to="/admin/login"
                            data-testid="footer-admin-link"
                            className="hover:text-oxblood smallcaps text-[11px]"
                        >
                            Editorial Access
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
