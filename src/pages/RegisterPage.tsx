import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
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

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const { register } = useAuth();
    const registerMutation = useMutation({ mutationFn: register });
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setValidationError(null);

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        if (!agreed) {
            setValidationError(
                "Please agree to the Terms of Service and Privacy Policy."
            );
            return;
        }

        registerMutation.mutate(
            { fullName, email, password },
            { onSuccess: () => navigate("/login", { state: { registered: true } }) }
        );
    }

    const errorMessage =
        validationError ??
        (registerMutation.isError
            ? getErrorMessage(registerMutation.error)
            : null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-4">
            <Card className="w-full max-w-100 rounded-3xl border-zinc-200/80 bg-white p-2 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-500">
                        Enter your details to get started
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="fullName"
                                className="text-xs font-medium text-zinc-700"
                            >
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="George Lobko"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="h-10 rounded-xl border-zinc-200 focus-visible:ring-blue-600"
                            />
                        </div>

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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                                className="h-10 rounded-xl border-zinc-200 focus-visible:ring-blue-600"
                            />
                            <p className="text-[11px] text-zinc-400">
                                Must be at least 8 characters long.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-xs font-medium text-zinc-700"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                required
                                className="h-10 rounded-xl border-zinc-200 focus-visible:ring-blue-600"
                            />
                        </div>

                        <div className="flex items-start space-x-2 pt-0.5">
                            <Checkbox
                                id="terms"
                                checked={agreed}
                                onCheckedChange={(checked) => setAgreed(checked === true)}
                                className="mt-0.5"
                            />
                            <Label
                                htmlFor="terms"
                                className="cursor-pointer text-xs font-normal leading-snug text-zinc-600"
                            >
                                I agree to the{" "}
                                <span className="font-medium text-zinc-900">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="font-medium text-zinc-900">
                                    Privacy Policy
                                </span>
                            </Label>
                        </div>

                        {errorMessage && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="mt-2 h-10 w-full rounded-xl bg-zinc-900 font-medium text-white hover:bg-zinc-800"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending
                                ? "Creating account…"
                                : "Create Account"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center pt-1 pb-5 text-xs text-zinc-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="ml-1 font-semibold text-zinc-900 hover:underline"
                    >
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}