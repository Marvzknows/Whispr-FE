import { useState, type FormEvent } from "react";
import {
    Search,
    Phone,
    Video,
    Info,
    Paperclip,
    Image as ImageIcon,
    Smile,
    Send,
    ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    sender: "me" | "them";
    text?: string;
    images?: string[];
    timestamp: string;
}

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    lastMessage: string;
    time: string;
    unread: number;
    typing?: boolean;
    messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: "1",
        name: "George Lobko",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        online: true,
        lastMessage: "See you soon!",
        time: "2m ago",
        unread: 2,
        typing: true,
        messages: [
            {
                id: "m1",
                sender: "them",
                text: "Hi everyone, today I was on the most beautiful mountain in the world 🏔️",
                timestamp: "2:14 PM",
            },
            {
                id: "m2",
                sender: "them",
                images: [
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=80",
                ],
                timestamp: "2:14 PM",
            },
            {
                id: "m3",
                sender: "me",
                text: "Wow, that looks incredible! Did you hike to the top?",
                timestamp: "2:15 PM",
            },
            {
                id: "m4",
                sender: "them",
                text: "Yes! I also wanted to say hi to Silena and Olya",
                timestamp: "12m ago",
            },
        ],
    },
    {
        id: "2",
        name: "Silena Davis",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        online: true,
        lastMessage: "Are we still meeting?",
        time: "1h ago",
        unread: 0,
        messages: [
            {
                id: "s1",
                sender: "them",
                text: "Hey! Are we still meeting at 4 PM for the design review?",
                timestamp: "1:10 PM",
            },
            {
                id: "s2",
                sender: "me",
                text: "Yep, I'll send the link five minutes before.",
                timestamp: "1:12 PM",
            },
        ],
    },
    {
        id: "3",
        name: "Olya Boyko",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
        online: false,
        lastMessage: "That sounds amazing!",
        time: "3h ago",
        unread: 0,
        messages: [
            {
                id: "o1",
                sender: "me",
                text: "Just pushed the new shadcn UI components to staging.",
                timestamp: "11:05 AM",
            },
            {
                id: "o2",
                sender: "them",
                text: "That sounds amazing!",
                timestamp: "11:20 AM",
            },
        ],
    },
    {
        id: "4",
        name: "Vitaliy Boyko",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        online: true,
        lastMessage:
            "I chose a wonderful coffee today, it's a latte with coconut milk!",
        time: "Yesterday",
        unread: 0,
        messages: [
            {
                id: "v1",
                sender: "them",
                text: "I chose a wonderful coffee today, it's a latte with coconut milk... really tasty!",
                timestamp: "Yesterday",
            },
        ],
    },
];

