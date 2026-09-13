using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminResponseDto>>> GetAll()
    {
        var admins = await _context.Admins
            .Include(a => a.Usuario)
            .Select(a => new AdminResponseDto { Id = a.Id, NomeUsuario = a.Usuario.Nome })
            .ToListAsync();

        return Ok(admins);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdminResponseDto>> Create(CreateAdminDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var admin = new Admin { Id = Guid.NewGuid(), UsuarioId = dto.UsuarioId };

        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();

        var response = new AdminResponseDto { Id = admin.Id, NomeUsuario = usuario.Nome };

        return CreatedAtAction(nameof(GetAll), response);
    }
}