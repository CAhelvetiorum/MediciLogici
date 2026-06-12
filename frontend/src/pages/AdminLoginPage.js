import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user && user.id) {
        return <Navigate to="/admin" replace />;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const ok = await login(email, password);
        setSubmitting(false);
        if (ok) {
            navigate("/admin", { replace: true });
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <section
            data-testid="admin-login-page"
            className="max-w-md mx-auto px-6 pt-24 pb-24"
        >
            <header className="mb-10 text-center">
                <div className="smallcaps text-[11px] text-ink-muted mb-5">Editorial Access</div>
                <h1 className="font-display text-4xl lg:text-5xl text-ink">Sign in</h1>
                <p className="mt-3 font-serif italic text-ink-muted text-sm">
                    Restricted to the editors of the project.
                </p>
                <div className="mt-6 ornament" />
            </header>

            <form onSubmit={onSubmit} className="space-y-7">
                <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    testId="login-email-input"
                    autoComplete="email"
                    required
                />
                <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    testId="login-password-input"
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <div
                        data-testid="login-error"
                        className="font-meta text-sm text-oxblood italic"
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    data-testid="login-submit"
                    className="w-full py-3 bg-ink text-parchment font-meta text-xs smallcaps tracking-widest hover:bg-oxblood transition-colors duration-200 disabled:opacity-60"
                >
                    {submitting ? "Verifying…" : "Enter"}
                </button>
            </form>
        </section>
    );
}

function Field({ label, type, value, onChange, testId, autoComplete, required }) {
    return (
        <label className="block">
            <div className="smallcaps text-[11px] text-ink-muted mb-2">{label}</div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                data-testid={testId}
                autoComplete={autoComplete}
                required={required}
                className="w-full bg-transparent border-0 border-b border-rule focus:border-oxblood outline-none py-2 font-serif text-lg text-ink"
            />
        </label>
    );
}
