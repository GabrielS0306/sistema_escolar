// AdminResponseDto.cs
namespace SistemaEscolar.Api.DTOs;

public class AdminResponseDto
{
    public Guid Id { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
}