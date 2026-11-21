import type { NavItem } from "./Layout";
import type { User } from "@/types";
import { NavLink } from "react-router";
import { LogOut, MessageSquare, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarContentProps = {
    isMobile?: boolean;
    navItems: NavItem[];
    user: User | null;
    initials: string;
    onClose?: () => void;
    onLogout: () => void;
};

const SidebarContent = ({
    isMobile = false,
    navItems,
    user,
    initials,
    onClose,
    onLogout,
}: SidebarContentProps) => {
    return (
        <div className="flex h-full flex-col justify-between p-4 lg:p-5">
            <div>
                {/* Brand Header */}
                <div className="mb-8 flex items-center justify-between px-1 lg:px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className={cn(!isMobile && "hidden lg:block")}>
                            <p className="text-sm font-semibold leading-tight text-zinc-900">
                                Whispr
                            </p>
                            <p className="text-xs text-zinc-500">Workspace</p>
                        </div>
                    </div>

                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full text-zinc-500"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                    {navItems.map(({ to, label, icon: Icon, badge, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => isMobile && onClose?.()}
                            className={({ isActive }) =>
                                cn(
                                    "relative flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors lg:px-4",
                                    !isMobile && "md:justify-center lg:justify-between",
                                    isActive
                                        ? "bg-zinc-900 text-white shadow-xs"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="flex items-center gap-3">
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className={cn(!isMobile && "hidden lg:inline")}>
                                            {label}
                                        </span>
                                    </span>
                                    {badge && (
                                        <Badge
                                            variant={isActive ? "secondary" : "default"}
                                            className={cn(
                                                "h-5 min-w-5 rounded-full px-1.5 text-[11px] font-semibold",
                                                !isMobile &&
                                                "md:absolute md:-top-1 md:-right-1 md:h-4 md:min-w-4 md:px-1 md:text-[10px] lg:static lg:h-5 lg:min-w-5 lg:px-1.5 lg:text-[11px]",
                                                isActive
                                                    ? "bg-white text-zinc-900"
                                                    : "bg-zinc-900 text-white"
                                            )}
                                        >
                                            {badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom User Profile & Logout */}
            <div className="border-t border-zinc-100 pt-4">
                <div
                    className={cn(
                        "flex items-center justify-between gap-2 rounded-2xl border border-zinc-200/60 bg-zinc-50 p-2",
                        !isMobile && "md:flex-col lg:flex-row"
                    )}
                >
                    <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar className="h-9 w-9 shrink-0 border border-zinc-200">
                            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
                            <AvatarFallback className="bg-blue-600 text-xs text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className={cn("min-w-0", !isMobile && "hidden lg:block")}>
                            <p className="truncate text-xs font-semibold text-zinc-900">
                                {user?.email ?? "user@example.com"}
                            </p>
                            <p className="text-[11px] capitalize text-zinc-500">
                                {user?.role?.toLowerCase() ?? "member"} • Online
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        title="Log out"
                        className="h-8 w-8 shrink-0 rounded-full text-zinc-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SidebarContent;