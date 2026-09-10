using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuncionariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public FuncionariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FuncionarioResponseDto>>> GetAll()
    {
        var funcionarios = await _context.Funcionarios
            .Include(f => f.Usuario)
            .Select(f => new FuncionarioResponseDto { Id = f.Id, NomeUsuario = f.Usuario.Nome })
            .ToListAsync();

        return Ok(funcionarios);
    }

    [HttpPost]
    public async Task<ActionResult<FuncionarioResponseDto>> Create(CreateFuncionarioDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var funcionario = new Funcionario { Id = Guid.NewGuid(), UsuarioId = dto.UsuarioId };

        _context.Funcionarios.Add(funcionario);
        await _context.SaveChangesAsync();

        var response = new FuncionarioResponseDto { Id = funcionario.Id, NomeUsuario = usuario.Nome };

        return CreatedAtAction(nameof(GetAll), response);
    }
}   