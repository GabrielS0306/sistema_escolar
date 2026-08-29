namespace SistemaEscolar.Domain.Entities;

public class Avaliacao
{
    public Guid Id { get; set; }

    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public ProfessorTurmaDisciplina ProfessorTurmaDisciplina { get; set; } = null!;

    public int Bimestre { get; set; }        // 1, 2, 3 ou 4
    public string Nome { get; set; } = string.Empty;  // ex: "AV1", "Trabalho em grupo"
    public DateTime Data { get; set; }
}