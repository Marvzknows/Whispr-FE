import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Eye, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import type { User } from "../types";
import { useAuth } from "../auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

export default function DashboardPage() {
    const { user } = useAuth();

    // Manual protected call, so you can watch the silent refresh in the Network tab
    const ping = useQuery({
        queryKey: ["ping"],
        queryFn: async () => (await api.get<{ user: User }>("/auth/me")).data.user,
        enabled: false,
    });

    return (
        <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                            Feeds
                        </h1>
                        <p className="truncate text-xs text-zinc-500 sm:text-sm">
                            Welcome back, {user?.email}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => ping.refetch()}
                        disabled={ping.isFetching}
                        className="w-fit gap-2 rounded-full"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${ping.isFetching ? "animate-spin" : ""}`}
                        />
                        {ping.isFetching ? "Calling…" : "Ping /auth/me"}
                    </Button>
                </div>

                {ping.isError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                        {getErrorMessage(ping.error)}
                    </div>
                )}

                {ping.data && (
                    <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">
                        {JSON.stringify(ping.data, null, 2)}
                    </pre>
                )}

                {/* Feed Post Card 1 */}
                <article className="space-y-4 rounded-3xl border border-blue-100 bg-[#eef4ff] p-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" />
                            <AvatarFallback>GL</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-zinc-900">
                                George Lobko
                            </p>
                            <p className="text-xs text-zinc-500">2 hours ago</p>
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-800">
                        Hi everyone, today I was on the most beautiful mountain in the world
                        🏔️, I also want to say hi to{" "}
                        <span className="font-semibold text-blue-600">Silena</span>,{" "}
                        <span className="font-semibold text-blue-600">Olya</span> and{" "}
                        <span className="font-semibold text-blue-600">Davis</span>!
                    </p>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80"
                            alt="Mountain 1"
                            className="h-44 w-full rounded-2xl object-cover"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80"
                            alt="Mountain 2"
                            className="h-44 w-full rounded-2xl object-cover"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=80"
                            alt="Mountain 3"
                            className="h-44 w-full rounded-2xl object-cover"
                        />
                    </div>

                    <div className="flex items-center gap-6 pt-1 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" /> 6,355
                        </span>
                        <button className="flex items-center gap-1.5 font-medium text-rose-500">
                            <Heart className="h-4 w-4 fill-rose-500" /> Like
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-zinc-900">
                            <MessageCircle className="h-4 w-4" /> Comment
                        </button>
                    </div>
                </article>

                {/* Feed Post Card 2 */}
                <article className="space-y-4 rounded-3xl border border-amber-100 bg-[#fff8eb] p-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" />
                            <AvatarFallback>VB</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-zinc-900">
                                Vitaliy Boyko
                            </p>
                            <p className="text-xs text-zinc-500">3 hours ago</p>
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-800">
                        I chose a wonderful coffee today, I wanted to tell you what product
                        they have in stock — it&apos;s a latte with coconut milk...
                        delicious... it&apos;s really incredibly tasty! ☕
                    </p>
                </article>
            </div>
        </div>
    );
}