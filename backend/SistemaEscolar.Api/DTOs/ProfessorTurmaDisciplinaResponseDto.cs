namespace SistemaEscolar.Api.DTOs;

public class ProfessorTurmaDisciplinaResponseDto
{
    public Guid Id { get; set; }
    public string NomeProfessor { get; set; } = string.Empty;
    public string Turma { get; set; } = string.Empty;
    public string Disciplina { get; set; } = string.Empty;
}