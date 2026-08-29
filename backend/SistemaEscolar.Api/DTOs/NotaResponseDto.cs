namespace SistemaEscolar.Api.DTOs;

public class NotaResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public decimal Valor { get; set; }
}