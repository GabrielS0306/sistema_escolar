using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnoLetivosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnoLetivosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnoLetivoResponseDto>>> GetAll()
    {
        var anos = await _context.AnosLetivos
            .Select(a => new AnoLetivoResponseDto
            {
                Id = a.Id,
                Ano = a.Ano,
                DataInicio = a.DataInicio,
                DataFim = a.DataFim,
                Ativo = a.Ativo
            })
            .ToListAsync();

        return Ok(anos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnoLetivoResponseDto>> GetById(Guid id)
    {
        var ano = await _context.AnosLetivos
            .Where(a => a.Id == id)
            .Select(a => new AnoLetivoResponseDto
            {
                Id = a.Id,
                Ano = a.Ano,
                DataInicio = a.DataInicio,
                DataFim = a.DataFim,
                Ativo = a.Ativo
            })
            .FirstOrDefaultAsync();

        if (ano is null) return NotFound();

        return Ok(ano);
    }

    [HttpPost]
    public async Task<ActionResult<AnoLetivoResponseDto>> Create(CreateAnoLetivoDto dto)
    {
        var anoLetivo = new AnoLetivo
        {
            Id = Guid.NewGuid(),
            Ano = dto.Ano,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim,
            Ativo = true
        };

        _context.AnosLetivos.Add(anoLetivo);
        await _context.SaveChangesAsync();

        var response = new AnoLetivoResponseDto
        {
            Id = anoLetivo.Id,
            Ano = anoLetivo.Ano,
            DataInicio = anoLetivo.DataInicio,
            DataFim = anoLetivo.DataFim,
            Ativo = anoLetivo.Ativo
        };

        return CreatedAtAction(nameof(GetById), new { id = anoLetivo.Id }, response);
    }
}