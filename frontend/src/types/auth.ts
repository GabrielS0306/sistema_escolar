export interface LoginResponse {
    token: string;
    nome: string;
    papeis: string[];
}

export interface RegistrarResponse {
    id: string;
    nome: string;
    email: string;
}