export default function ChatPage() {
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [activeId, setActiveId] = useState<string>("1");
    const [mobileShowThread, setMobileShowThread] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [draft, setDraft] = useState("");

    const activeChat =
        conversations.find((c) => c.id === activeId) ?? conversations[0];

    const filteredConversations = conversations.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleSelectChat(id: string) {
        setActiveId(id);
        setMobileShowThread(true);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
        );
    }

    function handleSendMessage(e: FormEvent) {
        e.preventDefault();
        if (!draft.trim()) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            sender: "me",
            text: draft.trim(),
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeChat.id
                    ? {
                        ...c,
                        lastMessage: newMessage.text ?? "",
                        time: "Just now",
                        messages: [...c.messages, newMessage],
                    }
                    : c
            )
        );
        setDraft("");
    }

    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Chat List Panel: full width on mobile when thread is closed, fixed sidebar on md+ */}
            <section
                className={cn(
                    "flex w-full shrink-0 flex-col border-zinc-200/80 bg-white md:w-72 md:border-r lg:w-96",
                    mobileShowThread ? "hidden md:flex" : "flex"
                )}
            >
                <div className="p-4 pb-3 md:p-5 md:pb-3">
                    <h2 className="mb-3 hidden text-xl font-bold tracking-tight text-zinc-900 md:mb-4 md:block">
                        Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="rounded-full border-zinc-200/80 bg-zinc-50 pl-9 text-sm focus-visible:ring-blue-600"
                        />
                    </div>
                </div>

                <ScrollArea className="min-h-0 flex-1 px-2.5 md:px-3">
                    <div className="space-y-1 py-1.5 md:py-2">
                        {filteredConversations.map((chat) => {
                            const isSelected = chat.id === activeChat.id;
                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat.id)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                                        isSelected ? "bg-[#eef2f6]" : "hover:bg-zinc-50"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <Avatar className="h-11 w-11 border border-zinc-200">
                                            <AvatarImage src={chat.avatar} alt={chat.name} />
                                            <AvatarFallback>{chat.name.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        {chat.online && (
                                            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-semibold text-zinc-900">
                                                {chat.name}
                                            </p>
                                            <span className="shrink-0 text-[11px] text-zinc-400">
                                                {chat.time}
                                            </span>
                                        </div>
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <p className="truncate text-xs text-zinc-500">
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unread > 0 && (
                                                <Badge className="h-5 min-w-5 rounded-full bg-blue-600 px-1.5 text-[11px] text-white hover:bg-blue-600">
                                                    {chat.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </section>

            {/* Active Chat Thread: full width on mobile when open, fluid pane on md+ */}
            <section
                className={cn(
                    "min-h-0 min-w-0 flex-1 flex-col bg-white",
                    mobileShowThread ? "flex" : "hidden md:flex"
                )}
            >
                {/* Chat Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/80 px-3 sm:px-6 md:h-18">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        {/* Mobile Back Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileShowThread(false)}
                            className="h-9 w-9 shrink-0 rounded-full text-zinc-600 md:hidden"
                            aria-label="Back to conversations"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className="relative shrink-0">
                            <Avatar className="h-9 w-9 border border-zinc-200 sm:h-10 sm:w-10">
                                <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                                <AvatarFallback>{activeChat.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            {activeChat.online && (
                                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h3 className="truncate text-sm font-semibold text-zinc-900">
                                    {activeChat.name}
                                </h3>
                                {activeChat.online && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                )}
                            </div>
                            <p className="text-xs text-zinc-500">
                                {activeChat.online ? "Active now" : "Offline"}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900"
                        >
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900"
                        >
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900 sm:inline-flex"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Scrollable Message Thread */}
                <ScrollArea className="min-h-0 flex-1 px-3 py-4 sm:px-6 sm:py-5">
                    <div className="mx-auto max-w-3xl space-y-4">
                        {activeChat.messages.map((msg) => {
                            const isMe = msg.sender === "me";
                            return (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex items-end gap-2 sm:gap-2.5",
                                        isMe ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isMe && (
                                        <Avatar className="mb-4 h-7 w-7 shrink-0 border border-zinc-200 sm:h-8 sm:w-8">
                                            <AvatarImage src={activeChat.avatar} />
                                            <AvatarFallback>
                                                {activeChat.name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={cn(
                                            "flex max-w-[85%] flex-col sm:max-w-[75%] lg:max-w-[68%]",
                                            isMe ? "items-end" : "items-start"
                                        )}
                                    >
                                        {msg.text && (
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-3.5 py-2 text-sm leading-relaxed sm:px-4 sm:py-2.5",
                                                    isMe
                                                        ? "rounded-br-sm bg-[#2563eb] text-white"
                                                        : "rounded-bl-sm bg-[#f1f3f5] text-zinc-800"
                                                )}
                                            >
                                                {msg.text}
                                            </div>
                                        )}

                                        {msg.images && (
                                            <div className="grid grid-cols-1 gap-2 rounded-2xl bg-[#f1f3f5] p-2 sm:grid-cols-2">
                                                {msg.images.map((src, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={src}
                                                        alt="Attachment"
                                                        className="h-36 w-full rounded-xl object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <span className="mt-1 px-1 text-[11px] text-zinc-400">
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {activeChat.typing && (
                            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                                <span className="flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                                </span>
                                <span>{activeChat.name.split(" ")[0]} is typing...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Bottom Message Input Bar */}
                <footer className="shrink-0 border-t border-zinc-200/80 bg-white p-3 sm:px-6 sm:py-4">
                    <form
                        onSubmit={handleSendMessage}
                        className="mx-auto flex max-w-3xl items-center gap-2"
                    >
                        <div className="flex flex-1 items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50/70 px-3 py-1 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 sm:gap-1 sm:px-4 sm:py-1.5">
                            <Input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Type a message..."
                                className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full text-zinc-400 hover:text-zinc-700"
                            >
                                <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hidden h-8 w-8 shrink-0 rounded-full text-zinc-400 hover:text-zinc-700 sm:inline-flex"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full text-zinc-400 hover:text-zinc-700"
                            >
                                <Smile className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            className="h-10 w-10 shrink-0 rounded-full bg-zinc-900 p-0 font-medium text-white hover:bg-zinc-800 sm:h-11 sm:w-auto sm:gap-1.5 sm:px-5"
                            aria-label="Send message"
                        >
                            <span className="hidden sm:inline">Send</span>
                            <Send className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                        </Button>
                    </form>
                </footer>
            </section>
        </div>
    );
}