export interface Comunicado {
    id: string;
    titulo: string;
    mensagem: string;
    publicoAlvo: number;   // 0 TodaEscola, 1 Turma, 2 Professores, 3 Alunos
    turma: string | null;
    autor: string | null;
    dataEnvio: string;
}

export interface CriarComunicado {
    titulo: string;
    mensagem: string;
    publicoAlvo: number;
    turmaId?: string;
}

export const PUBLICO_ALVO_LABEL = ['Escola toda', 'Turma', 'Professores', 'Alunos'];
