using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Domain.Entities.Perfis;

public class Admin
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
}