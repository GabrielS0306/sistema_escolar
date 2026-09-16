using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Domain.Entities;

public class DocumentoUsuario
{
    public Guid Id { get; set; }

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public TipoDocumento Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string ArquivoUrl { get; set; } = string.Empty;
    public DateTime Data { get; set; } = DateTime.UtcNow;

    public Guid RegistradoPorUsuarioId { get; set; }
    public Usuario RegistradoPorUsuario { get; set; } = null!;
}