using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class RegistrarDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Cpf { get; set; }
    public string? Endereco { get; set; }
    public DateTime? DataNascimento { get; set; }
    public Sexo? Sexo { get; set; }
}