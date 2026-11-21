import { useState, type ComponentType } from "react";
import { Outlet, useLocation } from "react-router";
import {
    MessageSquare,
    Home,
    Users,
    ShieldCheck,
    FileCode2,
    Menu,
} from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SidebarContent from "./SidebarContent";

export type NavItem = {
    to: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    badge?: number;
    end?: boolean;
}

export default function Layout() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems: NavItem[] = [
        { to: "/chat", label: "Messages", icon: MessageSquare, badge: 2 },
        { to: "/", label: "Dashboard", icon: Home, end: true },
        { to: "/friends", label: "Friends", icon: Users, badge: 3 },
        { to: "/sample", label: "Sample", icon: FileCode2 },
        ...(user?.role === "ADMIN"
            ? [{ to: "/admin", label: "Admin", icon: ShieldCheck }]
            : []),
    ];

    const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "BN";

    const activeTitle =
        navItems.find((item) =>
            item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)
        )?.label ?? "PulseChat";

    return (
        <div className="flex h-dvh items-center justify-center bg-[#f4f6f8] md:min-h-screen md:p-4 lg:p-6">
            <div className="flex h-full w-full max-w-350 flex-col overflow-hidden bg-white md:h-[calc(100vh-2rem)] md:flex-row md:rounded-3xl md:border md:border-zinc-200/80 md:shadow-sm lg:h-[calc(100vh-3rem)]">
                {/* Mobile Top Navigation Bar (< md) */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white px-4 md:hidden">
                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-ml-2 h-9 w-9 rounded-full text-zinc-700"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <span className="text-base font-bold tracking-tight text-zinc-900">
                            {activeTitle}
                        </span>
                    </div>

                    <Avatar className="h-8 w-8 border border-zinc-200">
                        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
                        <AvatarFallback className="bg-blue-600 text-xs text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </header>

                {/* Mobile Slide-Over Drawer */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div
                            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <aside className="relative z-10 h-full w-72 max-w-[80vw] bg-white shadow-xl">
                            <SidebarContent
                                isMobile
                                navItems={navItems}
                                user={user}
                                initials={initials}
                                onClose={() => setMobileMenuOpen(false)}
                                onLogout={logout}
                            />
                        </aside>
                    </div>
                )}

                {/* Tablet (icon rail) & Desktop (full sidebar) */}
                <aside className="hidden shrink-0 border-r border-zinc-200/80 bg-white md:block md:w-20 lg:w-64">
                    <SidebarContent
                        navItems={navItems}
                        user={user}
                        initials={initials}
                        onLogout={logout}
                    />
                </aside>

                {/* Main Content Area */}
                <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}