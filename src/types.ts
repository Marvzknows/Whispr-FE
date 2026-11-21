export type Role = "USER" | "ADMIN";

export type User = {
    id: string;
    fullName: string
    avatarUrl?: string
    email: string;
    role: Role;
    createdAt: string
}

export type Credentials = {
    email: string;
    password: string;
}

export type RegistrationCredentials = {
    email: string
    password: string
    fullName: string
}