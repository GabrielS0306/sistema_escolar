using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class CreateAvaliacaoDto
{
    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public int Bimestre { get; set; }
    public TipoAvaliacao Tipo { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}