using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class CreateTurmaDto
{
    public Guid AnoLetivoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Serie { get; set; } = string.Empty;
    public TurnoEscolar Turno { get; set; }
}