/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                parchment: "#F5F3EC",
                "parchment-deep": "#EAE7DE",
                ink: "#2B2A27",
                "ink-muted": "#57534A",
                oxblood: "#7A2522",
                "oxblood-dark": "#5B1916",
                ultramarine: "#1C2D42",
                rule: "#D4CFC4",
                background: "#F5F3EC",
                foreground: "#2B2A27",
                card: {
                    DEFAULT: "#F5F3EC",
                    foreground: "#2B2A27",
                },
                popover: {
                    DEFAULT: "#F5F3EC",
                    foreground: "#2B2A27",
                },
                primary: {
                    DEFAULT: "#2B2A27",
                    foreground: "#F5F3EC",
                },
                secondary: {
                    DEFAULT: "#EAE7DE",
                    foreground: "#2B2A27",
                },
                muted: {
                    DEFAULT: "#EAE7DE",
                    foreground: "#57534A",
                },
                accent: {
                    DEFAULT: "#7A2522",
                    foreground: "#F5F3EC",
                },
                destructive: {
                    DEFAULT: "#7A2522",
                    foreground: "#F5F3EC",
                },
                border: "#D4CFC4",
                input: "#D4CFC4",
                ring: "#7A2522",
            },
            fontFamily: {
                display: ['"Cormorant Garamond"', "serif"],
                serif: ['"Spectral"', "Georgia", "serif"],
                meta: ['"Cardo"', "Georgia", "serif"],
            },
            borderRadius: {
                lg: "0px",
                md: "0px",
                sm: "0px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-up": "fade-up 0.7s ease-out both",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
