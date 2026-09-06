using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public class ResponsavelAluno
{
    public Guid Id { get; set; }

    public Guid ResponsavelId { get; set; }
    public Responsavel Responsavel { get; set; } = null!;

    public Guid AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;
}