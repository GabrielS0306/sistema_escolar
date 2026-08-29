namespace SistemaEscolar.Api.DTOs;

public class AlunoResponseDto
{
    public Guid Id { get; set; }
    public string Matricula { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
}