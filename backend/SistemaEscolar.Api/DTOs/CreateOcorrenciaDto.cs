using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

// Quem registra não vem aqui: o backend usa o usuário do token.
public class CreateOcorrenciaDto
{
    public Guid AlunoId { get; set; }
    public TipoOcorrencia Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
}
