using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Api.DTOs;

public class RegistrarVotoDto
{
    public Guid ProfessorId { get; set; }
    public TipoVoto Voto { get; set; }
}