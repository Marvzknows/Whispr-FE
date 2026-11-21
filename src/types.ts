export type Role = "USER" | "ADMIN";

export type User = {
    id: string;
    email: string;
    role: Role;
}

export type Credentials = {
    email: string;
    password: string;
}