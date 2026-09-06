import { apiPost } from './api';
import type { LoginResponse, RegistrarResponse } from '../types/auth';

export function login(email: string, senha: string): Promise<LoginResponse> {
    return apiPost<LoginResponse>('/Auth/login', { email, senha });
}

export function registrar(nome: string, email: string, senha: string): Promise<RegistrarResponse> {
    return apiPost<RegistrarResponse>('/Auth/registrar', { nome, email, senha });
}