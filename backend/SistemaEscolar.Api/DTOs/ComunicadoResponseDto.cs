using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class ComunicadoResponseDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public PublicoAlvoComunicado PublicoAlvo { get; set; }
    public string? Turma { get; set; }
    public DateTime DataEnvio { get; set; }
}