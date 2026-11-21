import { createContext } from "react";
import type { Credentials, RegistrationCredentials, User } from "../types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
    user: User | null;
    authStatus: AuthStatus;
    login: (credentials: Credentials) => Promise<void>;
    register: (credentials: RegistrationCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);