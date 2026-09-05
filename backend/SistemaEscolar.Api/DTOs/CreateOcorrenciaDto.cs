using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class CreateOcorrenciaDto
{
    public Guid AlunoId { get; set; }
    public Guid RegistradoPorUsuarioId { get; set; }
    public TipoOcorrencia Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
}