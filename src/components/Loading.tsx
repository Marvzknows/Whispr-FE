import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-dvh items-center justify-center bg-[#f4f6f8] p-4"
        >
            <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
                <span>Loading…</span>
            </div>
        </div>
    );
};

export default Loading;