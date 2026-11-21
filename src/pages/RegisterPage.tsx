import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../lib/errors";
import { useAuth } from "../auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { register } = useAuth();
    const registerMutation = useMutation({ mutationFn: register });
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        registerMutation.mutate(
            { fullName, email, password },
            { onSuccess: () => navigate("/login", { state: { registered: true } }) }
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Register</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters long.
                            </p>
                        </div>

                        {registerMutation.isError && (
                            <p className="text-sm font-medium text-destructive">
                                {getErrorMessage(registerMutation.error)}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? "Creating account…" : "Create account"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                        to="/login"
                        className="ml-1 font-medium text-primary hover:underline"
                    >
                        Log in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}