import { Link, Outlet } from "react-router";
import { useAuth } from "../auth/useAuth";

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="app">
            <header className="nav">
                <nav>
                    <Link to="/">Dashboard</Link>
                    <Link to="/sample">Sample</Link>
                    {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                </nav>
                <div className="nav-right">
                    <span>
                        {user?.email} ({user?.role})
                    </span>
                    <button onClick={() => logout()}>Log out</button>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}