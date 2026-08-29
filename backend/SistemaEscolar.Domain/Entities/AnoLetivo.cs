namespace SistemaEscolar.Domain.Entities;

public class AnoLetivo
{
    public Guid Id { get; set; }
    public int Ano { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public bool Ativo { get; set; } = true;
}