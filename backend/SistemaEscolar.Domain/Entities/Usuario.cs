using SistemaEscolar.Domain.Enums;

namespace SistemaEscolar.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public string? Telefone { get; set; }
    public string? Cpf { get; set; }
    public string? Endereco { get; set; }
    public string? FotoPerfilUrl { get; set; }
    public DateTime? DataNascimento { get; set; }
    public Sexo? Sexo { get; set; }
}