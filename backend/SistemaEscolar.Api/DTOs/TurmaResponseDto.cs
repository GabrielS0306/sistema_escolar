using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class TurmaResponseDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Serie { get; set; } = string.Empty;
    public TurnoEscolar Turno { get; set; }
    public int AnoLetivo { get; set; }
}