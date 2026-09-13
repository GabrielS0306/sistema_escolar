using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoordenadoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public CoordenadoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoordenadorResponseDto>>> GetAll()
    {
        var coordenadores = await _context.Coordenadores
            .Include(c => c.Usuario)
            .Select(c => new CoordenadorResponseDto { Id = c.Id, NomeUsuario = c.Usuario.Nome })
            .ToListAsync();

        return Ok(coordenadores);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CoordenadorResponseDto>> Create(CreateCoordenadorDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var coordenador = new Coordenador { Id = Guid.NewGuid(), UsuarioId = dto.UsuarioId };

        _context.Coordenadores.Add(coordenador);
        await _context.SaveChangesAsync();

        var response = new CoordenadorResponseDto { Id = coordenador.Id, NomeUsuario = usuario.Nome };

        return CreatedAtAction(nameof(GetAll), response);
    }
}  