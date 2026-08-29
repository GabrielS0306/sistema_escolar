namespace SistemaEscolar.Api.DTOs;

public class CreateProfessorTurmaDisciplinaDto
{
    public Guid ProfessorId { get; set; }
    public Guid TurmaId { get; set; }
    public Guid DisciplinaId { get; set; }
}