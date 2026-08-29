namespace SistemaEscolar.Api.DTOs;

public class CreateMatriculaDto
{
    public Guid AlunoId { get; set; }
    public Guid TurmaId { get; set; }
}