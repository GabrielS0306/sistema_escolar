using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class DocumentoUsuarioResponseDto
{
    public Guid Id { get; set; }
    public TipoDocumento Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string ArquivoUrl { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public string RegistradoPor { get; set; } = string.Empty;
}