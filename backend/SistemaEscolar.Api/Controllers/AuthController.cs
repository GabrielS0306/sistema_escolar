using SistemaEscolar.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly SupabaseStorageService _storageService;

    public AuthController(AppDbContext context, IConfiguration configuration, SupabaseStorageService storageService)
    {
        _context = context;
        _configuration = configuration;
        _storageService = storageService;
    }

    [HttpPost("registrar")]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<UsuarioResponseDto>> Registrar([FromForm] RegistrarDto dto, IFormFile? foto)
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
            CriadoEm = DateTime.UtcNow,
            Telefone = dto.Telefone,
            Cpf = dto.Cpf,
            Endereco = dto.Endereco,
            DataNascimento = dto.DataNascimento.HasValue
                ? DateTime.SpecifyKind(dto.DataNascimento.Value, DateTimeKind.Utc)
                : null,
            Sexo = dto.Sexo
        };

        if (foto is not null)
        {
            usuario.FotoPerfilUrl = await _storageService.UploadFotoAsync(foto, usuario.Id);
        }

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
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (usuario is null) return Unauthorized("Email ou senha inválidos.");

        var senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
        if (!senhaValida) return Unauthorized("Email ou senha inválidos.");

        var papeis = new List<string>();

        if (await _context.Admins.AnyAsync(a => a.UsuarioId == usuario.Id)) papeis.Add("Admin");
        if (await _context.Coordenadores.AnyAsync(c => c.UsuarioId == usuario.Id)) papeis.Add("Coordenador");
        if (await _context.Professores.AnyAsync(p => p.UsuarioId == usuario.Id)) papeis.Add("Professor");
        if (await _context.Responsaveis.AnyAsync(r => r.UsuarioId == usuario.Id)) papeis.Add("Responsavel");
        if (await _context.Alunos.AnyAsync(a => a.UsuarioId == usuario.Id)) papeis.Add("Aluno");
        if (await _context.Funcionarios.AnyAsync(f => f.UsuarioId == usuario.Id)) papeis.Add("Funcionario");

        if (papeis.Count == 0) papeis.Add("SemPerfil");

        var token = GerarToken(usuario, papeis);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Nome = usuario.Nome,
            Papeis = papeis
        });
    }
    private string GerarToken(Usuario usuario, List<string> papeis)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;

        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim("sub", usuario.Id.ToString()),
            new System.Security.Claims.Claim("nome", usuario.Nome)
        };

        foreach (var papel in papeis)
            claims.Add(new System.Security.Claims.Claim("papel", papel));

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