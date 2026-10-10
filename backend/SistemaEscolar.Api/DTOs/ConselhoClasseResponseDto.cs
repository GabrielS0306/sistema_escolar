using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class ConselhoClasseResponseDto
{
    public Guid Id { get; set; }
    public Guid AlunoId { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public int AnoLetivo { get; set; }
    public DateTime Data { get; set; }
    public ResultadoConselho Resultado { get; set; }
    public int VotosAprovar { get; set; }
    public int VotosReprovar { get; set; }
    public TipoVoto? MeuVoto { get; set; }  // null = professor logado ainda não votou (ou usuário não é professor)
    public List<string> DisciplinasReprovadas { get; set; } = new();
}
