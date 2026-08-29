using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public class Nota
{
    public Guid Id { get; set; }

    public Guid AvaliacaoId { get; set; }
    public Avaliacao Avaliacao { get; set; } = null!;

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;

    public decimal Valor { get; set; }
}