import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null = checking, false = unauth, object = authed
    const [error, setError] = useState("");

    const fetchMe = useCallback(async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            setUser(false);
            return;
        }
        try {
            const { data } = await api.get("/auth/me");
            setUser(data);
        } catch (e) {
            localStorage.removeItem("auth_token");
            setUser(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    const login = async (email, password) => {
        setError("");
        try {
            const { data } = await api.post("/auth/login", { email, password });
            if (data.access_token) localStorage.setItem("auth_token", data.access_token);
            setUser(data);
            return true;
        } catch (e) {
            setError(formatApiErrorDetail(e.response?.data?.detail) || e.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignore
        }
        localStorage.removeItem("auth_token");
        setUser(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, error, refresh: fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
