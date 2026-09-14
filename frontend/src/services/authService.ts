import { apiPost, apiPostForm } from './api';
import type { LoginResponse, RegistrarResponse } from '../types/auth';

export function login(email: string, senha: string): Promise<LoginResponse> {
    return apiPost<LoginResponse>('/Auth/login', { email, senha });
}

interface DadosRegistro {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cpf?: string;
    endereco?: string;
    dataNascimento?: string;
    sexo?: number;
    foto?: File | null;
}

export function registrar(dados: DadosRegistro): Promise<RegistrarResponse> {
    const formData = new FormData();
    formData.append('Nome', dados.nome);
    formData.append('Email', dados.email);
    formData.append('Senha', dados.senha);

    if (dados.telefone) formData.append('Telefone', dados.telefone);
    if (dados.cpf) formData.append('Cpf', dados.cpf);
    if (dados.endereco) formData.append('Endereco', dados.endereco);
    if (dados.dataNascimento) formData.append('DataNascimento', dados.dataNascimento);
    if (dados.sexo !== undefined) formData.append('Sexo', String(dados.sexo));
    if (dados.foto) formData.append('foto', dados.foto);

    return apiPostForm<RegistrarResponse>('/Auth/registrar', formData);
}