using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TurmasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TurmasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TurmaResponseDto>>> GetAll()
    {
        var turmas = await _context.Turmas
            .Include(t => t.AnoLetivo)
            .Select(t => new TurmaResponseDto
            {
                Id = t.Id,
                Nome = t.Nome,
                Serie = t.Serie,
                Turno = t.Turno,
                AnoLetivo = t.AnoLetivo.Ano
            })
            .ToListAsync();

        return Ok(turmas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TurmaResponseDto>> GetById(Guid id)
    {
        var turma = await _context.Turmas
            .Include(t => t.AnoLetivo)
            .Where(t => t.Id == id)
            .Select(t => new TurmaResponseDto
            {
                Id = t.Id,
                Nome = t.Nome,
                Serie = t.Serie,
                Turno = t.Turno,
                AnoLetivo = t.AnoLetivo.Ano
            })
            .FirstOrDefaultAsync();

        if (turma is null) return NotFound();

        return Ok(turma);
    }

    [HttpPost]
    public async Task<ActionResult<TurmaResponseDto>> Create(CreateTurmaDto dto)
    {
        var anoLetivo = await _context.AnosLetivos.FindAsync(dto.AnoLetivoId);
        if (anoLetivo is null) return BadRequest("AnoLetivoId informado não existe.");

        var turma = new Turma
        {
            Id = Guid.NewGuid(),
            AnoLetivoId = dto.AnoLetivoId,
            Nome = dto.Nome,
            Serie = dto.Serie,
            Turno = dto.Turno
        };

        _context.Turmas.Add(turma);
        await _context.SaveChangesAsync();

        var response = new TurmaResponseDto
        {
            Id = turma.Id,
            Nome = turma.Nome,
            Serie = turma.Serie,
            Turno = turma.Turno,
            AnoLetivo = anoLetivo.Ano
        };

        return CreatedAtAction(nameof(GetById), new { id = turma.Id }, response);
    }
}