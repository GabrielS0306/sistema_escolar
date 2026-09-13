using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComunicadosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ComunicadosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ComunicadoResponseDto>>> GetAll()
    {
        var comunicados = await _context.Comunicados
            .Include(c => c.Turma)
            .OrderByDescending(c => c.DataEnvio)
            .Select(c => new ComunicadoResponseDto
            {
                Id = c.Id,
                Titulo = c.Titulo,
                Mensagem = c.Mensagem,
                PublicoAlvo = c.PublicoAlvo,
                Turma = c.Turma != null ? c.Turma.Nome : null,
                DataEnvio = c.DataEnvio
            })
            .ToListAsync();

        return Ok(comunicados);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Coordenador,Professor")]
    public async Task<ActionResult<ComunicadoResponseDto>> Create(CreateComunicadoDto dto)
    {
        if (dto.PublicoAlvo == PublicoAlvoComunicado.Turma && dto.TurmaId is null)
            return BadRequest("TurmaId é obrigatório quando o público-alvo é Turma.");

        Turma? turma = null;
        if (dto.TurmaId is not null)
        {
            turma = await _context.Turmas.FindAsync(dto.TurmaId);
            if (turma is null) return BadRequest("TurmaId informado não existe.");
        }

        var comunicado = new Comunicado
        {
            Id = Guid.NewGuid(),
            Titulo = dto.Titulo,
            Mensagem = dto.Mensagem,
            PublicoAlvo = dto.PublicoAlvo,
            TurmaId = dto.TurmaId,
            DataEnvio = DateTime.UtcNow
        };

        _context.Comunicados.Add(comunicado);
        await _context.SaveChangesAsync();

        var response = new ComunicadoResponseDto
        {
            Id = comunicado.Id,
            Titulo = comunicado.Titulo,
            Mensagem = comunicado.Mensagem,
            PublicoAlvo = comunicado.PublicoAlvo,
            Turma = turma?.Nome,
            DataEnvio = comunicado.DataEnvio
        };

        return CreatedAtAction(nameof(GetAll), response);
    }
}