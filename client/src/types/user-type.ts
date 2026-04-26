export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: string[];
    phone: string;
    birthyear: number;
    gender: string;
    city: string;
    bio: string | null;
    is_verified: boolean;
}