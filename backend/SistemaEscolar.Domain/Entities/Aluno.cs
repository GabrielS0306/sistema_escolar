namespace SistemaEscolar.Domain.Entities.Perfis;

public class Aluno
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    // campos específicos do aluno virão depois (turma, matrícula, etc.)
}