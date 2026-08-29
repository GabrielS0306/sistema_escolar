namespace SistemaEscolar.Api.DTOs;

public class CreateAnoLetivoDto
{
    public int Ano { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
}