import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router";
import { getErrorMessage } from "../lib/errors";
import { useAuth } from "../auth/useAuth";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const loginMutation = useMutation({ mutationFn: login });
    const location = useLocation();
    const justRegistered = location.state?.registered === true;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    }

    return (
        <div className="card">
            <h1>Log in</h1>
            {justRegistered && <p className="success">Account created. Please log in.</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {loginMutation.isError && <p className="error">{getErrorMessage(loginMutation.error)}</p>}
                <button type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Logging in…" : "Log in"}
                </button>
            </form>
            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}