import { Link } from "react-router";

export function ForbiddenPage() {
    return (
        <div className="card">
            <h1>403: Forbidden</h1>
            <p>You don't have permission to view this page.</p>
            <Link to="/">Back to dashboard</Link>
        </div>
    );
}

export function NotFoundPage() {
    return (
        <div className="card">
            <h1>404: Page not found</h1>
            <Link to="/">Go home</Link>
        </div>
    );
}