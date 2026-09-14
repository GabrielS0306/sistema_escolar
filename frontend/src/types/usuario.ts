export interface UsuarioDetalhado {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    endereco?: string;
    fotoPerfilUrl?: string;
    dataNascimento?: string;
    sexo?: number;
}