using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvaliacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvaliacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AvaliacaoResponseDto>>> GetAll()
    {
        var avaliacoes = await _context.Avaliacoes
            .Include(a => a.ProfessorTurmaDisciplina).ThenInclude(v => v.Turma)
            .Include(a => a.ProfessorTurmaDisciplina).ThenInclude(v => v.Disciplina)
            .Select(a => new AvaliacaoResponseDto
            {
                Id = a.Id,
                Bimestre = a.Bimestre,
                Tipo = a.Tipo, 
                Nome = a.Nome,
                Data = a.Data,
                Turma = a.ProfessorTurmaDisciplina.Turma.Nome,
                Disciplina = a.ProfessorTurmaDisciplina.Disciplina.Nome
            })
            .ToListAsync();

        return Ok(avaliacoes);
    }

    [HttpPost]
    public async Task<ActionResult<AvaliacaoResponseDto>> Create(CreateAvaliacaoDto dto)
    {
        var vinculo = await _context.ProfessorTurmaDisciplinas
            .Include(v => v.Turma)
            .Include(v => v.Disciplina)
            .FirstOrDefaultAsync(v => v.Id == dto.ProfessorTurmaDisciplinaId);

        if (vinculo is null) return BadRequest("ProfessorTurmaDisciplinaId informado não existe.");

        var avaliacao = new Avaliacao
        {
            Id = Guid.NewGuid(),
            ProfessorTurmaDisciplinaId = dto.ProfessorTurmaDisciplinaId,
            Bimestre = dto.Bimestre,
            Tipo = dto.Tipo,
            Nome = dto.Nome,
            Data = dto.Data
        };

        _context.Avaliacoes.Add(avaliacao);
        await _context.SaveChangesAsync();

        var response = new AvaliacaoResponseDto
        {
            Id = avaliacao.Id,
            Bimestre = avaliacao.Bimestre,
            Tipo = avaliacao.Tipo,
            Nome = avaliacao.Nome,
            Data = avaliacao.Data,
            Turma = vinculo.Turma.Nome,
            Disciplina = vinculo.Disciplina.Nome
        };

        return CreatedAtAction(nameof(GetAll), response);
    }
}