namespace SistemaEscolar.Api.DTOs;

// Linha da tela de Recuperação: aluno + disciplina aguardando prova final.
public class SituacaoRecuperacaoResponseDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public string Disciplina { get; set; } = string.Empty;
    public string Turma { get; set; } = string.Empty;
    public int AnoLetivo { get; set; }
    public decimal? MediaFinal { get; set; }
}
