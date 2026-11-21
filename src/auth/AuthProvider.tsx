import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, refreshAccessToken, setSessionExpiredHandler } from "../lib/api";
import { setAccessToken } from "../lib/tokenStore";
import { queryClient } from "../lib/queryClient";
import type { Credentials, User } from "../types";
import { AuthContext, type AuthStatus } from "./authContext";


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

    // Clears everything tied to the current user
    const clearSession = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        setAuthStatus("unauthenticated");
        queryClient.clear(); // drop cached data from the previous user
    }, []);

    // On app load / page refresh: use the refresh cookie to restore the session
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await refreshAccessToken();
                const { data } = await api.get<{ user: User }>("/auth/me");
                if (!cancelled) {
                    setUser(data.user);
                    setAuthStatus("authenticated");
                }
            } catch {
                if (!cancelled) {
                    setAccessToken(null);
                    setUser(null);
                    setAuthStatus("unauthenticated");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // If a later refresh fails (e.g. refresh token expired), log out locally
    useEffect(() => {
        setSessionExpiredHandler(clearSession);
        return () => setSessionExpiredHandler(null);
    }, [clearSession]);


    const login = useCallback(async (credentials: Credentials) => {
        const { data } = await api.post<{ accessToken: string }>(
            "/auth/login",
            credentials
        );

        setAccessToken(data.accessToken);

        // Fetch complete user information after successful login
        const { data: meData } = await api.get<{ user: User }>("/auth/me");

        setUser(meData.user);
        setAuthStatus("authenticated");
    }, []);


    const register = useCallback(async (credentials: Credentials) => {
        await api.post("/auth/register", credentials);
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            clearSession(); // log out locally even if the network call fails
        }
    }, [clearSession]);

    const value = useMemo(
        () => ({ user, authStatus, login, register, logout }),
        [user, authStatus, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}