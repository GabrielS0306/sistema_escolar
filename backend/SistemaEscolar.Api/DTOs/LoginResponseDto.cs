namespace SistemaEscolar.Api.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Papel { get; set; } = string.Empty; // "Aluno", "Professor" ou "SemPerfil"
}