export interface Turma {
    id: string;
    nome: string;
    serie: string;
    turno: number; // 0=Manha, 1=Tarde, 2=Noite
    anoLetivo: number;
}