import { apiPost } from './api';

interface ResponsavelResponse {
    id: string;
    nomeUsuario: string;
}

export function criarAluno(usuarioId: string, matricula: string) {
    return apiPost('/Alunos', { usuarioId, matricula });
}

export function criarProfessor(usuarioId: string) {
    return apiPost('/Professores', { usuarioId });
}

export function criarCoordenador(usuarioId: string) {
    return apiPost('/Coordenadores', { usuarioId });
}

export function criarAdmin(usuarioId: string) {
    return apiPost('/Admins', { usuarioId });
}

export function criarFuncionario(usuarioId: string) {
    return apiPost('/Funcionarios', { usuarioId });
}

export function criarResponsavel(usuarioId: string) {
    return apiPost<ResponsavelResponse>('/Responsaveis', { usuarioId });
}

export function vincularAlunoResponsavel(responsavelId: string, alunoId: string) {
    return apiPost(`/Responsaveis/${responsavelId}/vincular-aluno`, { alunoId });
}