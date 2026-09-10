// FuncionarioResponseDto.cs
namespace SistemaEscolar.Api.DTOs;

public class FuncionarioResponseDto
{
    public Guid Id { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
}