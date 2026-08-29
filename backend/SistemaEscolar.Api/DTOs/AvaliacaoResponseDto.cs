namespace SistemaEscolar.Api.DTOs;

public class AvaliacaoResponseDto
{
    public Guid Id { get; set; }
    public int Bimestre { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public string Turma { get; set; } = string.Empty;
    public string Disciplina { get; set; } = string.Empty;
}