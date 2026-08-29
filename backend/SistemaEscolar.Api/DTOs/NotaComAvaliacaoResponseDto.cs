namespace SistemaEscolar.Api.DTOs;

public class NotaComAvaliacaoResponseDto
{
    public Guid Id { get; set; }
    public decimal Valor { get; set; }
    public int Bimestre { get; set; }
    public string NomeAvaliacao { get; set; } = string.Empty;
}