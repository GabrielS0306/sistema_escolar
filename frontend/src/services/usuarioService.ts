import { apiGet, apiPutForm } from './api';
import type { UsuarioDetalhado } from '../types/usuario';

export interface UsuarioResumo {
    id: string;
    nome: string;
    email: string;
}

export function getUsuarios(): Promise<UsuarioResumo[]> {
    return apiGet<UsuarioResumo[]>('/Usuarios');
}

export function getUsuario(id: string): Promise<UsuarioDetalhado> {
    return apiGet<UsuarioDetalhado>(`/Usuarios/${id}`);
}

interface DadosEdicaoAdmin {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    endereco?: string;
    dataNascimento?: string;
    sexo?: number;
    foto?: File | null;
}

export function atualizarUsuarioAdmin(id: string, dados: DadosEdicaoAdmin): Promise<UsuarioDetalhado> {
    const formData = new FormData();

    if (dados.nome) formData.append('Nome', dados.nome);
    if (dados.email) formData.append('Email', dados.email);
    if (dados.telefone) formData.append('Telefone', dados.telefone);
    if (dados.cpf) formData.append('Cpf', dados.cpf);
    if (dados.endereco) formData.append('Endereco', dados.endereco);
    if (dados.dataNascimento) formData.append('DataNascimento', dados.dataNascimento);
    if (dados.sexo !== undefined) formData.append('Sexo', String(dados.sexo));
    if (dados.foto) formData.append('foto', dados.foto);

    return apiPutForm<UsuarioDetalhado>(`/Usuarios/${id}`, formData);
}