import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router";
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

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const loginMutation = useMutation({ mutationFn: login });

    const location = useLocation();
    const justRegistered = location.state?.registered === true;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {justRegistered && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            Account created successfully. Please log in.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                required
                            />
                        </div>

                        {loginMutation.isError && (
                            <p className="text-sm font-medium text-destructive">
                                {getErrorMessage(loginMutation.error)}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in…" : "Log in"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    No account?{" "}
                    <Link
                        to="/register"
                        className="ml-1 font-medium text-primary hover:underline"
                    >
                        Register
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}