using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Domain.Entities;

public class Turma
{
    public Guid Id { get; set; }
    public Guid AnoLetivoId { get; set; }
    public AnoLetivo AnoLetivo { get; set; } = null!;

    public string Nome { get; set; } = string.Empty;   // ex: "9º A"
    public string Serie { get; set; } = string.Empty;  // ex: "9º Ano"
    public TurnoEscolar Turno { get; set; }
}