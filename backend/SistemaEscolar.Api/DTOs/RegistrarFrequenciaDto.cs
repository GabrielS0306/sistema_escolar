namespace SistemaEscolar.Api.DTOs;

public class RegistrarFrequenciaDto
{
    public Guid ProfessorTurmaDisciplinaId { get; set; }
    public DateTime Data { get; set; }
    public List<PresencaAlunoDto> Presencas { get; set; } = new();
}

public class PresencaAlunoDto
{
    public Guid AlunoId { get; set; }
    public bool Presente { get; set; }
}