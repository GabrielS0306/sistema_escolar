using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Api.Services;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly SupabaseStorageService _storageService;

    public UsuariosController(AppDbContext context, SupabaseStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioDetalhadoResponseDto>> GetById(Guid id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario is null) return NotFound();

        return Ok(new UsuarioDetalhadoResponseDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cpf = usuario.Cpf,
            Endereco = usuario.Endereco,
            FotoPerfilUrl = usuario.FotoPerfilUrl,
            DataNascimento = usuario.DataNascimento,
            Sexo = usuario.Sexo
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UsuarioDetalhadoResponseDto>> Atualizar(Guid id, [FromForm] AtualizarUsuarioAdminDto dto, IFormFile? foto)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario is null) return NotFound();

        if (dto.Nome is not null) usuario.Nome = dto.Nome;
        if (dto.Email is not null) usuario.Email = dto.Email;
        if (dto.Telefone is not null) usuario.Telefone = dto.Telefone;
        if (dto.Cpf is not null) usuario.Cpf = dto.Cpf;
        if (dto.Endereco is not null) usuario.Endereco = dto.Endereco;
        if (dto.DataNascimento.HasValue)
            usuario.DataNascimento = DateTime.SpecifyKind(dto.DataNascimento.Value, DateTimeKind.Utc);
        if (dto.Sexo.HasValue) usuario.Sexo = dto.Sexo;
        if (dto.Ativo.HasValue) usuario.Ativo = dto.Ativo.Value;

        if (foto is not null)
        {
            usuario.FotoPerfilUrl = await _storageService.UploadFotoAsync(foto, usuario.Id);
        }

        await _context.SaveChangesAsync();

        return Ok(new UsuarioDetalhadoResponseDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cpf = usuario.Cpf,
            Endereco = usuario.Endereco,
            FotoPerfilUrl = usuario.FotoPerfilUrl,
            DataNascimento = usuario.DataNascimento,
            Sexo = usuario.Sexo
        });
    }
}