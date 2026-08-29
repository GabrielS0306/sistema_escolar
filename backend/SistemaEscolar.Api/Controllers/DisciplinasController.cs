using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DisciplinasController : ControllerBase
{
    private readonly AppDbContext _context;

    public DisciplinasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DisciplinaResponseDto>>> GetAll()
    {
        var disciplinas = await _context.Disciplinas
            .Select(d => new DisciplinaResponseDto { Id = d.Id, Nome = d.Nome })
            .ToListAsync();

        return Ok(disciplinas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DisciplinaResponseDto>> GetById(Guid id)
    {
        var disciplina = await _context.Disciplinas
            .Where(d => d.Id == id)
            .Select(d => new DisciplinaResponseDto { Id = d.Id, Nome = d.Nome })
            .FirstOrDefaultAsync();

        if (disciplina is null) return NotFound();

        return Ok(disciplina);
    }

    [HttpPost]
    public async Task<ActionResult<DisciplinaResponseDto>> Create(CreateDisciplinaDto dto)
    {
        var disciplina = new Disciplina
        {
            Id = Guid.NewGuid(),
            Nome = dto.Nome
        };

        _context.Disciplinas.Add(disciplina);
        await _context.SaveChangesAsync();

        var response = new DisciplinaResponseDto { Id = disciplina.Id, Nome = disciplina.Nome };

        return CreatedAtAction(nameof(GetById), new { id = disciplina.Id }, response);
    }
}