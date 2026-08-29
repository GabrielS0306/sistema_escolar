using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessorTurmaDisciplinasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfessorTurmaDisciplinasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfessorTurmaDisciplinaResponseDto>>> GetAll()
    {
        var vinculos = await _context.ProfessorTurmaDisciplinas
            .Include(v => v.Professor).ThenInclude(p => p.Usuario)
            .Include(v => v.Turma)
            .Include(v => v.Disciplina)
            .Select(v => new ProfessorTurmaDisciplinaResponseDto
            {
                Id = v.Id,
                NomeProfessor = v.Professor.Usuario.Nome,
                Turma = v.Turma.Nome,
                Disciplina = v.Disciplina.Nome
            })
            .ToListAsync();

        return Ok(vinculos);
    }

    [HttpPost]
    public async Task<ActionResult<ProfessorTurmaDisciplinaResponseDto>> Create(CreateProfessorTurmaDisciplinaDto dto)
    {
        var professor = await _context.Professores
            .Include(p => p.Usuario)
            .FirstOrDefaultAsync(p => p.Id == dto.ProfessorId);
        if (professor is null) return BadRequest("ProfessorId informado não existe.");

        var turma = await _context.Turmas.FindAsync(dto.TurmaId);
        if (turma is null) return BadRequest("TurmaId informado não existe.");

        var disciplina = await _context.Disciplinas.FindAsync(dto.DisciplinaId);
        if (disciplina is null) return BadRequest("DisciplinaId informado não existe.");

        var vinculo = new ProfessorTurmaDisciplina
        {
            Id = Guid.NewGuid(),
            ProfessorId = dto.ProfessorId,
            TurmaId = dto.TurmaId,
            DisciplinaId = dto.DisciplinaId
        };

        _context.ProfessorTurmaDisciplinas.Add(vinculo);
        await _context.SaveChangesAsync();

        var response = new ProfessorTurmaDisciplinaResponseDto
        {
            Id = vinculo.Id,
            NomeProfessor = professor.Usuario.Nome,
            Turma = turma.Nome,
            Disciplina = disciplina.Nome
        };

        return CreatedAtAction(nameof(GetAll), response);
    }
}