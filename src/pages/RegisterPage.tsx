import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getErrorMessage } from "../lib/errors";
import { useAuth } from "../auth/useAuth";
import { useMutation } from "@tanstack/react-query";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const registerMutation = useMutation({ mutationFn: register });
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        registerMutation.mutate(
            { email, password },
            { onSuccess: () => navigate("/login", { state: { registered: true } }) }
        );
    }

    return (
        <div className="card">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password (min. 8 characters)
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                {registerMutation.isError && <p className="error">{getErrorMessage(registerMutation.error)}</p>}
                <button type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Creating account…" : "Create account"}
                </button>
            </form>
            <p>
                Already registered? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}