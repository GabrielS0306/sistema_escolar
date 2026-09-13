namespace SistemaEscolar.Api.DTOs;

public class CreateAlunoDto
{
    public Guid UsuarioId { get; set; }
    public string Matricula { get; set; } = string.Empty;
}