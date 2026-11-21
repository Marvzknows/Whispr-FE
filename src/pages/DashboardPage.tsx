import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import type { User } from "../types";
import { useAuth } from "../auth/useAuth";

export default function DashboardPage() {
    const { user } = useAuth();

    // Manual protected call, so you can watch the silent refresh in the Network tab
    const ping = useQuery({
        queryKey: ["ping"],
        queryFn: async () => (await api.get<{ user: User }>("/auth/me")).data.user,
        enabled: false,
    });

    return (
        <div>
            <h1>Dashboard</h1>
            <p>
                Logged in as <strong>{user?.email}</strong> with role <strong>{user?.role}</strong>.
            </p>

            <button onClick={() => ping.refetch()} disabled={ping.isFetching}>
                {ping.isFetching ? "Calling…" : "Call protected API (/auth/me)"}
            </button>

            {ping.isError && <p className="error">{getErrorMessage(ping.error)}</p>}
            {ping.data && <pre>{JSON.stringify(ping.data, null, 2)}</pre>}
        </div>
    );
}