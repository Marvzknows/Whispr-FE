import { Navigate, Outlet, useLocation } from "react-router";
import { ForbiddenPage } from "../pages/ErrorPages";
import type { Role } from "../types";
import { useAuth } from "./useAuth";

function Loading() {
    return <p className="center">Loading…</p>;
}

export function RequireAuth() {
    const { user, authStatus } = useAuth();
    const location = useLocation();

    if (authStatus === "loading") return <Loading />;
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}

export function RequireRole({ roles }: { roles: Role[] }) {
    const { user } = useAuth();

    if (!user || !roles.includes(user.role)) return <ForbiddenPage />;
    return <Outlet />;
}

export function GuestOnly() {
    const { user, authStatus } = useAuth();
    const location = useLocation();

    if (authStatus === "loading") return <Loading />;
    if (user) {
        const from = location.state?.from?.pathname ?? "/";
        return <Navigate to={from} replace />;
    }
    return <Outlet />;
}