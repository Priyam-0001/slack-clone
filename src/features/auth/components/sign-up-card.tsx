"use client"

import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa6"
import { SignInFlow } from "../types"
import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react"
import { ConvexError } from "convex/values"

interface SignUpCardProps {
    setState: (state: SignInFlow) => void
};

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const onPasswordSignUp = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (!/\d/.test(password)) {
            setError("Password must contain at least one number");
            return;
        }

        if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setPending(true);
        signIn("password", { name, email, password, flow: "signUp" })
        signIn("password", { name, email, password, flow: "signUp" })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    const match = error.message.match(
                        /Uncaught ConvexError: (.*?)(?:\n|$)/
                    );

                    setError(match ? match[1] : "Server Error");
                } else {
                    setError("Something went wrong");
                }
            })
            .finally(() => {
                setPending(false)
            });
    }

    const onProviderSignUp = (value: ("github" | "google")) => {
        setPending(true)
        signIn(value)
            .finally(() => setPending(false))
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign Up to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive my- 2.5">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                    <Input
                        disabled={pending}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        type="string"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={pending}
                        onClick={() => { onProviderSignUp("google") }}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        <FcGoogle className="size-4.5 absolute top-2 left-2.5" />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={pending}
                        onClick={() => { onProviderSignUp("github") }}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        <FaGithub className="size-4.5 absolute top-2 left-2.5" />
                        Continue with GitHub
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account? <span onClick={() => (setState("signIn"))} className="text-sky-700 hover:underline cursor-pointer">Sign In</span>
                </p>
            </CardContent>
        </Card>
    )
}