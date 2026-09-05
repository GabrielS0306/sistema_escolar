using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class OcorrenciaResponseDto
{
    public Guid Id { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string RegistradoPor { get; set; } = string.Empty;
    public TipoOcorrencia Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}