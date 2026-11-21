import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../lib/errors";
import { useAuth } from "../auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    const [rememberMe, setRememberMe] = useState(false);

    const { login } = useAuth();
    const loginMutation = useMutation({ mutationFn: login });

    const location = useLocation();
    const justRegistered = location.state?.registered === true;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-4">
            <Card className="w-full max-w-100 rounded-3xl border-zinc-200/80 bg-white p-2 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-500">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {justRegistered && (
                        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                            Account created successfully. Please sign in.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-xs font-medium text-zinc-700"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-10 rounded-xl border-zinc-200 focus-visible:ring-blue-600"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-xs font-medium text-zinc-700"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-10 rounded-xl border-zinc-200 focus-visible:ring-blue-600"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs font-normal text-zinc-600"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {loginMutation.isError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                                {getErrorMessage(loginMutation.error)}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="mt-2 h-10 w-full rounded-xl bg-zinc-900 font-medium text-white hover:bg-zinc-800"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Signing in…" : "Sign In"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center pt-1 pb-5 text-xs text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="ml-1 font-semibold text-zinc-900 hover:underline"
                    >
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}