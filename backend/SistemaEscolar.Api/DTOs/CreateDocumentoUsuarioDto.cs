using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class CreateDocumentoUsuarioDto
{
    public Guid UsuarioId { get; set; }
    public TipoDocumento Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
}