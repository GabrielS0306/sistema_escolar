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
// Para onde cada papel vai depois do login (usado no Login e na seleção de papel).
export const ROTA_POR_PAPEL: Record<string, string> = {
    Admin: '/admin',
    Coordenador: '/coordenador',
    Professor: '/dashboard/professor',
    Responsavel: '/dashboard/responsavel',
    Aluno: '/dashboard/aluno',
    Funcionario: '/dashboard/funcionario',
    SemPerfil: '/dashboard/sem-perfil',
};

// Os papéis chegam do backend sem acento ("Responsavel"); este é o nome para mostrar na tela.
export const ROTULO_PAPEL: Record<string, string> = {
    Admin: 'Administrador',
    Coordenador: 'Coordenador',
    Professor: 'Professor',
    Responsavel: 'Responsável',
    Aluno: 'Aluno',
    Funcionario: 'Funcionário',
    SemPerfil: 'Sem perfil',
};
