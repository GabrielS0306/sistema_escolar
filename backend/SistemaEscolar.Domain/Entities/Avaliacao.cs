namespace SistemaEscolar.Domain.Entities;

public enum TipoAvaliacao
{
    Comportamento,
    Atividade,
    ProvaBimestral
}

public class Avaliacao
{
    public Guid Id { get; set; }

    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public ProfessorTurmaDisciplina ProfessorTurmaDisciplina { get; set; } = null!;

    public int Bimestre { get; set; }
    public TipoAvaliacao Tipo { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}