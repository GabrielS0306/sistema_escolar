namespace SistemaEscolar.Api.DTOs;

public class FrequenciaResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public bool Presente { get; set; }
}