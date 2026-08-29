using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public class ProfessorTurmaDisciplina
{
    public Guid Id { get; set; }

    public Guid ProfessorId { get; set; }
    public Professor Professor { get; set; } = null!;

    public Guid TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;

    public Guid DisciplinaId { get; set; }
    public Disciplina Disciplina { get; set; } = null!;
}