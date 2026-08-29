namespace SistemaEscolar.Api.DTOs;

public class LancarNotasDto
{
    public Guid AvaliacaoId { get; set; }
    public List<NotaAlunoDto> Notas { get; set; } = new();
}

public class NotaAlunoDto
{
    public Guid AlunoId { get; set; }
    public decimal Valor { get; set; }
}