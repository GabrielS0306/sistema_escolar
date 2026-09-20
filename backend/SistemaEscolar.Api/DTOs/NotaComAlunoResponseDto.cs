namespace SistemaEscolar.Api.DTOs;

public class NotaComAlunoResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int Bimestre { get; set; }
    public string NomeAvaliacao { get; set; } = string.Empty;
}