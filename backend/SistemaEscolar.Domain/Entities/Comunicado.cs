namespace SistemaEscolar.Domain.Entities;

public enum PublicoAlvoComunicado
{
    TodaEscola,
    Turma,
    Professores,
    Alunos
}

public class Comunicado
{
    public Guid Id { get; set; }

    public string Titulo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;

    public PublicoAlvoComunicado PublicoAlvo { get; set; }

    public Guid? TurmaId { get; set; }
    public Turma? Turma { get; set; }

    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;
}