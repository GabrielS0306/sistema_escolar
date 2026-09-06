using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("registrar")]
    public async Task<ActionResult<UsuarioResponseDto>> Registrar(RegistrarDto dto)
    {
        var emailJaExiste = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
        if (emailJaExiste) return BadRequest("Já existe um usuário com esse email.");

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Nome = dto.Nome,
            Email = dto.Email,
            SenhaHash = senhaHash,
            Ativo = true,
            CriadoEm = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var response = new UsuarioResponseDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email
        };

        return CreatedAtAction(nameof(Registrar), response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (usuario is null) return Unauthorized("Email ou senha inválidos.");

        var senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
        if (!senhaValida) return Unauthorized("Email ou senha inválidos.");

        var ehAluno = await _context.Alunos.AnyAsync(a => a.UsuarioId == usuario.Id);
        var ehProfessor = await _context.Professores.AnyAsync(p => p.UsuarioId == usuario.Id);

        var papel = ehAluno ? "Aluno" : ehProfessor ? "Professor" : "SemPerfil";

        var token = GerarToken(usuario, papel);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Nome = usuario.Nome,
            Papel = papel
        });
    }

    private string GerarToken(Usuario usuario, string papel)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;

        var claims = new[]
        {
            new System.Security.Claims.Claim("sub", usuario.Id.ToString()),
            new System.Security.Claims.Claim("nome", usuario.Nome),
            new System.Security.Claims.Claim("papel", papel)
        };

        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
            key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    }
}