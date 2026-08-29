namespace SistemaEscolar.Api.DTOs;

public class MatriculaResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public string Turma { get; set; } = string.Empty;
    public DateTime DataMatricula { get; set; }
}