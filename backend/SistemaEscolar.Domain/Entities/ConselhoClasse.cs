using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public enum ResultadoConselho
{
    PendenteVotacao,
    Aprovado,
    Reprovado
}

public class ConselhoClasse
{
    public Guid Id { get; set; }

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;

    public Guid AnoLetivoId { get; set; }
    public AnoLetivo AnoLetivo { get; set; } = null!;

    public DateTime Data { get; set; } = DateTime.UtcNow;
    public ResultadoConselho Resultado { get; set; } = ResultadoConselho.PendenteVotacao;
}