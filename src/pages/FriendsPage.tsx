import { Link } from "react-router";
import { MessageSquare, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

const FRIENDS = [
    {
        id: "1",
        name: "George Lobko",
        handle: "@georgelobko",
        online: true,
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: "2",
        name: "Silena Davis",
        handle: "@silenadavis",
        online: true,
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: "3",
        name: "Olya Boyko",
        handle: "@olyaboyko",
        online: false,
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
];

export default function FriendsPage() {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Friends
                        </h1>
                        <p className="text-sm text-zinc-500">
                            People in your workspace network
                        </p>
                    </div>
                    <Button className="w-fit gap-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800">
                        <UserPlus className="h-4 w-4" /> Invite Friend
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FRIENDS.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex flex-col items-center space-y-3 rounded-3xl border border-zinc-200/80 bg-white p-5 text-center"
                        >
                            <div className="relative">
                                <Avatar className="h-16 w-16 border border-zinc-200">
                                    <AvatarImage src={friend.avatar} />
                                    <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                {friend.online && (
                                    <span className="absolute right-0.5 bottom-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900">
                                    {friend.name}
                                </p>
                                <p className="text-xs text-zinc-500">{friend.handle}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 rounded-full"
                            >
                                <Link to="/chat">
                                    <MessageSquare className="h-3.5 w-3.5" /> Message
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}