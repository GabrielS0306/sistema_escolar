using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfessoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfessorResponseDto>>> GetAll()
    {
        var professores = await _context.Professores
            .Include(p => p.Usuario)
            .Select(p => new ProfessorResponseDto
            {
                Id = p.Id,
                NomeUsuario = p.Usuario.Nome
            })
            .ToListAsync();

        return Ok(professores);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProfessorResponseDto>> GetById(Guid id)
    {
        var professor = await _context.Professores
            .Include(p => p.Usuario)
            .Where(p => p.Id == id)
            .Select(p => new ProfessorResponseDto
            {
                Id = p.Id,
                NomeUsuario = p.Usuario.Nome
            })
            .FirstOrDefaultAsync();

        if (professor is null) return NotFound();

        return Ok(professor);
    }

    [HttpPost]
    public async Task<ActionResult<ProfessorResponseDto>> Create(CreateProfessorDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var professor = new Professor
        {
            Id = Guid.NewGuid(),
            UsuarioId = dto.UsuarioId
        };

        _context.Professores.Add(professor);
        await _context.SaveChangesAsync();

        var response = new ProfessorResponseDto
        {
            Id = professor.Id,
            NomeUsuario = usuario.Nome
        };

        return CreatedAtAction(nameof(GetById), new { id = professor.Id }, response);
    }
}