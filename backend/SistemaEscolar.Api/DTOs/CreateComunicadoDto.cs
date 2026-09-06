using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class CreateComunicadoDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public PublicoAlvoComunicado PublicoAlvo { get; set; }
    public Guid? TurmaId { get; set; }
}