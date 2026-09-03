using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public enum StatusDisciplina
{
    EmAndamento,
    Aprovado,
    EmRecuperacao,
    Reprovado
}

public class SituacaoDisciplina
{
    public Guid Id { get; set; }

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;

    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public ProfessorTurmaDisciplina ProfessorTurmaDisciplina { get; set; } = null!;

    public decimal? MediaFinal { get; set; }
    public decimal? NotaProvaFinal { get; set; }
    public StatusDisciplina Status { get; set; } = StatusDisciplina.EmAndamento;
}