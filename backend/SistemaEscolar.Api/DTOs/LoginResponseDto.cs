namespace SistemaEscolar.Api.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public List<string> Papeis { get; set; } = new();
}