namespace SistemaEscolar.Api.DTOs;

public class ResumoAlunoResponseDto
{
    public string NomeAluno { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public List<SituacaoDisciplinaResponseDto> SituacoesDisciplina { get; set; } = new();
    public List<FrequenciaResponseDto> Frequencias { get; set; } = new();
    public List<NotaComAvaliacaoResponseDto> Notas { get; set; } = new();
    public List<OcorrenciaResponseDto> Ocorrencias { get; set; } = new();
}