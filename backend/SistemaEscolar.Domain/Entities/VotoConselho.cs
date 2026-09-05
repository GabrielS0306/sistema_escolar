using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Domain.Entities;

public enum TipoVoto
{
    Aprovar,
    Reprovar
}

public class VotoConselho
{
    public Guid Id { get; set; }

    public Guid ConselhoClasseId { get; set; }
    public ConselhoClasse ConselhoClasse { get; set; } = null!;

    public Guid ProfessorId { get; set; }
    public Professor Professor { get; set; } = null!;

    public TipoVoto Voto { get; set; }
}