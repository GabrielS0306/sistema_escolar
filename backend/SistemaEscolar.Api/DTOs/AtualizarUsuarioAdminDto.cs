using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Api.DTOs;

public class AtualizarUsuarioAdminDto
{
    public string? Nome { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Cpf { get; set; }
    public string? Endereco { get; set; }
    public DateTime? DataNascimento { get; set; }
    public Sexo? Sexo { get; set; }
    public bool? Ativo { get; set; }
}