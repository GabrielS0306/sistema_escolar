using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public class Matricula
{
    public Guid Id { get; set; }

    public Guid TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;

    public DateTime DataMatricula { get; set; } = DateTime.UtcNow;
}