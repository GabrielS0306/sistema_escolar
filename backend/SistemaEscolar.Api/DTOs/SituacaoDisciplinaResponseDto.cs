using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class SituacaoDisciplinaResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string Disciplina { get; set; } = string.Empty;
    public string Turma { get; set; } = string.Empty;
    public decimal? MediaFinal { get; set; }
    public StatusDisciplina Status { get; set; }
}