using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Domain.Entities.Perfis;

public class Aluno
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public string Matricula { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }

    // TurmaId virá quando a estrutura de turmas for definida
}