// ResponsavelResponseDto.cs
namespace SistemaEscolar.Api.DTOs;

public class ResponsavelResponseDto
{
    public Guid Id { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
}