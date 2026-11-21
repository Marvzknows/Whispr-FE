import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // 401/403 won't fix themselves by retrying
            refetchOnWindowFocus: false,
        },
    },
});