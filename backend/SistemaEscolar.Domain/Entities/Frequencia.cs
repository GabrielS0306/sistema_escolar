using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public class Frequencia
{
    public Guid Id { get; set; }

    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public ProfessorTurmaDisciplina ProfessorTurmaDisciplina { get; set; } = null!;

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;

    public DateTime Data { get; set; }
    public bool Presente { get; set; }
}