export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    fullName: string;
}

export interface User {
    username: string;
    fullName: string;
}
