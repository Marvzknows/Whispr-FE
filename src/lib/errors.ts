import axios from "axios";

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { error?: string } | undefined)?.error;
        if (message) return message;
        if (!error.response) return "Cannot reach the server. Is the API running?";
    }
    return "Something went wrong";
}