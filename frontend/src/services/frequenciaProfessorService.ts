import { apiPost } from './api';

interface PresencaAluno {
    alunoId: string;
    presente: boolean;
}

interface RegistrarChamadaDto {
    professorTurmaDisciplinaId: string;
    data: string;
    presencas: PresencaAluno[];
}

export function registrarChamada(dto: RegistrarChamadaDto) {
    return apiPost('/Frequencias/registrar', dto);
<<<<<<< HEAD
}   
=======
}
>>>>>>> main
