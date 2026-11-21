import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/errors";

export default function AdminPage() {
    const stats = useQuery({
        queryKey: ["admin", "stats"],
        queryFn: async () => (await api.get<{ userCount: number }>("/admin/stats")).data,
    });

    return (
        <div>
            <h1>Admin</h1>
            {stats.isPending && <p>Loading…</p>}
            {stats.isError && <p className="error">{getErrorMessage(stats.error)}</p>}
            {stats.data && <p>Total registered users: {stats.data.userCount}</p>}
        </div>
    );
}