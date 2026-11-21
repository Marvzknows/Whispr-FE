import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";

export type ApiErrorResponse = {
    message: string;
    errors?: Record<string, string[]>;
};

const baseURL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
    baseURL,
    withCredentials: true, // sends the refresh cookie
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Bare client (no interceptors) so a failed refresh can't loop
const authClient = axios.create({ baseURL, withCredentials: true });

// Concurrent 401s share one refresh call
let refreshing: Promise<string> | null = null;

export function refreshAccessToken() {
    refreshing ??= authClient
        .post<{ accessToken: string }>("/auth/refresh")
        .then((res) => {
            setAccessToken(res.data.accessToken);
            return res.data.accessToken;
        })
        .finally(() => {
            refreshing = null;
        });
    return refreshing;
}

// AuthProvider registers a function here to be told when the session has expired
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
    onSessionExpired = handler;
}

// Attach token
api.interceptors.request.use((config) => {
    const t = getAccessToken();
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
});

// These return 401 for reasons a refresh can't fix (e.g. wrong password)
const NO_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

// On 401: refresh once, retry; if refresh fails, end the session locally
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (
            error.response?.status !== 401 ||
            !original ||
            original._retry ||
            NO_REFRESH.includes(original.url ?? "")
        ) {
            return Promise.reject(error);
        }

        original._retry = true;

        let token: string;
        try {
            token = await refreshAccessToken();
        } catch (refreshError) {
            setAccessToken(null);
            onSessionExpired?.();
            return Promise.reject(refreshError);
        }

        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
    },
);